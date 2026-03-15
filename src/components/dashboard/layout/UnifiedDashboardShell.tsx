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
import { BotMessageSquare } from 'lucide-react';
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
  '/dashboard': 'Overview',
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
      className={cn('h-8 w-8 rounded-full', isOpen && 'bg-accent')}
      onClick={toggle}
      aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      <BotMessageSquare className="size-4" />
    </Button>
  );
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
          <SidebarProvider className="dashboard-sidebar text-foreground font-sans">
            <UnifiedSidebar profile={profile} permissions={permissions} />

            <SidebarInset className="dashboard-inset bg-muted/20 flex min-w-0 flex-1 flex-col">
              {/* Floating Header */}
              <div className="sticky top-0 z-50 p-2 md:p-4">
                <header className="bg-background border border-border/50 flex h-14 w-full shrink-0 items-center justify-between gap-2 rounded-[24px] px-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1 h-8 w-8 rounded-full" />
                    <Separator
                      orientation="vertical"
                      className="mr-1 data-[orientation=vertical]:h-4"
                    />

                    {/* Breadcrumbs on desktop, title on mobile */}
                    <Breadcrumb className="hidden sm:flex">
                      <BreadcrumbList>
                        {breadcrumbs.map((crumb, i) => (
                          <React.Fragment key={crumb.href}>
                            {i > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                              {crumb.isLast ? (
                                <span className="text-foreground text-sm font-semibold">
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
                    <h1 className="text-foreground text-sm font-semibold tracking-tight sm:hidden">
                      {pageTitle}
                    </h1>
                  </div>

                  <div className="ml-auto flex items-center gap-1">
                    <NotificationDropdown />
                    <AIToggle />
                  </div>
                </header>
              </div>

              <main id="main-content" className="flex-1 space-y-4 p-4 md:p-6" tabIndex={-1}>
                {children}
              </main>
            </SidebarInset>

            <AIRightPanel />
          </SidebarProvider>

          <MorphingToaster />
          <OnlineStatusIndicator />
          {process.env.NODE_ENV === 'development' && <DebugStatus />}
        </ImpersonationWrapper>{' '}
      </div>{' '}
      </RightPanelProvider>
    </ProgressProvider>
  );
}
