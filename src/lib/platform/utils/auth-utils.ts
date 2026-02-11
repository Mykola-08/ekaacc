import { supabase, supabaseAdmin } from '@/lib/platform/supabase';
import {
  safeSupabaseQuery,
  safeSupabaseInsert,
  safeSupabaseDelete,
} from '@/lib/platform/supabase/utils';
import type { UserRole, Permission } from '@/lib/platform/types/auth-types';

/**
 * Get user role by user ID.
 * Reads from auth.users app_metadata (set by consolidate_user_info migration).
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  // Try users_view first (public view over auth.users)
  const { data, error } = await safeSupabaseQuery<{ role: string | null }>(
    supabase.from('users_view').select('role').eq('id', userId).maybeSingle()
  );

  if (error || !data?.role) {
    // Fallback: try admin client to read app_metadata directly
    if (supabaseAdmin) {
      const { data: adminData } = await supabaseAdmin.auth.admin.getUserById(userId);
      if (adminData?.user?.app_metadata?.role) {
        return adminData.user.app_metadata.role as UserRole;
      }
    }
    return null;
  }

  return data.role as UserRole;
}

/**
 * Get user permissions by user ID.
 * Reads role from user metadata, then queries role_permissions table.
 */
export async function getUserPermissions(userId: string): Promise<Permission[]> {
  // Get the user's role from users_view (backed by auth.users metadata)
  const { data: userData, error: userError } = await safeSupabaseQuery<{ role: string | null }>(
    supabase.from('users_view').select('role').eq('id', userId).maybeSingle()
  );

  const roleName = userData?.role;

  if (userError || !roleName) {
    // No role assigned — return empty permissions
    return [];
  }

  // Query role_permissions table using the role name (lowercase)
  const { data, error } = await safeSupabaseQuery<any[]>(
    supabase
      .from('role_permissions')
      .select('*')
      .eq('role', roleName.toLowerCase())
  );

  if (error || !data) {
    console.error('Error fetching user permissions:', error);
    return [];
  }

  // Map role_permissions rows to Permission interface
  return data.map((rp: any) => ({
    id: rp.id,
    name: `${rp.permission_group}.${rp.action}`,
    module: rp.permission_group,
    actions: [rp.action],
    description: rp.conditions ? JSON.stringify(rp.conditions) : undefined,
  }));
}

/**
 * Check if user has a specific permission
 */
export async function hasUserPermission(userId: string, permissionName: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.some((p) => p.name === permissionName);
}

/**
 * Check if user can access a resource with specific action
 */
export async function canUserAccessResource(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  const permissionName = `${resource}.${action}`;
  return hasUserPermission(userId, permissionName);
}

/**
 * Assign role to user (admin only).
 * Updates auth.users app_metadata via admin client.
 */
export async function assignUserRole(
  userId: string,
  roleName: string,
  assignedBy?: string
): Promise<{ error: Error | null }> {
  if (!supabaseAdmin) {
    return { error: new Error('Admin client not available') };
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role: roleName.toLowerCase() },
  });

  if (error) {
    console.error('Error assigning user role:', error);
    return { error };
  }

  return { error: null };
}

/**
 * Remove role from user (admin only).
 * Clears role in auth.users app_metadata.
 */
export async function removeUserRole(
  userId: string,
  _roleId?: string
): Promise<{ error: Error | null }> {
  if (!supabaseAdmin) {
    return { error: new Error('Admin client not available') };
  }

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: { role: null },
  });

  if (error) {
    console.error('Error removing user role:', error);
    return { error };
  }

  return { error: null };
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
  const { error } = await safeSupabaseInsert<any>('audit_logs', {
    user_id: userId,
    action,
    resource_type: resourceType,
    resource_id: resourceId,
    details,
    ip_address: null, // Will be set by RLS policy
    user_agent: null, // Will be set by RLS policy
  });

  if (error) {
    console.error('Error creating audit log:', error);
    return { error };
  }

  return { error: null };
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
    .limit(limit);

  if (error) {
    console.error('Error fetching user audit logs:', error);
    return [];
  }

  return data || [];
}

/**
 * Get all available roles.
 * Returns distinct roles from the role_permissions table.
 */
export async function getAllRoles(): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('role');

  if (error || !data) {
    console.error('Error fetching roles:', error);
    return [];
  }

  // Deduplicate role names
  const uniqueRoles = [...new Set(data.map((r: any) => r.role))];
  return uniqueRoles as unknown as UserRole[];
}

/**
 * Get all permissions.
 * Returns all entries from role_permissions table.
 */
export async function getAllPermissions(): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('*');

  if (error || !data) {
    console.error('Error fetching permissions:', error);
    return [];
  }

  return data.map((rp: any) => ({
    id: rp.id,
    name: `${rp.permission_group}.${rp.action}`,
    module: rp.permission_group,
    actions: [rp.action],
    description: rp.conditions ? JSON.stringify(rp.conditions) : undefined,
  }));
}
