import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Toaster } from '@/components/ui/sonner';
import { CookieConsent } from '@/components/cookie-consent';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { DebugStatus } from '@ekaacc/shared-ui';
import { cn } from '@/lib/utils';
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
     'font-sans antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30',
     inter.variable,
     playfair.variable
    )}
   >
    <SiteHeader />
    <main className='flex-1 pt-24 md:pt-32 relative z-0'>
     {children}
    </main>
    <SiteFooter />
    <CookieConsent />

    <Toaster />
    <Analytics />
    <SpeedInsights />
    <DebugStatus />
   </body>
  </html>
 );
}
