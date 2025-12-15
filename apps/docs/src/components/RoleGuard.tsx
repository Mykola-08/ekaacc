import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export default function RoleGuard({ children }: RoleGuardProps) {
  // Currently allowing access to everyone.
  // TODO: Implement new authentication/authorization logic.
  return <>{children}</>;
}
