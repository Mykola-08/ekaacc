'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  InformationCircleIcon,
  Alert02Icon,
  Loading03Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export type FeedbackStatus = 'idle' | 'loading' | 'success' | 'error' | 'warning' | 'info';

interface InlineFeedbackProps {
  status: FeedbackStatus;
  message?: string;
  className?: string;
  /** Auto-dismiss success after ms (0 = no auto-dismiss) */
  autoDismissMs?: number;
  onDismiss?: () => void;
}

const STATUS_CONFIG: Record<Exclude<FeedbackStatus, 'idle'>, {
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  loading: {
    icon: Loading03Icon,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/50',
    borderColor: 'border-border',
  },
  success: {
    icon: CheckmarkCircle02Icon,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50',
  },
  error: {
    icon: AlertCircleIcon,
    color: 'text-destructive',
    bgColor: 'bg-destructive/5',
    borderColor: 'border-destructive/20',
  },
  warning: {
    icon: Alert02Icon,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800/50',
  },
  info: {
    icon: InformationCircleIcon,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800/50',
  },
};

/**
 * InlineFeedback — Replaces toasts with contextual, morphing feedback.
 * Renders inline next to the element that triggered the action.
 */
export function InlineFeedback({
  status,
  message,
  className,
  autoDismissMs = 3000,
  onDismiss,
}: InlineFeedbackProps) {
  React.useEffect(() => {
    if (status === 'success' && autoDismissMs > 0 && onDismiss) {
      const timer = setTimeout(onDismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [status, autoDismissMs, onDismiss]);

  if (status === 'idle' || !message) return null;

  const config = STATUS_CONFIG[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, height: 0, y: -4 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -4 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className={cn(
          'flex items-center gap-2 overflow-hidden rounded-lg border px-3 py-2 text-sm',
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        <HugeiconsIcon
          icon={config.icon}
          className={cn(
            'size-4 shrink-0',
            config.color,
            status === 'loading' && 'animate-spin'
          )}
        />
        <span className={cn('text-sm', config.color)}>{message}</span>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Compact inline feedback — just icon + text, no background.
 * Ideal for placing next to buttons in card footers.
 */
export function InlineFeedbackCompact({
  status,
  message,
  className,
  autoDismissMs = 3000,
  onDismiss,
}: InlineFeedbackProps) {
  React.useEffect(() => {
    if (status === 'success' && autoDismissMs > 0 && onDismiss) {
      const timer = setTimeout(onDismiss, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [status, autoDismissMs, onDismiss]);

  if (status === 'idle' || !message) return null;

  const config = STATUS_CONFIG[status];

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={status}
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        className={cn('inline-flex items-center gap-1.5 text-sm', config.color, className)}
      >
        <HugeiconsIcon
          icon={config.icon}
          className={cn('size-3.5 shrink-0', status === 'loading' && 'animate-spin')}
        />
        <span>{message}</span>
      </motion.span>
    </AnimatePresence>
  );
}
