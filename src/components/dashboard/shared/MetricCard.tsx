'use client';

import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  bg?: string;
  className?: string;
}

/**
 * Reusable metric card used across Admin, Therapist, and Client dashboards.
 * Displays a single KPI with icon, label, and value.
 */
export function MetricCard({
  icon: Icon,
  label,
  value,
  bg = 'bg-primary/10 text-primary',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-[20px] border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/20',
        className
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-xl',
          bg
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
        <div className="text-xl font-bold tracking-tight text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}
