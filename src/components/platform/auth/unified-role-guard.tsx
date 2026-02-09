'use client';

import React, { ReactNode, useMemo } from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { LoadingSpinner } from '@/components/ui/loading-states';
import {
  SystemRole,
  PermissionGroup,
  PermissionAction,
} from '@/lib/platform/config/role-permissions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle } from 'lucide-react';

interface UnifiedRoleGuardProps {
  children: ReactNode;
  allowedRoles?: SystemRole[];
  requiredPermission?: {
    group: PermissionGroup;
    action: PermissionAction;
    conditions?: Record<string, any>;
  };
  requiredResource?: {
    resource: string;
    action: PermissionAction;
    context?: Record<string, any>;
  };
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  redirectTo?: string;
}

/**
 * Unified Role Guard - Consolidates both role-based and permission-based access control
 * Uses the main auth context as the single source of truth
 * Supports persona override for development/testing
 */
export function UnifiedRoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  requiredResource,
  fallback,
  loadingFallback,
  redirectTo = '/dashboard',
}: UnifiedRoleGuardProps) {
  const { user, hasPermission, canAccessResource, loading } = useAuth();
  const router = useRouter();

  // Check for persona override (for development/demo purposes)
  const effectiveRoles = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const personaOverride = localStorage.getItem('eka_persona');
        if (personaOverride && allowedRoles?.includes(personaOverride as SystemRole)) {
          return [personaOverride];
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    }

    if (!user) return [];
    return user.role?.name ? [user.role.name] : [];
  }, [user, allowedRoles]);

  const hasRoleAccess = useMemo(() => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    return effectiveRoles.some((role) => allowedRoles.includes(role as SystemRole));
  }, [effectiveRoles, allowedRoles]);

  const hasPermissionAccess = useMemo(() => {
    if (!requiredPermission) return true;
    return hasPermission(requiredPermission);
  }, [requiredPermission, hasPermission]);

  const hasResourceAccess = useMemo(() => {
    if (!requiredResource) return true;
    return canAccessResource(requiredResource);
  }, [requiredResource, canAccessResource]);

  const isAuthorized = hasRoleAccess && hasPermissionAccess && hasResourceAccess;

  // Handle loading state
  if (loading) {
    return loadingFallback ? (
      <>{loadingFallback}</>
    ) : (
      <div className="flex min-h-[400px] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle unauthorized access
  if (!user) {
    return (
      fallback || (
        <div className="flex min-h-[400px] items-center justify-center">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
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
        <div className="flex min-h-[400px] items-center justify-center">
          <Alert className="max-w-md" variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have the required permissions to access this content.
              {allowedRoles && (
                <>
                  <br />
                  Required roles: {allowedRoles.join(', ')}
                  <br />
                  Your role: {user.role?.name}
                </>
              )}
              {requiredPermission && (
                <>
                  <br />
                  Required: {requiredPermission.group} - {requiredPermission.action}
                </>
              )}
              {requiredResource && (
                <>
                  <br />
                  Resource: {requiredResource.resource} - {requiredResource.action}
                </>
              )}
            </AlertDescription>
            <div className="mt-4">
              <Button onClick={() => router.push(redirectTo)} size="sm" variant="outline">
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

interface RoleBadgeProps {
  role: SystemRole;
  className?: string;
}

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const getRoleColor = (role: SystemRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Therapist':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Reception':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Patient':
        return 'bg-muted text-foreground border-border';
      case 'VIP Patient':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Corporate Client':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Content Manager':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Marketing':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Accountant':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Custom':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-muted text-foreground border-border';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getRoleColor(role)} ${className}`}
    >
      {role}
    </span>
  );
}

interface PermissionCheckProps {
  permission: {
    group: PermissionGroup;
    action: PermissionAction;
    conditions?: Record<string, any>;
  };
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionCheck({ permission, fallback, children }: PermissionCheckProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

interface ResourceAccessProps {
  resource: string;
  action: PermissionAction;
  context?: Record<string, any>;
  fallback?: ReactNode;
  children: ReactNode;
}

export function ResourceAccess({
  resource,
  action,
  context,
  fallback,
  children,
}: ResourceAccessProps) {
  const { canAccessResource } = useAuth();

  if (!canAccessResource(resource, action, context)) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

/**
 * Hook for checking if current user has a specific role
 */
export function useHasRole(role: SystemRole): boolean {
  const { user } = useAuth();
  const effectiveRoles = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const personaOverride = localStorage.getItem('eka_persona');
        if (personaOverride) return [personaOverride];
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    return user?.role?.name ? [user.role.name] : [];
  }, [user]);

  return effectiveRoles.includes(role);
}

/**
 * Hook for checking if current user is admin
 */
export function useIsAdmin(): boolean {
  return useHasRole('Admin');
}

/**
 * Hook for checking if current user is therapist
 */
export function useIsTherapist(): boolean {
  return useHasRole('Therapist');
}

/**
 * Hook for checking if current user is admin or therapist
 */
export function useIsStaff(): boolean {
  const { user } = useAuth();
  const effectiveRoles = useMemo(() => {
    if (typeof window !== 'undefined') {
      try {
        const personaOverride = localStorage.getItem('eka_persona');
        if (personaOverride) return [personaOverride];
      } catch (e) {
        // Ignore localStorage errors
      }
    }
    return user?.role?.name ? [user.role.name] : [];
  }, [user]);

  return effectiveRoles.includes('Admin') || effectiveRoles.includes('Therapist');
}
