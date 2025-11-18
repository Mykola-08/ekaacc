'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { SystemRole, PermissionGroup, PermissionAction } from '@/lib/role-permissions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Shield, AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
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
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function RoleGuard({
  allowedRoles,
  requiredPermission,
  requiredResource,
  fallback,
  children,
}: RoleGuardProps) {
  const { user, hasPermission, canAccessResource, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please sign in to access this content.
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => router.push('/login')} size="sm">
              Sign In
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role.name as SystemRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have the required role to access this content. 
            Your current role: {user.role.name}
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => router.push('/dashboard')} size="sm" variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Permission Denied</AlertTitle>
          <AlertDescription>
            You don't have the required permissions to access this content.
            Required: {requiredPermission.group} - {requiredPermission.action}
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => router.push('/dashboard')} size="sm" variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  // Check resource-based access
  if (requiredResource && !canAccessResource(requiredResource)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md" variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have access to this resource.
            Required: {requiredResource.resource} - {requiredResource.action}
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => router.push('/dashboard')} size="sm" variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </Alert>
      </div>
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
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)} ${className}`}>
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
  fallback?: React.ReactNode;
  children: React.ReactNode;
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
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function ResourceAccess({ resource, action, context, fallback, children }: ResourceAccessProps) {
  const { canAccessResource } = useAuth();
  
  if (!canAccessResource(resource, action, context)) {
    return fallback ? <>{fallback}</> : null;
  }
  
  return <>{children}</>;
}