'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface WelcomeBannerProps {
  title: string;
  firstName: string;
  subtitle: string;
  action?: ReactNode;
  className?: string;
}

export function WelcomeBanner({
  title,
  firstName,
  subtitle,
  action,
  className,
}: WelcomeBannerProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-card p-8 md:flex-row md:items-center md:p-10',
        className
      )}
    >
      <div className="space-y-3">
        <motion.h1
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
          className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
        >
          {title}
          <motion.span
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-primary block"
          >
            {firstName}.
          </motion.span>
        </motion.h1>
        <p className="max-w-md text-sm font-medium text-muted-foreground md:text-base">
          {subtitle}
        </p>
      </div>

      {action && (
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </div>
  );
}
