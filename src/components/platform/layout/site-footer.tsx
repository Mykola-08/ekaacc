"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/platform/config/routes";

export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} EKA Account</p>
            <p className="text-xs text-muted-foreground">For informational purposes only. Not medical advice.</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href={ROUTES.terms}>Terms</Link>
            <Link className="text-muted-foreground hover:text-foreground" href={ROUTES.privacy}>Privacy</Link>
            <Link className="text-muted-foreground hover:text-foreground" href={ROUTES.cookies}>Cookies</Link>
            <Link className="text-muted-foreground hover:text-foreground" href={ROUTES.privacyControls}>Privacy Controls</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

