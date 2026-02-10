/**
 * Server-side permission utilities for the unified dashboard.
 *
 * These run in RSC / server actions. They query the user's effective
 * permissions (role defaults + user overrides) from Supabase.
 *
 * Roles are just convenience bundles — actual access is controlled by
 * the resolved permission set.
 */

import { createClient } from '@/lib/supabase/server';
import {
  SYSTEM_ROLES,
  type SystemRole,
  type PermissionGroup,
  type PermissionAction,
} from '@/lib/platform/config/role-permissions';
import type { PagePermission } from '@/lib/permissions/page-permissions';

export interface ResolvedPermission {
  group: string;
  action: string;
  name: string;
}

export interface DashboardUser {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  avatarUrl?: string;
  permissions: ResolvedPermission[];
  metadata?: Record<string, unknown>;
}

/**
 * Get the current authenticated user with their resolved permissions.
 * Returns null if not authenticated.
 */
export async function getDashboardUser(): Promise<DashboardUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const role =
    (user.app_metadata?.role as string) ||
    (user.user_metadata?.role as string) ||
    'Patient';

  // Get permissions from the static role config as baseline
  const roleKey = normalizeRole(role);
  const roleConfig = SYSTEM_ROLES[roleKey as SystemRole];
  const rolePermissions: ResolvedPermission[] = roleConfig
    ? roleConfig.permissions.map((p) => ({
        group: p.group,
        action: p.action,
        name: `${p.group}.${p.action}`,
      }))
    : [];

  // Try to fetch DB-level custom permissions (user_custom_permissions)
  // These override role defaults: is_granted=true adds, is_granted=false removes
  try {
    const { data: customPerms } = await supabase
      .from('user_custom_permissions')
      .select('permission_key, is_granted')
      .eq('user_id', user.id);

    if (customPerms && customPerms.length > 0) {
      const granted = new Set(
        customPerms.filter((p) => p.is_granted).map((p) => p.permission_key as string)
      );
      const revoked = new Set(
        customPerms.filter((p) => !p.is_granted).map((p) => p.permission_key as string)
      );

      // Remove revoked permissions
      const filtered = rolePermissions.filter((p) => !revoked.has(p.name));

      // Add granted permissions that aren't already present
      for (const key of granted) {
        if (!filtered.some((p) => p.name === key)) {
          const [group, action] = key.split('.');
          filtered.push({ group, action, name: key });
        }
      }

      return {
        id: user.id,
        email: user.email!,
        role,
        fullName: user.user_metadata?.full_name,
        avatarUrl: user.user_metadata?.avatar_url,
        permissions: filtered,
        metadata: user.user_metadata,
      };
    }
  } catch {
    // Table may not exist yet — fall back to role permissions
  }

  return {
    id: user.id,
    email: user.email!,
    role,
    fullName: user.user_metadata?.full_name,
    avatarUrl: user.user_metadata?.avatar_url,
    permissions: rolePermissions,
    metadata: user.user_metadata,
  };
}

/**
 * Check if the dashboard user has a specific permission.
 */
export function userHasPermission(
  user: DashboardUser,
  permission: PagePermission | null
): boolean {
  // null permission = any authenticated user
  if (permission === null) return true;

  const requiredName = `${permission.group}.${permission.action}`;

  return user.permissions.some((p) => p.name === requiredName);
}

/**
 * Check if a user can access a given permission group + action.
 */
export function userCan(
  user: DashboardUser,
  group: PermissionGroup,
  action: PermissionAction
): boolean {
  return userHasPermission(user, { group, action });
}

/**
 * Normalize role strings from metadata to SystemRole keys.
 * e.g. 'admin' → 'Admin', 'super_admin' → 'Admin', 'therapist' → 'Therapist'
 */
function normalizeRole(role: string): string {
  const map: Record<string, string> = {
    admin: 'Admin',
    super_admin: 'Admin',
    therapist: 'Therapist',
    educator: 'Educator',
    reception: 'Reception',
    patient: 'Patient',
    client: 'Patient',
    vip_patient: 'VIP Patient',
    'vip patient': 'VIP Patient',
    corporate_client: 'Corporate Client',
    'corporate client': 'Corporate Client',
    content_manager: 'Content Manager',
    'content manager': 'Content Manager',
    marketing: 'Marketing',
    accountant: 'Accountant',
    custom: 'Custom',
  };
  return map[role.toLowerCase()] || role;
}
