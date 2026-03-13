import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/styles/globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/platform/auth-context';
import { GlobalErrorReporter } from '@/components/observability/GlobalErrorReporter';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { MorphingToaster } from '@/components/ui/morphing-toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { resolveFeatures } from '@/lib/features';
import { FeaturesProvider } from '@/context/FeaturesContext';
import { createClient } from '@/lib/supabase/server';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: {
    default: 'EKA Balance - Teràpies Integratives a Barcelona',
    template: '%s | EKA Balance',
  },
  description:
    'Serveis premium de benestar amb teràpies integratives: massatge, kinesiologia, nutrició i més. Descobreix el teu equilibri a Barcelona.',
  metadataBase: new URL('https://ekabalance.com'),
  icons: {
    icon: '/images/eka_logo.png',
    apple: '/images/eka_logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'ca_ES',
    url: 'https://ekabalance.com',
    siteName: 'EKA Balance',
    title: 'EKA Balance - Teràpies Integratives a Barcelona',
    description:
      'Serveis premium de benestar amb teràpies integratives: massatge, kinesiologia, nutrició i més.',
    images: [{ url: '/images/eka_logo.png', width: 512, height: 512, alt: 'EKA Balance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EKA Balance - Teràpies Integratives',
    description: 'Serveis premium de benestar amb teràpies integratives a Barcelona.',
  },
  alternates: {
    canonical: 'https://ekabalance.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

// Async wrapper to fetch features and pass to provider
async function FeaturesWrapper({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = 'client';
  if (user) {
    const { data } = await supabase.from('profiles').select('role').eq('auth_id', user.id).single();
    role = data?.role || 'client';
  }

  const features = await resolveFeatures({ userId: user?.id, role });

  return <FeaturesProvider features={features}>{children}</FeaturesProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ca"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn('font-sans', inter.variable)}
    >
      <body
        className={cn('font-sans antialiased', GeistSans.variable, GeistMono.variable)}
        suppressHydrationWarning
      >
        <a href="#main-content" className="ux-skip-link">
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Suspense fallback={<div className="bg-background min-h-screen" />}>
              <FeaturesWrapper>
                <LanguageProvider>
                  <TooltipProvider>
                    <MorphingToaster />
                    <GlobalErrorReporter />
                    {children}
                  </TooltipProvider>
                </LanguageProvider>
              </FeaturesWrapper>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
