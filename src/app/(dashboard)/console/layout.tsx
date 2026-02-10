'use client';

import { PermissionGate } from '@/components/dashboard/auth/PermissionGate';

/**
 * Console Layout — Permission-gated
 *
 * Previously gated by role (Admin only). Now checks the
 * `system_settings.read` permission, which Admin role has by default.
 * Any user with this permission (via custom overrides) can also access.
 */
export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PermissionGate
      permission={{ group: 'system_settings', action: 'read' }}
    >
      {children}
    </PermissionGate>
  );
}
