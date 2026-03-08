import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { UnifiedDashboardShell } from '@/components/dashboard/layout/UnifiedDashboardShell';
import { getUserPermissions } from '@/lib/permissions/actions';
import { Suspense } from 'react';
import { ThemeCustomizationProvider } from '@/components/theme/ThemeCustomizationProvider';
import { getAppearancePreferences } from '@/app/actions/appearance';

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

async function DashboardShellLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
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
  const appearance = await getAppearancePreferences();

  return (
    <ThemeCustomizationProvider initialTheme={appearance}>
      <UnifiedDashboardShell profile={profile} permissions={permissions}>
        {children}
      </UnifiedDashboardShell>
    </ThemeCustomizationProvider>
  );
}

export default function UnifiedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen bg-background">
          <div className="hidden md:block w-64 border-r border-border bg-card animate-pulse" />
          <div className="flex-1 p-6">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <DashboardShellLoader>{children}</DashboardShellLoader>
    </Suspense>
  );
}
