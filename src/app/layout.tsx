
import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { LanguageProvider } from '@/context/LanguageContext';
import { DiscountProvider } from "@/context/DiscountContext";
import { BookingProvider } from '@/components/marketing/BookingProvider';
import { AuthProvider } from "@/context/platform/auth-context";
import SmoothScrolling from "@/components/marketing/SmoothScrolling";
import { GlobalErrorReporter } from '@/components/observability/GlobalErrorReporter';

export const metadata: Metadata = {
  title: "EKA Balance - Teràpies Integratives",
  description: "Serveis premium de benestar amb teràpies integratives.",
  icons: {
    icon: '/images/eka_logo.png',
    apple: '/images/eka_logo.png',
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <SmoothScrolling>
          <AuthProvider>
            <LanguageProvider>
              <DiscountProvider>
                <BookingProvider>
                  <GlobalErrorReporter />
                  {children}
                </BookingProvider>
              </DiscountProvider>
            </LanguageProvider>
          </AuthProvider>
        </SmoothScrolling>
      </body>
    </html>
  );
}

