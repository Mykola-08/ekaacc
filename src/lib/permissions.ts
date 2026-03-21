import { createClient } from '@/lib/supabase/server';

export async function hasPermission(userId: string, permissionCode: string): Promise<boolean> {
  const supabase = await createClient();

  // 1. Get User Role
  const { data: user, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !user) return false;

  const role = user.user.user_metadata?.role || 'client';

  // 2. Superadmin Bypass (God Mode)
  if (role === 'super_admin') {
    return true;
  }

  // 3. Check User Override (Highest Priority)
  // We need to join with permissions table to match code
  const { data: userOverride } = await supabase
    .from('user_permissions')
    .select('is_granted, permissions!inner(code)')
    .eq('user_id', userId)
    .eq('permissions.code', permissionCode)
    .single();

  if (userOverride) {
    return userOverride.is_granted;
  }

  // 3. Check Role Default
  const { data: roleGrant } = await supabase
    .from('role_permissions')
    .select('permissions!inner(code)')
    .eq('role', role)
    .eq('permissions.code', permissionCode)
    .single();

  return !!roleGrant;
}

export async function getAllUserPermissions(userId: string) {
  const supabase = await createClient();

  // Fetch User Role
  const { data: user } = await supabase.auth.admin.getUserById(userId);
  const role = user?.user?.user_metadata?.role || 'client';

  // Fetch All Permissions
  const { data: allPermissions } = await supabase.from('permissions').select('*');

  // Superadmin bypass
  if (role === 'super_admin') {
    return (
      allPermissions?.map((p: any) => ({
        ...p,
        hasAccess: true,
        source: 'role',
      })) || []
    );
  }

  // Fetch Role Grants
  const { data: roleGrants } = await supabase
    .from('role_permissions')
    .select('permission_id')
    .eq('role', role);
  const roleDefaults = new Set(roleGrants?.map((r: any) => r.permission_id));

  // Fetch User Overrides
  const { data: userOverrides } = await supabase
    .from('user_permissions')
    .select('permission_id, is_granted')
    .eq('user_id', userId);

  const overrides = new Map<string, boolean>();
  userOverrides?.forEach((o: any) => overrides.set(o.permission_id, o.is_granted));

  // Compile Result
  return (
    allPermissions?.map((p: any) => {
      let hasAccess = false;
      let source = 'none';

      if (overrides.has(p.id)) {
        hasAccess = overrides.get(p.id)!;
        source = 'override';
      } else if (roleDefaults.has(p.id)) {
        hasAccess = true;
        source = 'role';
      }

      return {
        ...p,
        hasAccess,
        source,
      };
    }) || []
  );
}

// ─── Permission Record & can() helper ────────────────────────────────────────

export interface PermissionRecord {
  group: string;
  action: string;
}

/**
 * Returns true if the given permissions array grants access to the specified
 * group/action pair. An entry with action "manage" grants access to any action
 * within the same group.
 */
export function can(permissions: PermissionRecord[], group: string, action: string): boolean {
  return permissions.some(
    (p) => p.group === group && (p.action === action || p.action === 'manage')
  );
}
