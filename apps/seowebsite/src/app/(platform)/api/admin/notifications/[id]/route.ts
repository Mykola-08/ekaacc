import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/platform/supabase'
import { getCurrentUser } from '@/lib/platform/server-auth'

// PATCH /api/admin/notifications/[id] - Update notification
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params
    const updateData = await request.json() as any

    const { data: notification, error } = await supabase
      .from('admin_notifications')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
        updated_by: currentUser.id
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating notification:', error)
      return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 })
    }

    // Log the admin action
    await supabase.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'notification_updated',
      resource: 'admin_notifications',
      resource_id: id,
      details: updateData,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      status: 'success'
    })

    return NextResponse.json({ notification })

  } catch (error) {
    console.error('Error in PATCH /api/admin/notifications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/notifications/[id] - Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params

    const { error } = await supabase
      .from('admin_notifications')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting notification:', error)
      return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 })
    }

    // Log the admin action
    await supabase.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'notification_deleted',
      resource: 'admin_notifications',
      resource_id: id,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      user_agent: request.headers.get('user-agent') || 'unknown',
      status: 'success'
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in DELETE /api/admin/notifications/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/notifications/[id]/test - Send test notification
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Check admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { id } = await params

    // Get the notification
    const { data: notification, error: notificationError } = await supabase
      .from('admin_notifications')
      .select('*')
      .eq('id', id)
      .single()

    if (notificationError || !notification) {
      return NextResponse.json({ error: 'Notification not found' }, { status: 404 })
    }

    // Send test notification to current admin
    const { error: testError } = await supabase
      .from('user_notifications')
      .insert({
        user_id: currentUser.id,
        title: `[TEST] ${notification.title}`,
        message: `[TEST] ${notification.message}`,
        type: notification.type,
        priority: notification.priority,
        is_read: false,
        admin_notification_id: notification.id,
        expires_at: notification.expires_at
      })

    if (testError) {
      console.error('Error sending test notification:', testError)
      return NextResponse.json({ error: 'Failed to send test notification' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error in POST /api/admin/notifications/[id]/test:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}