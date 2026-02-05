
import type { Metadata, Viewport } from "next";
import "@/react-app/index.css";
import { LanguageProvider } from '@/react-app/contexts/LanguageContext';
import { DiscountProvider } from "@/react-app/contexts/DiscountContext";
import { BookingProvider } from '@/react-app/components/BookingProvider';
import { AuthProvider } from "@/context/platform/auth-context";
import SmoothScrolling from "@/app/components/SmoothScrolling";

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
