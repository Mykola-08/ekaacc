'use client';

import React from 'react';
import { type Permission, PERMISSION_LABELS } from './constants';
import { usePermissions } from './hooks';
import { ShieldX } from 'lucide-react';

interface PermissionGateProps {
  /** The profile object (must contain role and optional permissions) */
  profile?: { role?: string; permissions?: Permission[] };
  /** Permission(s) required — ALL must be present unless `any` is true */
  requires: Permission | Permission[];
  /** If true, user needs ANY of the listed permissions (default: all) */
  any?: boolean;
  /** What to render when access is denied. Falls back to a default card. */
  fallback?: React.ReactNode;
  /** Children rendered when permitted */
  children: React.ReactNode;
}

/**
 * Declarative permission gate.
 *
 * Wraps children and only renders them when the user has the required
 * permission(s). Shows a clean denial message referencing the specific
 * sub-permission — never the role name.
 *
 * @example
 *   <PermissionGate profile={profile} requires="bookings.create">
 *     <BookingForm />
 *   </PermissionGate>
 */
export function PermissionGate({
  profile,
  requires,
  any = false,
  fallback,
  children,
}: PermissionGateProps) {
  const perms = usePermissions(profile);
  const requiredList = Array.isArray(requires) ? requires : [requires];

  const hasAccess = any
    ? perms.hasAny(...requiredList)
    : perms.hasAll(...requiredList);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback !== undefined) {
    return <>{fallback}</>;
  }

  // Default denial UI
  const missingLabels = requiredList
    .filter((p) => !perms.has(p))
    .map((p) => PERMISSION_LABELS[p] ?? p);

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-card px-8 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <ShieldX className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Access Restricted
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          You don&apos;t have permission to:{' '}
          <span className="font-medium text-foreground">
            {missingLabels.join(', ')}
          </span>
        </p>
      </div>
    </div>
  );
}

/**
 * Lightweight inline check — renders nothing when denied (useful for
 * hiding nav items or buttons rather than showing a denial card).
 */
export function PermissionInline({
  profile,
  requires,
  any = false,
  children,
}: Omit<PermissionGateProps, 'fallback'>) {
  const perms = usePermissions(profile);
  const requiredList = Array.isArray(requires) ? requires : [requires];

  const hasAccess = any
    ? perms.hasAny(...requiredList)
    : perms.hasAll(...requiredList);

  return hasAccess ? <>{children}</> : null;
}
