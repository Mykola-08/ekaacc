import { Inter } from 'next/font/google';
import type { Metadata, Viewport } from 'next';
import './marketing-globals.css';
import MainLayout from '@/marketing/components/MainLayout';
import { LanguageProvider } from '@/marketing/contexts/LanguageContext';
import { DiscountProvider } from '@/marketing/contexts/DiscountContext';
import { BookingProvider } from '@/marketing/components/BookingProvider';
import SmoothScrolling from '@/marketing/components/SmoothScrolling';
import JsonLd from '@/marketing/components/JsonLd';
import ErrorBoundary from '@/marketing/components/ErrorBoundary';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

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
    'Somatic Therapy',
    'Wellness',
    'Integrative Therapy',
    'Corporate Wellness Programs',
    'Business Wellness Solutions',
    'Employee Well-being',
    'Benestar per a empreses',
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
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`marketing-theme ${inter.variable} overflow-clip bg-white font-sans text-gray-900`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-blue-600 focus:shadow-lg"
      >
        Skip to main content
      </a>
      <SmoothScrolling>
        <LanguageProvider>
          <DiscountProvider>
            <BookingProvider>
              <ErrorBoundary>
                <JsonLd />
                <MainLayout>{children}</MainLayout>
              </ErrorBoundary>
            </BookingProvider>
          </DiscountProvider>
        </LanguageProvider>
      </SmoothScrolling>
    </div>
  );
}
