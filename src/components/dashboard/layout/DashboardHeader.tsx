import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  showDate?: boolean;
  className?: string;
}

export function DashboardHeader({
  title,
  subtitle,
  children,
  showDate = true,
  className,
}: DashboardHeaderProps) {
  return (
    <div
      className={cn(
        'mb-8 flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0',
        className
      )}
    >
      <div>
        <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {(children || showDate) && <div className="flex items-center space-x-2">{children}</div>}
    </div>
  );
}
