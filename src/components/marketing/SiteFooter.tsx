import Link from 'next/link';
import { cn } from '@/lib/utils';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-transparent pt-16 pb-8">
      {/* Top Border with gradient fade */}
      <div className="absolute top-0 right-0 left-0 h-px bg-linear-to-r from-transparent via-black/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Column - Simplified */}
          <div className="col-span-1 space-y-4 md:col-span-2">
            <Link
              href="/"
              className="group flex items-center gap-3 opacity-90 transition-opacity hover:opacity-100"
            >
              <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-sans text-sm font-bold shadow-sm">
                E
              </div>
              <span className="text-foreground/90 font-sans text-lg font-bold tracking-tight">
                EKA BALANCE
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-base leading-relaxed font-normal">
              Restoring balance through structural integration.
              <span className="mt-1 block opacity-70">Designed for your well-being.</span>
            </p>
          </div>

          {/* Links Column 1 - Clean typography */}
          <div className="space-y-4">
            <h4 className="text-foreground font-sans text-sm font-medium tracking-wide opacity-80">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {['Services', 'About', 'Journal', 'Pricing'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="space-y-4">
            <h4 className="text-foreground font-sans text-sm font-medium tracking-wide opacity-80">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <li key={link}>
                  <Link
                    href="/legal"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
          <p className="text-xs font-medium text-muted-foreground/60">© {currentYear} Eka Balance Inc.</p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-success/100/80 shadow-sm" />
              <span>All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
