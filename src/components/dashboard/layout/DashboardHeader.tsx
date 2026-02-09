'use client';

import React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Sun03Icon } from '@hugeicons/core-free-icons';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { NotificationDropdown } from './NotificationDropdown';

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
        'mb-8 flex flex-col items-end justify-between gap-4 pb-6 transition-all md:flex-row',
        className
      )}
    >
      <div className="space-y-1">
        {/* Clean, high-availability header style */}
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex w-full items-center gap-4 md:w-auto">{children}</div>
    </div>
  );
}
