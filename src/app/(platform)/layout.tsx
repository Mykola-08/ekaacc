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
import { DebugStatus } from "@/components/ui";
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
    <div className={cn('antialiased font-sans')}>
      {/* <UserProvider> */}
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
                <SidebarInset className="bg-background min-h-screen flex flex-col p-2 md:p-4">
                  <div className="bg-card rounded-[36px] border border-border/50 shadow-sm flex-1 flex flex-col overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6 bg-background/50 backdrop-blur-md sticky top-0 z-10 transition-all">
                         <div className="flex items-center gap-4">
                             <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
                             <Separator orientation="vertical" className="h-4" />
                             <span className="text-sm font-semibold tracking-tight text-foreground">Console</span>
                         </div>
                    </header>
                    <main className="flex-1 p-6 md:p-10 overflow-y-auto">
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
      {/* </UserProvider> */}
    </div>
  );
}

