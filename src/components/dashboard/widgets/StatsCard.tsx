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
        'group border-border bg-card flex h-40 flex-col justify-between rounded-xl border p-5 transition-colors duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', colorClass)}>
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        {action || (
          <ArrowUpRight className="text-muted-foreground/40 group-hover:text-muted-foreground h-4 w-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>
      <div className=".5">
        <div className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
          {label}
        </div>
        <div className="text-foreground text-2xl leading-none font-semibold tracking-tight tabular-nums">
          {value}
        </div>
      </div>
    </div>
  );
}
