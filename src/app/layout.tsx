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

export const metadata: Metadata = {
  title: 'EKA Balance - Teràpies Integratives',
  description: 'Serveis premium de benestar amb teràpies integratives.',
  icons: {
    icon: '/images/eka_logo.png',
    apple: '/images/eka_logo.png',
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
  const { data: { user } } = await supabase.auth.getUser();

  let role = 'client';
  if (user) {
    const { data } = await supabase.from('profiles').select('role').eq('auth_id', user.id).single();
    role = data?.role || 'client';
  }

  const features = await resolveFeatures({ userId: user?.id, role });

  return (
    <FeaturesProvider features={features}>
      {children}
    </FeaturesProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
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
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
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
