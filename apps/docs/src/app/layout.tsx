import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { RoleProvider } from "@/components/RoleContext";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EKA Documentation",
  description: "Detailed documentation for EKA platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RoleProvider>
          {children}
        </RoleProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
