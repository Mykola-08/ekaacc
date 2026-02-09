import { type Transition, type Variants } from 'motion/react';

/**
 * Universal Motion Configuration
 * Based on the "Apple-like / Pre-Liquid-Glass" design prompt.
 *
 * Feel: Snappy, controlled, premium. No wobble.
 */

/* ----------------------------------------------------------------
   EASING CURVES
   ---------------------------------------------------------------- */

/** Apple HIG Quint-out — primary entrance ease */
export const appleEase = [0.16, 1, 0.3, 1] as const;

/* ----------------------------------------------------------------
   SPRING PRESETS
   ---------------------------------------------------------------- */

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

/* ----------------------------------------------------------------
   TWEEN TRANSITIONS
   ---------------------------------------------------------------- */

export const quickTransition: Transition = {
  duration: 0.3,
  ease: appleEase as unknown as number[],
};

export const standardTransition: Transition = {
  duration: 0.5,
  ease: appleEase as unknown as number[],
};

export const slowTransition: Transition = {
  duration: 0.6,
  ease: appleEase as unknown as number[],
};

/* ----------------------------------------------------------------
   ENTRANCE VARIANTS
   Usage:
     <motion.div variants={fadeInUp} initial="hidden" animate="visible" />
   ---------------------------------------------------------------- */

/** Fade + slide up 20px — THE default entrance */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: standardTransition },
};

/** Larger slide up (30px) — heroes, modals, auth forms */
export const fadeInUpLarge: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: slowTransition },
};

/** Small slide up (10px) — buttons, subtle elements */
export const fadeInUpSmall: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: standardTransition },
};

/** Slide in from left — form fields, sequential items */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: standardTransition },
};

/** Slide in from right */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0, transition: standardTransition },
};

/** Scale-in + fade — logos, avatars, card bodies */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: standardTransition },
};

/** Simple fade — overlays, background elements */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: quickTransition },
};

/* ----------------------------------------------------------------
   STAGGER CONTAINERS
   Wrap children — child variants animate automatically.
   ---------------------------------------------------------------- */

/** Standard stagger — 0.1s gap */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/** Fast stagger — 0.05s gap (lists, table rows, grids) */
export const staggerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

/** Slow stagger — 0.15s gap (feature sections, hero cards) */
export const staggerSlow: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

/* ----------------------------------------------------------------
   INTERACTION VARIANTS — hover / tap
   ---------------------------------------------------------------- */

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

export const pressScale = {
  whileTap: { scale: 0.97 },
  transition: SPRING_DEFAULT,
};

export const hoverLift = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.98 },
  transition: SPRING_DEFAULT,
};

/* ----------------------------------------------------------------
   LIST / GRID ITEMS — custom-delay stagger for index-based usage
   ---------------------------------------------------------------- */

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

/* ----------------------------------------------------------------
   HELPERS
   ---------------------------------------------------------------- */

/** Create a delayed version of any variant set */
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    visible: {
      ...(typeof variants.visible === 'object' ? variants.visible : {}),
      transition: {
        ...(typeof variants.visible === 'object' &&
        variants.visible !== null &&
        'transition' in variants.visible
          ? (variants.visible.transition as object)
          : {}),
        delay,
      },
    },
  };
}
