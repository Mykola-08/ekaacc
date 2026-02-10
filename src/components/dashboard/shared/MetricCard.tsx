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
  bg = 'bg-primary/8 text-primary',
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors duration-200',
        className
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          bg
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <div className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          {label}
        </div>
        <div className="text-xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
      </div>
    </div>
  );
}
