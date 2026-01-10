'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/platform/utils';

interface AnimatedNumberProps {
  value: number;
  className?: string;
  springOptions?: {
    bounce?: number;
    duration?: number;
    stiffness?: number;
    damping?: number;
  };
  as?: 'span' | 'p' | 'div';
}

export function AnimatedNumber({
  value,
  className,
  springOptions = { bounce: 0, duration: 1 },
  as = 'span',
}: AnimatedNumberProps) {
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={springOptions}
      >
        {Math.round(value).toLocaleString()}
      </motion.span>
    </MotionTag>
  );
}
