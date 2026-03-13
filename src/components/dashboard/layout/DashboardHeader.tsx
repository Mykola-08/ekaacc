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
        'border-border mb-6 flex flex-col items-end justify-between gap-3 border-b pb-4 transition-colors md:flex-row',
        className
      )}
    >
      <div className=".5">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>

      <div className="flex w-full items-center gap-3 md:w-auto">{children}</div>
    </div>
  );
}
