import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/platform/supabase'
import { getCurrentUser } from '@/lib/platform/supabase'

// Helper function to get user by ID with full profile data
async function getUserById(userId: string) {
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('*, user_role_assignments!inner(role_id, user_roles!inner(name, description))')
    .eq('id', userId)
    .single()

  if (profileError) {
    throw new Error(`Failed to fetch user profile: ${profileError.message}`)
  }

  return profile
}

// Helper function to get user permissions
async function getUserPermissions(roleId: string) {
  const { data: permissions, error: permissionsError } = await supabaseAdmin
    .from('role_permissions')
    .select('permissions!inner(*)')
    .eq('role_id', roleId)

  if (permissionsError) {
    throw new Error(`Failed to fetch user permissions: ${permissionsError.message}`)
  }

  return permissions?.map(p => p.permissions) || []
}

// Check if current user has admin permission to impersonate
async function canImpersonate(userId: string) {
  const { data: roleAssignment, error } = await supabaseAdmin
    .from('user_role_assignments')
    .select('role_id, user_roles!inner(name)')
    .eq('user_id', userId)
    .single()

  if (error || !roleAssignment) {
    return false
  }

  // Check if user has admin role or specific impersonate permission
  const { data: permissions } = await supabaseAdmin
    .from('role_permissions')
    .select('permissions!inner(name)')
    .eq('role_id', roleAssignment.role_id)

  const permissionNames = permissions?.map(p => (p as any).permissions?.name).filter(Boolean) || []
  
  return permissionNames.includes('admin.impersonate') || 
         permissionNames.includes('admin.full_access') ||
         (roleAssignment.user_roles as any)?.name === 'admin'
}

export async function POST(request: NextRequest) {
  try {
    // Get current authenticated user
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const { targetUserId, reason } = await request.json()
    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      )
    }

    // Check if current user can impersonate
    const hasImpersonatePermission = await canImpersonate(currentUser.id)
    if (!hasImpersonatePermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions to impersonate users' },
        { status: 403 }
      )
    }

    // Get target user data
    const targetUserProfile = await getUserById(targetUserId)
    const targetUserPermissions = await getUserPermissions(targetUserProfile.role_id)

    // Log impersonation start (simplified audit logging)
    await supabaseAdmin.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'admin.impersonate.start',
      resource_type: 'user',
      resource_id: targetUserId,
      details: {
        reason,
        targetUserEmail: targetUserProfile.email,
        timestamp: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    })

    // Create impersonation session data
    const impersonationData = {
      originalUserId: currentUser.id,
      originalUserEmail: currentUser.email,
      targetUserId: targetUserProfile.id,
      targetUserEmail: targetUserProfile.email,
      targetUserRole: targetUserProfile.user_role_assignments.user_roles,
      targetUserPermissions,
      reason,
      startedAt: new Date().toISOString(),
      sessionId: crypto.randomUUID()
    }

    return NextResponse.json({
      success: true,
      impersonation: impersonationData,
      user: {
        id: targetUserProfile.id,
        email: targetUserProfile.email,
        role: {
          id: targetUserProfile.role_id,
          name: targetUserProfile.user_role_assignments.user_roles.name,
          description: targetUserProfile.user_role_assignments.user_roles.description,
          is_active: true,
          created_at: targetUserProfile.created_at
        },
        permissions: targetUserPermissions,
        profile: {
          id: targetUserProfile.id,
          username: targetUserProfile.username,
          full_name: targetUserProfile.full_name,
          avatar_url: targetUserProfile.avatar_url,
          bio: targetUserProfile.bio,
          created_at: targetUserProfile.created_at,
          updated_at: targetUserProfile.updated_at
        },
        preferences: {
          theme: 'system',
          language: 'en',
          timezone: 'UTC',
          email_notifications: true,
          push_notifications: true
        }
      }
    })

  } catch (error) {
    console.error('Impersonation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Stop impersonation endpoint
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const targetUserId = searchParams.get('targetUserId')
    const reason = searchParams.get('reason') || 'User ended impersonation'

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      )
    }

    // Log impersonation end (simplified audit logging)
    await supabaseAdmin.from('audit_logs').insert({
      user_id: currentUser.id,
      action: 'admin.impersonate.end',
      resource_type: 'user',
      resource_id: targetUserId,
      details: {
        reason,
        timestamp: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'Impersonation ended successfully'
    })

  } catch (error) {
    console.error('End impersonation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}