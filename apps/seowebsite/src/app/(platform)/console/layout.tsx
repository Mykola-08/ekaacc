'use client';

import { ConsoleLayoutHeadless } from '@/components/platform/layout/console-layout-headless';
import { UnifiedRoleGuard } from '@/components/platform/auth/unified-role-guard';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <UnifiedRoleGuard allowedRoles={['Admin']}>
        <ConsoleLayoutHeadless>
            {children}
        </ConsoleLayoutHeadless>
    </UnifiedRoleGuard>
  );
}
