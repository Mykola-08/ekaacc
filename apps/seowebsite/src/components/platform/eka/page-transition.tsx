'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Smooth page transitions with framer-motion
 * Improves perceived performance during navigation
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Fade transition - lighter animation for nested components
 */
export function FadeTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide transition - for sidebars and modals
 */
export function SlideTransition({ children, direction = 'left' }: PageTransitionProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const variants = {
    left: { x: -50 },
    right: { x: 50 },
    up: { y: -50 },
    down: { y: 50 },
  };

  return (
    <motion.div
      initial={{ ...variants[direction], opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ ...variants[direction], opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
