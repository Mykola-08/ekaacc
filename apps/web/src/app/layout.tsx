import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ProgressProvider } from '@/context/progress-context';
import { ImpersonationWrapper } from '@/components/admin/impersonation-wrapper';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CookieConsent from '@/components/consent/CookieConsent';
import { DebugStatus } from "@ekaacc/shared-ui";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
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
      </head>
      <body className={cn('antialiased font-sans', inter.variable)}>
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
      </body>
    </html>
  );
}
