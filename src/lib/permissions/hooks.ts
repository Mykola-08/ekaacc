'use client';

import { useMemo } from 'react';
import {
  type Permission,
  type RoleName,
  ROLE_PERMISSIONS,
  PERMISSION_LABELS,
} from './constants';

export interface PermissionContext {
  /** All resolved permissions for the current user */
  permissions: Set<Permission>;
  /** Check if user has a specific permission */
  has: (permission: Permission) => boolean;
  /** Check if user has ALL of the listed permissions */
  hasAll: (...permissions: Permission[]) => boolean;
  /** Check if user has ANY of the listed permissions */
  hasAny: (...permissions: Permission[]) => boolean;
  /** Get the human-readable label for a permission */
  label: (permission: Permission) => string;
  /** Get a user-friendly denial message */
  denyMessage: (permission: Permission) => string;
}

/**
 * Resolve the full permission set for a user.
 *
 * Priority:
 *   1. Explicit overrides in profile.permissions (array of Permission strings)
 *   2. Role-based preset (profile.role → ROLE_PERMISSIONS)
 *   3. Falls back to client preset
 */
export function resolvePermissions(profile?: {
  role?: string;
  permissions?: Permission[];
}): Set<Permission> {
  const role = (profile?.role || 'client') as RoleName;
  const rolePerms = ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.client;

  // Merge role defaults with any explicit per-user overrides
  const explicit = profile?.permissions ?? [];
  return new Set([...rolePerms, ...explicit]);
}

/**
 * React hook — gives the current permission context for a profile.
 *
 * Usage:
 *   const perms = usePermissions(profile);
 *   if (!perms.has('bookings.create')) { ... }
 */
export function usePermissions(profile?: {
  role?: string;
  permissions?: Permission[];
}): PermissionContext {
  return useMemo(() => {
    const permissions = resolvePermissions(profile);

    const has = (p: Permission) => permissions.has(p);
    const hasAll = (...ps: Permission[]) => ps.every((p) => permissions.has(p));
    const hasAny = (...ps: Permission[]) => ps.some((p) => permissions.has(p));

    const label = (p: Permission) =>
      PERMISSION_LABELS[p] ?? p;

    const denyMessage = (p: Permission) =>
      `You don't have permission to: ${label(p)}`;

    return { permissions, has, hasAll, hasAny, label, denyMessage };
  }, [profile?.role, profile?.permissions]);
}
