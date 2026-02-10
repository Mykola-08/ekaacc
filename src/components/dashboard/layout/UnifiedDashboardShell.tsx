'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/components/platform/providers/theme-provider';
import { ProgressProvider } from '@/context/platform/progress-context';
import { ImpersonationWrapper } from '@/components/platform/admin/impersonation-wrapper';
import { UnifiedSidebar } from '@/components/dashboard/layout/UnifiedSidebar';
import { NotificationDropdown } from '@/components/dashboard/layout/NotificationDropdown';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { OnlineStatusIndicator } from '@/components/ui/online-status-indicator';
import { MorphingToaster } from '@/components/ui/morphing-toaster';
import { DebugStatus } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

/* ─── Page title mapping ─────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/bookings': 'Bookings',
  '/finances': 'Finances',
  '/wellness': 'Wellness',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/availability': 'Availability',
  '/therapist': 'Therapist',
  '/console': 'Console',
  '/notifications': 'Notifications',
  '/ai-insights': 'AI Insights',
  '/resources': 'Resources',
  '/forms': 'Forms',
  '/crisis': 'Crisis Support',
  '/onboarding': 'Onboarding',
  '/status': 'System Status',
  '/tools': 'Tools',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [path, title] of Object.entries(PAGE_TITLES)) {
    if (pathname.startsWith(path + '/')) return title;
  }
  const segment = pathname.split('/').filter(Boolean).pop() || 'Dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, index + 1).join('/'),
    isLast: index === segments.length - 1,
  }));
}

/**
 * Unified Dashboard Shell
 *
 * Provides the complete shell for ALL dashboard pages — client, therapist,
 * and admin alike. Dynamic page titles, breadcrumb nav, notification center.
 */
export function UnifiedDashboardShell({
  children,
  profile,
  permissions,
}: {
  children: React.ReactNode;
  profile?: any;
  permissions?: any[];
}) {
  const pathname = usePathname();
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProgressProvider>
        <ImpersonationWrapper>
          <SidebarProvider className="dashboard-sidebar">
            <UnifiedSidebar profile={profile} permissions={permissions} />

            <SidebarInset className="dashboard-inset bg-background">
              {/* Sticky floating header */}
              <header className="sticky top-3 z-50 mx-3 mb-2 flex h-14 items-center gap-2 rounded-xl border border-border bg-card/95 px-4 backdrop-blur-md sm:mx-4">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1 h-8 w-8 rounded-lg" />
                  <Separator orientation="vertical" className="mr-1 h-4" />
                </div>

                {/* Breadcrumbs on desktop, title on mobile */}
                <div className="flex flex-1 items-center gap-2">
                  <Breadcrumb className="hidden sm:flex">
                    <BreadcrumbList>
                      {breadcrumbs.map((crumb, i) => (
                        <React.Fragment key={crumb.href}>
                          {i > 0 && <BreadcrumbSeparator />}
                          <BreadcrumbItem>
                            {crumb.isLast ? (
                              <span className="text-sm font-semibold text-foreground">{crumb.label}</span>
                            ) : (
                              <BreadcrumbLink href={crumb.href} className="text-sm text-muted-foreground hover:text-foreground">
                                {crumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      ))}
                    </BreadcrumbList>
                  </Breadcrumb>
                  <h1 className="text-sm font-semibold tracking-tight text-foreground sm:hidden">
                    {pageTitle}
                  </h1>
                </div>

                <div className="flex items-center gap-1">
                  <NotificationDropdown />
                </div>
              </header>

              <main id="main-content" className="dashboard-main flex-1 overflow-auto p-2 pt-0 sm:p-4 sm:pt-0" tabIndex={-1}>
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>

          <MorphingToaster />
          <OnlineStatusIndicator />
          {process.env.NODE_ENV === 'development' && <DebugStatus />}
        </ImpersonationWrapper>
      </ProgressProvider>
    </ThemeProvider>
  );
}
