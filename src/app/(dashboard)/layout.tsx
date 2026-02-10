import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UnifiedDashboardShell } from '@/components/dashboard/layout/UnifiedDashboardShell';
import { getUserPermissions } from '@/lib/permissions/actions';

/**
 * Unified Dashboard Layout
 *
 * Single layout for ALL authenticated pages — clients, therapists, and admins.
 * The sidebar dynamically shows/hides navigation items based on the user's
 * resolved permissions (role defaults + per-user custom overrides).
 *
 * Roles are just convenience bundles of permissions. Actual page access is
 * controlled by the permission system.
 */
export default async function UnifiedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = {
    id: user.id,
    full_name: user.user_metadata?.full_name,
    first_name: user.user_metadata?.first_name,
    last_name: user.user_metadata?.last_name,
    email: user.email,
    phone: user.user_metadata?.phone,
    avatar_url: user.user_metadata?.avatar_url,
    role: user.app_metadata?.role || user.user_metadata?.role || 'Patient',
    ...user.user_metadata,
  };

  const permissions = await getUserPermissions();

  return (
    <UnifiedDashboardShell profile={profile} permissions={permissions}>
      {children}
    </UnifiedDashboardShell>
  );
}
