import type { Metadata, Viewport } from 'next';
import MainLayout from '@/components/marketing/MainLayout';
import { LanguageProvider } from '@/context/marketing/LanguageContext';
import { DiscountProvider } from '@/context/marketing/DiscountContext';
import { BookingProvider } from '@/components/marketing/BookingProvider';
import SmoothScrolling from '@/components/marketing/SmoothScrolling';
import { GlobalErrorReporter } from '@/components/observability/GlobalErrorReporter';

export const metadata: Metadata = {
  metadataBase: new URL('https://ekabalance.com'),
  title: {
    default: 'EKA Balance - Teràpies Integratives',
    template: '%s | EKA Balance',
  },
  description: 'Serveis premium de benestar amb teràpies integratives.',
  applicationName: 'EKA Balance',
  keywords: [
    'teràpies integratives',
    'kinesiologia',
    'benestar',
    'massatge terapèutic',
    'Feldenkrais',
    'Barcelona',
  ],
  authors: [{ name: 'EKA Balance' }],
  creator: 'EKA Balance',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'EKA Balance - Teràpies Integratives',
    description: 'Serveis premium de benestar amb teràpies integratives.',
    url: '/',
    siteName: 'EKA Balance',
    images: [
      {
        url: '/images/eka_logo.png',
        width: 512,
        height: 512,
        alt: 'EKA Balance logo',
      },
    ],
    locale: 'ca_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EKA Balance - Teràpies Integratives',
    description: 'Serveis premium de benestar amb teràpies integratives.',
    images: ['/images/eka_logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/eka_logo.png',
    apple: '/images/eka_logo.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'oklch(1 0 0)' },
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.145 0 0)' },
  ],
};

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="marketing marketing-bg">
      <SmoothScrolling>
        <LanguageProvider>
          <DiscountProvider>
            <BookingProvider>
              <GlobalErrorReporter />
              <MainLayout>{children}</MainLayout>
            </BookingProvider>
          </DiscountProvider>
        </LanguageProvider>
      </SmoothScrolling>
    </div>
  );
}
