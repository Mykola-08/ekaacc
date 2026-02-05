import type { Metadata } from 'next';

import { Toaster } from '@/components/platform/ui/sonner';
import { cn } from '@/lib/platform/utils/css-utils';
import { ThemeProvider } from '@/components/platform/providers/theme-provider';
import { TooltipProvider } from '@/components/platform/ui/tooltip';
import { ProgressProvider } from '@/context/platform/progress-context';
import { ImpersonationWrapper } from '@/components/platform/admin/impersonation-wrapper';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsent from '@/components/platform/consent/CookieConsent';
import { DebugStatus } from "@ekaacc/shared-ui";
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { PlatformSidebar } from '@/app/(platform)/components/PlatformSidebar';
import { Separator } from '@/components/ui/separator';

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn('antialiased font-sans')}>
      {/* <UserProvider> */}
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
                <PlatformSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                         <div className="flex items-center gap-4">
                             <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
                             <Separator orientation="vertical" className="h-4" />
                             <span className="text-sm font-medium text-muted-foreground">Console</span>
                         </div>
                    </header>
                    <main className="flex-1 p-6 md:p-8 pt-6">
                        {children}
                    </main>
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
      {/* </UserProvider> */}
    </div>
  );
}

