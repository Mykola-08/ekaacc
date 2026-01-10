import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/platform/supabase'
import { getCurrentUser } from '@/lib/platform/supabase'

// Enhanced user management with advanced filtering and bulk operations
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || 'all'
    const status = searchParams.get('status') || 'all'
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const lastActiveDays = searchParams.get('lastActiveDays')

    const offset = (page - 1) * limit

    // Build query with filters
    let query = supabaseAdmin
      .from('user_profiles')
      .select(`
        *,
        user_role_assignments!inner(
          role_id,
          user_roles!inner(name, description)
        ),
        user_preferences(*),
        sessions(count),
        bookings(count)
      `, { count: 'exact' })

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    // Apply role filter
    if (role !== 'all') {
      query = query.eq('user_role_assignments.user_roles.name', role)
    }

    // Apply status filter
    if (status !== 'all') {
      query = query.eq('account_status', status)
    }

    // Apply date range filter
    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }
    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    // Apply last active filter
    if (lastActiveDays) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(lastActiveDays))
      query = query.gte('last_active', cutoffDate.toISOString())
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Calculate additional statistics
    const activeUsersCount = await supabaseAdmin
      .from('user_profiles')
      .select('id', { count: 'exact', head: true })
      .gte('last_active', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const newUsersThisWeek = await supabaseAdmin
      .from('user_profiles')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    return NextResponse.json({
      users: data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      statistics: {
        totalUsers: count || 0,
        activeUsers: activeUsersCount.count || 0,
        newUsersThisWeek: newUsersThisWeek.count || 0
      }
    })

  } catch (error) {
    console.error('User management error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Bulk user operations
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { action, userIds, updates } = await request.json()

    if (!action || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: 'Action and userIds are required' }, { status: 400 })
    }

    let results = []
    let auditLogs = []

    switch (action) {
      case 'bulk_suspend':
        const suspendUpdates = {
          account_status: 'suspended',
          suspended_reason: 'Bulk suspended by admin',
          suspended_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
        
        results = await Promise.all(
          userIds.map(userId => 
            supabaseAdmin.from('user_profiles').update(suspendUpdates).eq('id', userId)
          )
        )
        
        auditLogs = userIds.map(userId => ({
          user_id: currentUser.id,
          action: 'admin.bulk_suspend',
          resource_type: 'user',
          resource_id: userId,
          details: { reason: 'Bulk suspended by admin', timestamp: new Date().toISOString() },
          created_at: new Date().toISOString()
        }))
        break

      case 'bulk_activate':
        const activateUpdates = {
          account_status: 'active',
          suspended_reason: null,
          suspended_until: null
        }
        
        results = await Promise.all(
          userIds.map(userId => 
            supabaseAdmin.from('user_profiles').update(activateUpdates).eq('id', userId)
          )
        )
        
        auditLogs = userIds.map(userId => ({
          user_id: currentUser.id,
          action: 'admin.bulk_activate',
          resource_type: 'user',
          resource_id: userId,
          details: { reason: 'Bulk activated by admin', timestamp: new Date().toISOString() },
          created_at: new Date().toISOString()
        }))
        break

      case 'bulk_role_update':
        if (!updates?.roleId) {
          return NextResponse.json({ error: 'roleId is required for role updates' }, { status: 400 })
        }
        
        results = await Promise.all(
          userIds.map(userId => 
            supabaseAdmin.from('user_role_assignments')
              .update({ role_id: updates.roleId })
              .eq('user_id', userId)
          )
        )
        
        auditLogs = userIds.map(userId => ({
          user_id: currentUser.id,
          action: 'admin.bulk_role_update',
          resource_type: 'user',
          resource_id: userId,
          details: { newRoleId: updates.roleId, timestamp: new Date().toISOString() },
          created_at: new Date().toISOString()
        }))
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Log audit events
    await supabaseAdmin.from('audit_logs').insert(auditLogs)

    const successCount = results.filter(r => !r.error).length
    const errorCount = results.filter(r => r.error).length

    return NextResponse.json({
      success: true,
      message: `${successCount} users updated successfully, ${errorCount} errors`,
      results: {
        successCount,
        errorCount
      }
    })

  } catch (error) {
    console.error('Bulk operation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}