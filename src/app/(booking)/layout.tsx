import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-theme min-h-screen bg-background">
      {/* Minimal branded header */}
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
            <div className="flex size-7 items-center justify-center rounded-[calc(var(--radius)*0.8)] bg-primary text-primary-foreground shadow-sm">
              <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
            </div>
            EKA Balance
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full text-xs">
              <Link href="/dashboard">My Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-xs">
              <Link href="/">Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto w-full max-w-3xl px-4 py-8 pb-20">
        {children}
      </main>
    </div>
  );
}
