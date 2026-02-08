'use client';

import { UnifiedRoleGuard } from '@/components/platform/auth/unified-role-guard';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <UnifiedRoleGuard allowedRoles={['Admin']}>
      {children}
    </UnifiedRoleGuard>
  );
}

