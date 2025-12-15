import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ChatBot from "@/components/ChatBot";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Eka Booking",
  description: "Booking application for Eka Balance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <div className="flex-1">
          {children}
        </div>
        <SiteFooter />
        <CookieConsent />
        <ChatBot />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
