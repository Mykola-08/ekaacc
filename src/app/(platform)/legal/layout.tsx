import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EKA Balance - Legal Center',
  description: 'Legal documents, policies, and compliance information for EKA Balance',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-foreground text-xl font-semibold tracking-tight">
              EKA Balance <span className="text-muted-foreground font-normal">| Legal</span>
            </Link>
            <nav className="text-muted-foreground hidden space-x-6 text-sm font-medium md:flex">
              <Link href="/legal/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/legal/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/legal/cookies" className="hover:text-foreground transition-colors">
                Cookies
              </Link>
              <Link href="/legal/disclaimer" className="hover:text-foreground transition-colors">
                Disclaimer
              </Link>
              <Link href="/legal/imprint" className="hover:text-foreground transition-colors">
                Imprint
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://app.ekabalance.com"
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              Back to Main Site
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl grow px-4 py-12">
        <div className="bg-card rounded-xl border p-8 shadow-sm md:p-12">{children}</div>
      </main>

      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 font-semibold">EKA Balance</h3>
              <p className="text-muted-foreground text-sm">
                Empowering your journey to mental wellness through technology and professional care.
              </p>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                Legal
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="/legal/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/cookies" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/disclaimer" className="hover:underline">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                Contact
              </h4>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>legal@ekabalance.com</li>
                <li>dpo@ekabalance.com</li>
                <li>support@ekabalance.com</li>
              </ul>
            </div>
            <div>
              <h4 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                Updates
              </h4>
              <p className="text-muted-foreground text-sm">
                Legal documents last updated: <br />
                <span className="text-foreground font-medium">November 25, 2025</span>
              </p>
            </div>
          </div>
          <div className="text-muted-foreground/80 border-t pt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} EKA Balance. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
