import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";
import { DebugStatus } from "@ekaacc/shared-ui";
import "./globals.css";

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
    <html lang="en">
      <body
        className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground"
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
