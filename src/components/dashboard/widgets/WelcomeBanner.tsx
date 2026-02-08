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
        'bg-surface border-border group relative flex flex-col items-start justify-between gap-10 overflow-hidden rounded-2xl border p-10 shadow-sm md:flex-row md:items-center md:p-14',
        className
      )}
    >
      {/* Soft Blue Accent */}
      <div className="bg-accent/5 absolute -top-20 -right-20 h-80 w-80 rounded-full blur-[100px] transition-transform duration-1000 group-hover:scale-110" />

      <div className="relative z-10 space-y-4">
        <div className="space-y-1">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="text-primary text-4xl leading-[0.9] font-bold tracking-tighter md:text-5xl"
          >
            {title}
            <motion.span
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-primary block"
            >
              {firstName}.
            </motion.span>
          </motion.h1>
        </div>
        <p className="text-muted-foreground max-w-md text-lg leading-relaxed font-medium md:text-xl">
          {subtitle}
        </p>
      </div>

      {action && (
        <div className="relative z-10 shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {action}
          </motion.div>
        </div>
      )}
    </div>
  );
}
