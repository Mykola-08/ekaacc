import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";
import { DebugStatus } from "@ekaacc/shared-ui";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Integrative Massage Booking - Elena V.",
  description: "Restoring balance through structural integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${manrope.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col bg-[#0f0f11] text-slate-200`}
      >
        <div className="flex-1">
          {children}
        </div>
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
