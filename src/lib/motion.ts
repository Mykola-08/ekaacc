import { type Transition, type Variants } from 'motion/react';

/**
 * Universal Spring Motion Configuration
 * Based on the "Apple-like / Pre-Liquid-Glass" design prompt.
 *
 * Feel: Snappy, controlled, premium. No wobble.
 */

export const SPRING_DEFAULT: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
  restDelta: 0.001,
};

export const SPRING_SNAPPY: Transition = {
  type: 'spring',
  stiffness: 450,
  damping: 35,
  mass: 0.8,
};

export const SPRING_SLOW: Transition = {
  type: 'spring',
  stiffness: 220,
  damping: 30,
  mass: 1,
};

// Interaction Variants

export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.02,
    y: -1,
    transition: SPRING_DEFAULT,
  },
  tap: {
    scale: 0.96,
    transition: SPRING_SNAPPY,
  },
};

export const itemsFadeIn: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...SPRING_DEFAULT,
      delay: i * 0.04,
    },
  }),
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: SPRING_SLOW,
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: SPRING_SNAPPY,
  },
};

export const dialogTransition: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: SPRING_DEFAULT,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeOut' }, // Quick exit
  },
};

export const popoverTransition: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: SPRING_SNAPPY,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 2,
    transition: { duration: 0.1, ease: 'easeOut' },
  },
};

export const dropdownTransition: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 2 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { ...SPRING_SNAPPY, stiffness: 500 }, // Super snappy menus
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 2,
    transition: { duration: 0.1, ease: 'easeOut' },
  },
};

export const sheetVariants = {
  hidden: (side: 'left' | 'right' | 'top' | 'bottom' = 'right') => {
    switch (side) {
      case 'left':
        return { x: '-100%', opacity: 0 };
      case 'right':
        return { x: '100%', opacity: 0 };
      case 'top':
        return { y: '-100%', opacity: 0 };
      case 'bottom':
        return { y: '100%', opacity: 0 };
      default:
        return { x: '100%', opacity: 0 };
    }
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: SPRING_DEFAULT,
  },
  exit: (side: 'left' | 'right' | 'top' | 'bottom' = 'right') => {
    switch (side) {
      case 'left':
        return { x: '-100%', opacity: 0, transition: SPRING_SNAPPY };
      case 'right':
        return { x: '100%', opacity: 0, transition: SPRING_SNAPPY };
      case 'top':
        return { y: '-100%', opacity: 0, transition: SPRING_SNAPPY };
      case 'bottom':
        return { y: '100%', opacity: 0, transition: SPRING_SNAPPY };
      default:
        return { x: '100%', opacity: 0, transition: SPRING_SNAPPY };
    }
  },
};
