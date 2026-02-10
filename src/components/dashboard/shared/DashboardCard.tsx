'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export interface DashboardCardProps {
  title?: string;
  value?: string | number;
  subtext?: string;
  icon?: React.ElementType;
  actionLabel?: string;
  onAction?: () => void;
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'danger';
}

export function DashboardCard({
  title,
  value,
  subtext,
  icon: Icon,
  actionLabel,
  onAction,
  children,
  className,
  variant = 'default',
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      className={cn(
        'group relative flex h-full flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-6 transition-colors duration-200',
        className
      )}
    >
      <div className="relative z-10 w-full space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/8 text-primary">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </div>
            )}
            {title && (
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            )}
          </div>
        </header>

        <div className="space-y-1">
          {value && (
            <div className="text-3xl font-semibold tracking-tight text-foreground">
              {value}
            </div>
          )}
          {subtext && (
            <div className="text-sm font-medium text-muted-foreground">
              {subtext}
            </div>
          )}
        </div>

        {children}
      </div>

      {(actionLabel || onAction) && (
        <div className="relative z-10 mt-4">
          <button
            onClick={onAction}
            className={cn(
              'flex h-9 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98]',
              variant === 'default'
                ? 'bg-secondary text-foreground hover:bg-secondary/80'
                : variant === 'primary'
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-destructive/10 text-destructive hover:bg-destructive/15'
            )}
          >
            {actionLabel || 'Manage'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
