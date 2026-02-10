'use client';

import { cn } from '@/lib/utils';

interface DashboardGreetingProps {
  name: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

/**
 * Reusable greeting banner for all dashboard home views.
 * Shows a time-based greeting with the user's name.
 */
export function DashboardGreeting({
  name,
  subtitle,
  badge,
  className,
}: DashboardGreetingProps) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[20px] border border-border bg-card p-8 shadow-sm',
        className
      )}
    >
      <div className="relative z-10">
        {badge && (
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
            <span className="text-[10px] font-bold tracking-wider uppercase">
              {badge}
            </span>
          </div>
        )}
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          {greeting},{' '}
          <span className="text-primary">{name}</span>
        </h1>
        {subtitle && (
          <p className="max-w-lg font-medium text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
