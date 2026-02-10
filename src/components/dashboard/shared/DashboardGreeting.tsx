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
        'rounded-xl border border-border bg-card p-6 md:p-8',
        className
      )}
    >
      <div>
        {badge && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-primary">
            <span className="text-[10px] font-semibold tracking-wider uppercase">
              {badge}
            </span>
          </div>
        )}
        <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {greeting},{' '}
          <span className="text-primary">{name}</span>
        </h1>
        {subtitle && (
          <p className="max-w-lg text-sm font-medium text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
