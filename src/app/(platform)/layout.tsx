import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/platform/providers/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProgressProvider } from '@/context/platform/progress-context';
import { ImpersonationWrapper } from '@/components/platform/admin/impersonation-wrapper';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import CookieConsent from '@/components/platform/consent/CookieConsent';
import { DebugStatus } from '@/components/ui';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { PlatformSidebar } from '@/app/(platform)/components/PlatformSidebar';
import { Separator } from '@/components/ui/separator';
import { LanguageProvider } from '@/context/LanguageContext';

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="platform-shell">
      <LanguageProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ProgressProvider>
            <TooltipProvider>
              <ImpersonationWrapper>
                <SidebarProvider>
                  <PlatformSidebar variant="floating" />
                  <SidebarInset className="app-shell app-shell-inset">
                    <div className="app-shell-card">
                      <header className="app-shell-header">
                        <div className="flex items-center gap-4">
                          <SidebarTrigger className="header-icon-btn -ml-1" />
                          <Separator orientation="vertical" className="h-4" />
                          <span className="text-foreground text-sm font-semibold tracking-tight">
                            Console
                          </span>
                        </div>
                      </header>
                      <main id="main-content" className="app-shell-main" tabIndex={-1}>
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                          {children}
                        </div>
                      </main>
                    </div>
                  </SidebarInset>
                </SidebarProvider>

                <CookieConsent />
                <Analytics />
                <SpeedInsights />
              </ImpersonationWrapper>
              <Toaster />
              {process.env.NODE_ENV === 'development' && <DebugStatus />}
            </TooltipProvider>
          </ProgressProvider>
        </ThemeProvider>
      </LanguageProvider>
    </div>
  );
}
