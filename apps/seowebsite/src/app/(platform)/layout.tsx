import type { Metadata } from 'next';
import { Manrope, Playfair_Display } from 'next/font/google';

import { Toaster } from 'sonner';
import { cn } from '@/lib/platform/utils';
import { AuthProvider } from '@/context/platform/auth-context';
import { ThemeProvider } from '@/components/platform/theme-provider';
import { TooltipProvider } from '@/components/platform/ui/tooltip';
import { ProgressProvider } from '@/context/platform/progress-context';
import { ImpersonationWrapper } from '@/components/platform/admin/impersonation-wrapper';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsent from '@/components/platform/consent/CookieConsent';
import { DebugStatus } from "@ekaacc/shared-ui";

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: {
    default: 'EKA Account',
    template: '%s | EKA Account',
  },
  description: 'The central hub for your EKA ecosystem.',
  metadataBase: new URL('https://app.ekabalance.com'),
  openGraph: {
    title: 'EKA Account',
    description: 'The central hub for your EKA ecosystem.',
    url: 'https://app.ekabalance.com',
    siteName: 'EKA Account',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'EKA Account',
    card: 'summary_large_image',
  },
};

export default function PlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn('antialiased font-sans', manrope.variable, playfair.variable)}>
        {/* <UserProvider> */}
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
                    <CookieConsent />
                    <Analytics />
                    <SpeedInsights />
                  </ImpersonationWrapper>
                  <Toaster />
                  <DebugStatus />
                </TooltipProvider>
              </ProgressProvider>
            </ThemeProvider>
          </AuthProvider>
        {/* </UserProvider> */}
    </div>
  );
}
