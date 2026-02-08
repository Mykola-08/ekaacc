import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/platform/auth-context';
import { GlobalErrorReporter } from '@/components/observability/GlobalErrorReporter';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <a href="#main-content" className="ux-skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          <LanguageProvider>
            <GlobalErrorReporter />
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
