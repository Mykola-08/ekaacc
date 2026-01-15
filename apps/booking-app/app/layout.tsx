import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/sonner';
import { CookieConsent } from '@/components/cookie-consent';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { MainLayout } from '@/components/layout/main-layout';
import { DebugStatus } from '@ekaacc/shared-ui';
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

const inter = Inter({
 subsets: ['latin'],
 display: 'swap',
 variable: '--font-inter',
});

const playfair = Playfair_Display({
 subsets: ['latin'],
 display: 'swap',
 variable: '--font-playfair',
});

export const metadata: Metadata = {
 title: 'Integrative Massage Booking - Elena V.',
 description: 'Restoring balance through structural integration',
 icons: {
  icon: '/favicon.ico',
 },
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang='en'>
   <body
    className={cn(
     'font-sans antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-teal-100 selection:text-teal-900',
     // Subtle ambient background gradient
     'bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white via-stone-50 to-stone-100',
     inter.variable,
     playfair.variable
    )}
   >
    <LanguageProvider>
      <MainLayout
        header={<SiteHeader />}
        footer={<SiteFooter />}
      >
        {children}
      </MainLayout>
      <CookieConsent />

      <Toaster />
      <Analytics />
      <SpeedInsights />
    </LanguageProvider>
   </body>
  </html>
 );
}
