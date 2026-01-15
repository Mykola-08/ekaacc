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
import { ThemeProvider } from "@/components/theme-provider"

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
  <html lang='en' suppressHydrationWarning>
   <body
    className={cn(
     'font-sans antialiased min-h-screen flex flex-col bg-background text-foreground selection:bg-blue-100 selection:text-blue-900',
     inter.variable,
     playfair.variable
    )}
   >
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
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
    </ThemeProvider>
   </body>
  </html>
 );
}
