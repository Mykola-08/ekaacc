'use client';

import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  colorClass?: string; // e.g., "bg-blue-50 text-blue-600"
  className?: string;
  action?: ReactNode; // Top right icon/action
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  colorClass = 'bg-surface-container text-primary',
  className,
  action,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-surface border-border group flex h-44 flex-col justify-between border p-6 transition-all',
        'rounded-[20px]', // Apple standard 20px radius
        className
      )}
      style={{ boxShadow: 'var(--shadow-base)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-base)';
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110',
            colorClass
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={2} />
        </div>
        {action || (
          <ArrowUpRight className="text-muted group-hover:text-accent h-5 w-5 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        )}
      </div>
      <div className="space-y-1">
        <div className="text-muted text-xs font-bold tracking-[0.1em] uppercase">{label}</div>
        <div className="text-primary text-3xl leading-none font-bold tracking-tight tabular-nums">
          {value}
        </div>
      </div>
    </div>
  );
}
