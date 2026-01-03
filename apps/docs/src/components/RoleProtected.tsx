'use client';

import { useRole, UserRole } from './RoleContext';

interface RoleProtectedProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export function RoleProtected({ children, allowedRoles, fallback = null }: RoleProtectedProps) {
  const { role } = useRole();

  // Developer sees everything
  if (role === 'developer') {
    return <>{children}</>;
  }

  if (allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
