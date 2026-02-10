'use client';

import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  colorClass?: string;
  className?: string;
  action?: ReactNode;
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  colorClass = 'bg-primary/8 text-primary',
  className,
  action,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'group flex h-40 flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg',
            colorClass
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        {action || (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-muted-foreground" />
        )}
      </div>
      <div className="space-y-0.5">
        <div className="text-[11px] font-medium tracking-widest text-muted-foreground uppercase">
          {label}
        </div>
        <div className="text-2xl font-semibold leading-none tracking-tight text-foreground tabular-nums">
          {value}
        </div>
      </div>
    </div>
  );
}
