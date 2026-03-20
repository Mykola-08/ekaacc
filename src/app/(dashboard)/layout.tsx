export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { UnifiedDashboardShell } from '@/components/dashboard/layout/UnifiedDashboardShell';
import { getUserPermissions } from '@/lib/permissions/actions';
import { Suspense } from 'react';
import { ThemeCustomizationProvider } from '@/components/theme/ThemeCustomizationProvider';
import { getAppearancePreferences } from '@/app/actions/appearance';
import { GeistSans } from 'geist/font/sans';
import { AutoInsightsTrigger } from '@/components/dashboard/AutoInsightsTrigger';
import { GlobalCommandPalette } from '@/components/dashboard/GlobalCommandPalette';

const inter = GeistSans;

async function DashboardShellLoader({ children }: { children: React.ReactNode }) {
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

  const [permissions, appearance] = await Promise.all([
    getUserPermissions(),
    getAppearancePreferences(),
  ]);

  return (
    <ThemeCustomizationProvider initialTheme={appearance}>
      <div className={`dashboard-theme abVKEfg ${inter.variable} flex min-h-screen flex-col`}>
        <UnifiedDashboardShell profile={profile} permissions={permissions}>
          <AutoInsightsTrigger />
          <GlobalCommandPalette />
          {children}
        </UnifiedDashboardShell>
      </div>
    </ThemeCustomizationProvider>
  );
}

export default function UnifiedDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className={`dashboard-theme abVKEfg ${inter.variable} bg-background flex min-h-screen`}
        >
          <div className="border-border bg-card hidden w-64 animate-pulse border-r md:block" />
          <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="bg-muted h-8 w-48 animate-pulse rounded" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-muted h-32 animate-pulse rounded-xl border" />
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
