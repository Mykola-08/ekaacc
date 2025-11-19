'use client';

import { motion, type Transition } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InViewProps {
  children: ReactNode;
  variants?: {
    hidden: any;
    visible: any;
  };
  transition?: Transition;
  viewOptions?: {
    margin?: string;
    once?: boolean;
    amount?: 'some' | 'all' | number;
  };
  className?: string;
}

const defaultVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.6, ease: 'easeOut' },
  viewOptions = { margin: '0px', once: true, amount: 0.3 },
  className,
}: InViewProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewOptions}
      variants={variants}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
