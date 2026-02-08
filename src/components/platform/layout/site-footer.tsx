'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/platform/config/routes';

export default function SiteFooter() {
  return (
    <footer className="border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 mt-16 border-t backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-start">
          <div className="text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} EKA Account
            </p>
            <p className="text-muted-foreground text-xs">
              For informational purposes only. Not medical advice.
            </p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href={ROUTES.terms}>
              Terms
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href={ROUTES.privacy}>
              Privacy
            </Link>
            <Link className="text-muted-foreground hover:text-foreground" href={ROUTES.cookies}>
              Cookies
            </Link>
            <Link
              className="text-muted-foreground hover:text-foreground"
              href={ROUTES.privacyControls}
            >
              Privacy Controls
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
