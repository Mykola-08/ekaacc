'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ReactNode, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TextLoopProps {
  children: ReactNode[];
  className?: string;
  interval?: number;
  transition?: any;
}

export function TextLoop({
  children,
  className,
  interval = 2,
  transition = { duration: 0.3, ease: 'easeInOut' },
}: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % children.length);
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [children.length, interval]);

  return (
    <div className={cn('relative inline-block', className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={transition}
        >
          {children[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
