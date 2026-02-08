'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={cn(
        'bg-card border-border group relative flex h-full flex-col justify-between overflow-hidden border p-8 transition-shadow duration-300',
        'rounded-[20px]', // Apple standard 20px radius
        className
      )}
      style={{ boxShadow: 'var(--shadow-base)' }} // Use CSS variable for shadow
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-base)';
      }}
    >
      <div className="relative z-10 w-full space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="bg-card text-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
            )}
            <h3 className="text-foreground text-[17px] font-semibold">{title}</h3>
          </div>
        </header>

        <div className="space-y-1">
          {value && (
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-5xl leading-none font-bold tracking-tight text-transparent">
              {value}
            </div>
          )}
          {subtext && <div className="text-muted-foreground text-lg font-semibold">{subtext}</div>}
        </div>

        {children}
      </div>

      {/* "Squishy" Action Button at bottom of card */}
      {(actionLabel || onAction) && (
        <div className="relative z-10 mt-8">
          <button
            onClick={onAction}
            className={cn(
              'flex h-14 w-full items-center justify-center gap-2 text-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95',
              'rounded-[20px]', // Apple standard 20px radius
              variant === 'default'
                ? 'from-secondary to-secondary/80 text-foreground hover:from-secondary/90 hover:to-secondary/70 bg-gradient-to-r'
                : variant === 'primary'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 hover:from-red-100 hover:to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 dark:text-red-400 dark:hover:from-red-900/60 dark:hover:to-rose-900/60'
            )}
            style={{
              boxShadow: variant === 'primary' ? 'var(--shadow-lg)' : 'var(--shadow-md)',
            }}
          >
            {actionLabel || 'Manage'}
          </button>
        </div>
      )}
    </motion.div>
  );
}
