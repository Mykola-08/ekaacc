
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { LanguageProvider } from '@/contexts/LanguageContext';
import { DiscountProvider } from "@/contexts/DiscountContext";
import { BookingProvider } from '@/components/BookingProvider';
import { AuthProvider } from "@/contexts/platform/auth-context";
import SmoothScrolling from "@/components/SmoothScrolling";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <SmoothScrolling>
          <AuthProvider>
            <LanguageProvider>
              <DiscountProvider>
                <BookingProvider>
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
