'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ThemeProvider } from '@/components/platform/providers/theme-provider';
import { ProgressProvider } from '@/context/platform/progress-context';
import { ImpersonationWrapper } from '@/components/platform/admin/impersonation-wrapper';
import { UnifiedSidebar } from '@/components/dashboard/layout/UnifiedSidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Bell } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { DebugStatus } from '@/components/ui';

/**
 * Unified Dashboard Shell
 *
 * Provides the complete shell for ALL dashboard pages — client, therapist,
 * and admin alike. The sidebar dynamically shows navigation items based on
 * the user's resolved permissions (role defaults + custom overrides).
 *
 * Merges the functionality of:
 *  - (dashboard)/layout.tsx — auth check + DashboardLayout
 *  - (platform)/layout.tsx — providers + PlatformSidebar + header
 */
export function UnifiedDashboardShell({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile?: any;
}) {
  const pathname = usePathname();
  const router = useRouter();

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
            <UnifiedSidebar profile={profile} />

            <SidebarInset className="dashboard-inset">
              <header className="dashboard-header">
                <div className="flex items-center gap-3">
                  <SidebarTrigger className="md:hidden" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => router.push('/notifications')}
                    className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                </div>
              </header>

              <main id="main-content" className="dashboard-main" tabIndex={-1}>
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {children}
                </div>
              </main>
            </SidebarInset>
          </SidebarProvider>

          <Toaster />
          {process.env.NODE_ENV === 'development' && <DebugStatus />}
        </ImpersonationWrapper>
      </ProgressProvider>
    </ThemeProvider>
  );
}
