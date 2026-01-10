'use client';

import { motion, type Variants } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/platform/utils';

interface AnimatedGroupProps {
  children: ReactNode;
  className?: string;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  preset?: 'fade' | 'slide' | 'scale' | 'blur' | 'blur-slide';
}

const presetVariants = {
  fade: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  slide: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
  scale: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  blur: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
  'blur-slide': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    },
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
    },
  },
};

export function AnimatedGroup({
  children,
  className,
  variants,
  preset = 'fade',
}: AnimatedGroupProps) {
  const selectedVariants = variants || presetVariants[preset];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={selectedVariants.container}
      className={cn(className)}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={selectedVariants.item}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}
