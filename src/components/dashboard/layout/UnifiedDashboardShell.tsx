'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { ProgressProvider } from '@/context/platform/progress-context';
import { ImpersonationWrapper } from '@/components/platform/admin/impersonation-wrapper';
import { UnifiedSidebar } from '@/components/dashboard/layout/UnifiedSidebar';
import { NotificationDropdown } from '@/components/dashboard/layout/NotificationDropdown';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { OnlineStatusIndicator } from '@/components/ui/online-status-indicator';
import { MorphingToaster } from '@/components/ui/morphing-toaster';
import { DebugStatus } from '@/components/ui';
import { Separator } from '@/components/ui/separator';
import { AIRightPanel } from '@/components/ai/AIRightPanel';
import { RightPanelProvider, useRightPanel } from '@/context/platform/right-panel-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon } from '@hugeicons/core-free-icons';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import type { UserProfile } from '@/lib/platform/types/auth-types';

/* ─── Page title mapping ─────────────────────────── */
const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/bookings': 'Bookings',
  '/finances': 'Finances',
  '/wellness': 'Wellness',
  '/profile': 'Profile',
  '/settings': 'Settings',
  '/availability': 'Availability',
  '/therapist': 'Therapist',
  '/therapist/clients': 'Clients',
  '/therapist/session-notes': 'Session Notes',
  '/therapist/templates': 'Templates',
  '/therapist/patients': 'Patients',
  '/therapist/assignments': 'Homework',
  '/therapist/billing': 'Billing',
  '/therapist/resources': 'Resources',
  '/console': 'Console',
  '/console/users': 'Users',
  '/console/permissions': 'Permissions',
  '/console/services': 'Services',
  '/console/cms': 'CMS',
  '/console/analytics': 'Analytics',
  '/console/features': 'Feature Flags',
  '/console/payments': 'Payments',
  '/console/subscriptions': 'Subscriptions',
  '/console/telegram': 'Telegram',
  '/console/audit': 'Audit Log',
  '/console/database': 'Database',
  '/console/settings': 'Console Settings',
  '/notifications': 'Notifications',
  '/messages': 'Messages',
  '/ai-insights': 'AI Insights',
  '/resources': 'Resources',
  '/assignments': 'Assignments',
  '/community': 'Community',
  '/journal': 'Journal',
  '/forms': 'Forms',
  '/crisis': 'Crisis Support',
  '/business': 'Business',
  '/onboarding': 'Onboarding',
  '/status': 'System Status',
  '/tools': 'Tools',
  '/chat': 'Chat',
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
 * AI Panel toggle button for the header.
 */
function AIToggle() {
  const { isOpen, toggle } = useRightPanel();
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('size-8', isOpen && 'bg-accent')}
      onClick={toggle}
      aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      <HugeiconsIcon icon={SparklesIcon} className="size-4" />
    </Button>
  );
}

/**
 * Unified Dashboard Shell — shadcn dashboard-01 pattern
 */
export function UnifiedDashboardShell({
  children,
  profile,
  permissions,
}: {
  children: React.ReactNode;
  profile?: UserProfile;
  permissions?: any[];
}) {
  const pathname = usePathname();
  const pageTitle = useMemo(() => getPageTitle(pathname), [pathname]);
  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);

  return (
    <ProgressProvider>
      <RightPanelProvider>
        <div className="dashboard-theme contents">
          <ImpersonationWrapper>
            <SidebarProvider
              className="dashboard-sidebar text-foreground font-sans"
              style={
                {
                  '--sidebar-width': 'calc(var(--spacing) * 72)',
                  '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
              }
            >
              <UnifiedSidebar profile={profile} permissions={permissions} />

              <SidebarInset>
                <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                  <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mx-2 data-[orientation=vertical]:h-4"
                    />

                    {/* Breadcrumbs on desktop, title on mobile */}
                    <Breadcrumb className="hidden sm:flex">
                      <BreadcrumbList>
                        {breadcrumbs.map((crumb, i) => (
                          <React.Fragment key={crumb.href}>
                            {i > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                              {crumb.isLast ? (
                                <span className="text-foreground text-sm font-medium">
                                  {crumb.label}
                                </span>
                              ) : (
                                <BreadcrumbLink
                                  href={crumb.href}
                                  className="text-muted-foreground hover:text-foreground text-sm"
                                >
                                  {crumb.label}
                                </BreadcrumbLink>
                              )}
                            </BreadcrumbItem>
                          </React.Fragment>
                        ))}
                      </BreadcrumbList>
                    </Breadcrumb>
                    <h1 className="text-base font-medium sm:hidden">
                      {pageTitle}
                    </h1>

                    <div className="ml-auto flex items-center gap-1">
                      <NotificationDropdown />
                      <AIToggle />
                    </div>
                  </div>
                </header>

                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <main id="main-content" tabIndex={-1}>
                      {children}
                    </main>
                  </div>
                </div>
              </SidebarInset>

              <AIRightPanel />
            </SidebarProvider>

            <MorphingToaster />
            <OnlineStatusIndicator />
            {process.env.NODE_ENV === 'development' && <DebugStatus />}
          </ImpersonationWrapper>
        </div>
      </RightPanelProvider>
    </ProgressProvider>
  );
}
