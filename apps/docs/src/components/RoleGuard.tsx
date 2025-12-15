'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user, isLoading } = useUser();

  if (isLoading) return null;

  // Assuming roles are in user.app_metadata.roles or similar. 
  // Adjust this based on your Auth0 rule/action configuration.
  // For now, we'll check a custom claim or just assume a property.
  // Often it's namespaced like 'https://ekaacc.com/roles'
  const userRoles = (user?.['https://ekaacc.com/roles'] as string[]) || [];

  const hasAccess = userRoles.some(role => allowedRoles.includes(role));

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
