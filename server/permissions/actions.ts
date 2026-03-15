'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ─── Types ─────────────────────────────────────────────────────────

export interface RolePermissionRow {
  id: string;
  role: string;
  permission_group: string;
  action: string;
  conditions: Record<string, any> | null;
  created_at: string;
}

export interface UserPermissionOverride {
  id: string;
  user_id: string;
  permission_group: string;
  action: string;
  is_granted: boolean;
  created_at: string;
}

// ─── Guards ────────────────────────────────────────────────────────

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const role = user.app_metadata?.role?.toLowerCase();
  if (role !== 'admin' && role !== 'super_admin') {
    throw new Error('Forbidden: admin access required');
  }
  return { supabase, user };
}

// ─── Role Permissions CRUD ─────────────────────────────────────────

export async function getRolePermissions(): Promise<RolePermissionRow[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from('role_permissions')
    .select('*')
    .order('role')
    .order('permission_group')
    .order('action');

  if (error) throw new Error(error.message);
  return data || [];
}

export async function getDistinctRoles(): Promise<string[]> {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase.from('role_permissions').select('role');

  if (error) throw new Error(error.message);
  const roles = [...new Set((data || []).map((r: any) => r.role))];
  return roles.sort();
}

export async function addRolePermission(
  role: string,
  permissionGroup: string,
  action: string,
  conditions?: Record<string, any>
): Promise<{ error: string | null }> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('role_permissions').insert({
    role: role.toLowerCase(),
    permission_group: permissionGroup,
    action,
    conditions: conditions || null,
  });

  if (error) {
    if (error.code === '23505') {
      return { error: 'This permission already exists for this role' };
    }
    return { error: error.message };
  }

  revalidatePath('/console/permissions');
  return { error: null };
}

export async function removeRolePermission(id: string): Promise<{ error: string | null }> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('role_permissions').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/console/permissions');
  return { error: null };
}

// ─── User Permission Overrides CRUD ────────────────────────────────

export async function getUserPermissionOverrides(
  userId: string
): Promise<UserPermissionOverride[]> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('user_permissions')
    .select('*')
    .eq('user_id', userId)
    .order('permission_group')
    .order('action');

  if (error) throw new Error(error.message);
  return data || [];
}

export async function setUserPermissionOverride(
  userId: string,
  permissionGroup: string,
  action: string,
  isGranted: boolean
): Promise<{ error: string | null }> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('user_permissions').upsert(
    {
      user_id: userId,
      permission_group: permissionGroup,
      action,
      is_granted: isGranted,
    },
    { onConflict: 'user_id,permission_group,action' }
  );

  if (error) return { error: error.message };

  revalidatePath('/console/permissions');
  return { error: null };
}

export async function removeUserPermissionOverride(id: string): Promise<{ error: string | null }> {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('user_permissions').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/console/permissions');
  return { error: null };
}

// ─── User Role Management ──────────────────────────────────────────

export async function updateUserRole(
  userId: string,
  newRole: string
): Promise<{ error: string | null }> {
  const { supabase } = await requireAdmin();

  // Use admin API to update app_metadata
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { role: newRole.toLowerCase() },
  });

  if (error) return { error: error.message };

  // Also update profiles table if it has a role column
  await supabase.from('profiles').update({ role: newRole.toLowerCase() }).eq('auth_id', userId);

  revalidatePath('/console/permissions');
  revalidatePath('/console/users');
  return { error: null };
}

// ─── Bulk Operations ───────────────────────────────────────────────

export async function getPermissionMatrix(): Promise<{
  roles: string[];
  groups: string[];
  actions: string[];
  matrix: Record<string, Record<string, boolean>>;
}> {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('role_permissions')
    .select('role, permission_group, action');

  if (error) throw new Error(error.message);

  const roles = [...new Set((data || []).map((r: any) => r.role))].sort();
  const groups = [...new Set((data || []).map((r: any) => r.permission_group))].sort();
  const actions = [...new Set((data || []).map((r: any) => r.action))].sort();

  // Build matrix: key = "role:group.action", value = boolean
  const matrix: Record<string, Record<string, boolean>> = {};
  for (const role of roles) {
    matrix[role] = {};
    for (const group of groups) {
      for (const action of actions) {
        const key = `${group}.${action}`;
        matrix[role][key] = (data || []).some(
          (r: any) => r.role === role && r.permission_group === group && r.action === action
        );
      }
    }
  }

  return { roles, groups, actions, matrix };
}
