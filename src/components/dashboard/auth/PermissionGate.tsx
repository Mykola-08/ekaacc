'use client';

import React, { type ReactNode, useMemo } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { LoadingSpinner } from '@/components/ui/loading-states';
import type {
  PermissionGroup,
  PermissionAction,
} from '@/lib/platform/config/role-permissions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

interface PermissionGateProps {
  children: ReactNode;
  /**
   * Required permission — if null, any authenticated user can access.
   * If undefined, nothing is rendered (no mapping found).
   */
  permission?: {
    group: PermissionGroup;
    action: PermissionAction;
    conditions?: Record<string, unknown>;
  } | null;
  /** Custom fallback when access is denied */
  fallback?: ReactNode;
  /** Custom loading state */
  loadingFallback?: ReactNode;
  /** Where to redirect on "Go back" */
  redirectTo?: string;
}

/**
 * Client-side permission gate.
 *
 * Unlike UnifiedRoleGuard (which checks roles), this checks the user's
 * resolved permissions — which come from role defaults + custom overrides.
 *
 * Usage:
 *   <PermissionGate permission={{ group: 'user_management', action: 'read' }}>
 *     <UsersPage />
 *   </PermissionGate>
 *
 *   <PermissionGate permission={null}> // any auth user
 *     <ProfilePage />
 *   </PermissionGate>
 */
export function PermissionGate({
  children,
  permission,
  fallback,
  loadingFallback,
  redirectTo = '/dashboard',
}: PermissionGateProps) {
  const { user, hasPermission, loading } = useAuth();
  const router = useRouter();

  const isAuthorized = useMemo(() => {
    if (!user) return false;
    // null permission = any authenticated user
    if (permission === null || permission === undefined) return true;

    const permName = `${permission.group}.${permission.action}`;
    return hasPermission(permName);
  }, [user, permission, hasPermission]);

  if (loading) {
    return loadingFallback ? (
      <>{loadingFallback}</>
    ) : (
      <div className="flex min-h-100 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="flex min-h-100 items-center justify-center">
          <Alert className="max-w-md">
            <Shield className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>Please sign in to access this content.</AlertDescription>
            <div className="mt-4">
              <Button onClick={() => router.push('/login')} size="sm">
                Sign In
              </Button>
            </div>
          </Alert>
        </div>
      )
    );
  }

  if (!isAuthorized) {
    return (
      fallback || (
        <div className="flex min-h-100 items-center justify-center">
          <Alert className="max-w-md" variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don&apos;t have the required permission to access this page.
              {permission && (
                <>
                  <br />
                  Required: {permission.group} &middot; {permission.action}
                </>
              )}
            </AlertDescription>
            <div className="mt-4">
              <Button
                onClick={() => router.push(redirectTo)}
                size="sm"
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </div>
          </Alert>
        </div>
      )
    );
  }

  return <>{children}</>;
}

/**
 * Hook to check a permission inline.
 *
 * Usage:
 *   const canManageUsers = usePermission('user_management', 'read');
 *   if (canManageUsers) { ... }
 */
export function usePermission(
  group: PermissionGroup,
  action: PermissionAction
): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(`${group}.${action}`);
}

/**
 * Hook returning a function to check multiple permissions.
 *
 * Usage:
 *   const can = usePermissions();
 *   can('user_management', 'read') // boolean
 */
export function usePermissions(): (
  group: PermissionGroup,
  action: PermissionAction
) => boolean {
  const { hasPermission } = useAuth();
  return (group, action) => hasPermission(`${group}.${action}`);
}
