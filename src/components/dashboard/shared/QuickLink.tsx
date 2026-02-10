'use client';

import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  desc?: string;
  className?: string;
}

/**
 * Reusable quick-action link card for dashboard pages.
 * Used by Admin, Therapist, and Client dashboards for navigation shortcuts.
 */
export function QuickLink({
  href,
  icon: Icon,
  label,
  desc,
  className,
}: QuickLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-start gap-4 rounded-[20px] border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/20 hover:shadow-md',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {desc && (
          <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
        )}
      </div>
    </Link>
  );
}
