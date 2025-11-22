import type { Metadata } from 'next';
import './globals-minimal.css';
import './eka-theme.css';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProgressProvider } from '@/context/progress-context';
import { ImpersonationWrapper } from '@/components/admin/impersonation-wrapper';
// Removed SPA Auth0ClientProvider in favor of server-side sessions.
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";


export const metadata: Metadata = {
  title: 'EKA Account',
  description: 'The central hub for your EKA ecosystem.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS Prefetch & Preconnect for faster external resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        
        {/* Inter font for clean, modern aesthetic */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{__html: `
          body {
            font-family: 'Inter', system-ui, Segoe UI, Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
        `}} />
      </head>
      <body className={cn('antialiased font-sans')}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ProgressProvider>
              <TooltipProvider>
                <ImpersonationWrapper>
                  {children}
                  <Analytics />
                  <SpeedInsights />
                </ImpersonationWrapper>
                <Toaster />
              </TooltipProvider>
            </ProgressProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
