'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, Tick02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

export interface MorphingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  status?: 'idle' | 'loading' | 'success' | 'error';
  loadingLabel?: string;
  successLabel?: string;
  errorLabel?: string;
  idleLabel: string; // Required
  icon?: React.ReactNode;
}

export function MorphingActionButton({
  status = 'idle',
  loadingLabel = 'Processing...',
  successLabel = 'Done',
  errorLabel = 'Failed',
  idleLabel,
  icon,
  className,
  disabled,
  ...props
}: MorphingActionButtonProps) {
  const isIdle = status === 'idle';
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <Button
      className={cn(
        'relative min-w-30 overflow-hidden transition-all duration-300',
        (isSuccess || isError) && 'cursor-default',
        isSuccess && 'border-success bg-success text-success-foreground hover:bg-success/90',
        isError &&
          'bg-destructive hover:bg-destructive/90 text-destructive-foreground border-destructive',
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isIdle && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            {icon}
            <span>{idleLabel}</span>
          </motion.div>
        )}

        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <HugeiconsIcon icon={Loading03Icon} className="size-4 animate-spin"  />
            <span>{loadingLabel}</span>
          </motion.div>
        )}

        {isSuccess && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <HugeiconsIcon icon={Tick02Icon} className="size-4"  />
            <span>{successLabel}</span>
          </motion.div>
        )}

        {isError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4"  />
            <span>{errorLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
