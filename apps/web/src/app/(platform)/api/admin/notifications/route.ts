import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/platform/supabase'
import { getCurrentUser } from '@/lib/platform/services/auth-service'

// GET /api/admin/notifications - Get all notifications
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const type = searchParams.get('type') || 'all'
    const status = searchParams.get('status') || 'all'

    let query = supabase
      .from('admin_notifications')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`title.ilike.%${search}%,message.ilike.%${search}%`)
    }

    if (type !== 'all') {
      query = query.eq('type', type)
    }

    if (status !== 'all') {
      query = query.eq('is_active', status === 'active')
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data: notifications, error, count } = await query.range(from, to)

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }

    // Fetch templates
    const { data: templates } = await supabase
      .from('notification_templates')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching templates:', error)
    }

    const totalPages = Math.ceil((count || 0) / limit)

    return NextResponse.json({
      notifications: notifications || [],
      templates: templates || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/notifications - Create new notification
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const notificationData = await request.json() as any
    
    // Validate required fields
    if (!notificationData.title || !notificationData.message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 })
    }

    // Create notification
    const { data: notification, error: notificationError } = await supabase
      .from('admin_notifications')
      .insert({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'info',
        recipients: notificationData.recipients || 'all',
        recipient_ids: notificationData.recipientIds || [],
        priority: notificationData.priority || 'medium',
        is_active: true,
        created_by: currentUser.id,
        expires_at: notificationData.expiresAt || null
      })
      .select()
      .single()

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
    }

    // Log the admin action
    await supabase.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'notification_created',
      resource: 'admin_notifications',
      resource_id: notification.id,
      details: notificationData,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      status: 'success'
    })

    // Send notifications based on recipients
    await sendNotifications(notification)

    return NextResponse.json({ notification })

  } catch (error) {
    console.error('Error in POST /api/admin/notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to send notifications
async function sendNotifications(notification: any) {
  try {
    let targetUsers: Array<{ id: string; email: string }> = []

    switch (notification.recipients) {
      case 'all':
        const { data: allUsers } = await supabase
          .from('user_profiles')
          .select('id, email')
        targetUsers = allUsers || []
        break

      case 'admins':
        const { data: adminUsers } = await supabase
          .from('user_profiles')
          .select('id, email')
          .eq('role', 'admin')
        targetUsers = adminUsers || []
        break

      case 'users':
        const { data: regularUsers } = await supabase
          .from('user_profiles')
          .select('id, email')
          .neq('role', 'admin')
        targetUsers = regularUsers || []
        break

      case 'specific':
        if (notification.recipient_ids && notification.recipient_ids.length > 0) {
          const { data: specificUsers } = await supabase
            .from('user_profiles')
            .select('id, email')
            .in('id', notification.recipient_ids)
          targetUsers = specificUsers || []
        }
        break
    }

    // Create user notifications
    if (targetUsers.length > 0) {
      const userNotifications = targetUsers.map(user => ({
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        is_read: false,
        admin_notification_id: notification.id,
        expires_at: notification.expires_at
      }))

      await supabase.from('user_notifications').insert(userNotifications)
    }

  } catch (error) {
    console.error('Error sending notifications:', error)
  }
}