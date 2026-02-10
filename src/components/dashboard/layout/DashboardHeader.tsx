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
        'mb-6 flex flex-col items-end justify-between gap-3 border-b border-border pb-4 transition-colors md:flex-row',
        className
      )}
    >
      <div className="space-y-0.5">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="flex w-full items-center gap-3 md:w-auto">{children}</div>
    </div>
  );
}
