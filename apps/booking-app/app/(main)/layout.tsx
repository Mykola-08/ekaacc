import ChatBot from "@/components/ChatBot";
import { CookieConsent } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/site-footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <div className="flex-1">
          {children}
        </div>
        <SiteFooter />
        <CookieConsent />
        <ChatBot />
    </>
  );
}
