'use client';

import Link from 'next/link';
import { type LucideIcon, ChevronRight } from 'lucide-react';
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
        'group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-200 hover:bg-secondary/50',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {desc && (
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{desc}</div>
        )}
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
    </Link>
  );
}
