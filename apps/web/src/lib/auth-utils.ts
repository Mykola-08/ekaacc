import { supabase } from '@/lib/supabase'
import { safeSupabaseQuery, safeSupabaseInsert, safeSupabaseDelete } from '@/lib/supabase-utils'
import type { UserRole, Permission } from '@/types/auth'

/**
 * Get user role by user ID
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data, error } = await safeSupabaseQuery<any>(
    supabase
      .from('user_role_assignments')
      .select(`
        user_roles!inner(*)
      `)
      .eq('user_id', userId)
      .single()
  )

  if (error || !data) {
    console.error('Error fetching user role:', error)
    return null
  }

  return data.user_roles
}

/**
 * Get user permissions by user ID
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  // First get the role assignment
  const { data: roleData, error: roleError } = await safeSupabaseQuery<any>(
    supabase
      .from('user_role_assignments')
      .select('role_id')
      .eq('user_id', userId)
      .single()
  )

  if (roleError || !roleData) {
    console.error('Error fetching user role assignment:', roleError)
    return []
  }

  const { data, error } = await safeSupabaseQuery<any>(
    supabase
      .from('role_permissions')
      .select(`
        permissions!inner(*)
      `)
      .eq('role_id', roleData.role_id)
  )

  if (error || !data) {
    console.error('Error fetching user permissions:', error)
    return []
  }

  return data.map((p: any) => p.permissions)
}

/**
 * Check if user has a specific permission
 */
export async function hasUserPermission(userId: string, permissionName: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId)
  return permissions.some(p => p.name === permissionName)
}

/**
 * Check if user can access a resource with specific action
 */
export async function canUserAccessResource(
  userId: string, 
  resource: string, 
  action: string
): Promise<boolean> {
  const permissionName = `${resource}.${action}`
  return hasUserPermission(userId, permissionName)
}

/**
 * Assign role to user (admin only)
 */
export async function assignUserRole(
  userId: string, 
  roleId: string, 
  assignedBy?: string
): Promise<{ error: Error | null }> {
  const { error } = await safeSupabaseInsert<any>(
    'user_role_assignments',
    {
      user_id: userId,
      role_id: roleId,
      assigned_by: assignedBy,
    }
  )

  if (error) {
    console.error('Error assigning user role:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Remove role from user (admin only)
 */
export async function removeUserRole(userId: string, roleId: string): Promise<{ error: Error | null }> {
  const { error } = await safeSupabaseDelete(
    'user_role_assignments',
    { user_id: userId, role_id: roleId }
  )

  if (error) {
    console.error('Error removing user role:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  userId: string | null,
  action: string,
  resourceType?: string,
  resourceId?: string,
  details?: Record<string, any>
): Promise<{ error: Error | null }> {
  const { error } = await safeSupabaseInsert<any>(
    'audit_logs',
    {
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: null, // Will be set by RLS policy
      user_agent: null, // Will be set by RLS policy
    }
  )

  if (error) {
    console.error('Error creating audit log:', error)
    return { error }
  }

  return { error: null }
}

/**
 * Get audit logs for a user
 */
export async function getUserAuditLogs(userId: string, limit = 50): Promise<any[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching user audit logs:', error)
    return []
  }

  return data || []
}

/**
 * Get all roles
 */
export async function getAllRoles(): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching roles:', error)
    return []
  }

  return data || []
}

/**
 * Get all permissions
 */
export async function getAllPermissions(): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching permissions:', error)
    return []
  }

  return data || []
}