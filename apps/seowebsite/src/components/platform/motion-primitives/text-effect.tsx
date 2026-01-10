'use client';

import { motion, type Transition, type Variants } from 'framer-motion';
import { ReactElement, useMemo } from 'react';
import { cn } from '@/lib/platform/utils';

type TextEffectProps = {
  children: string;
  per?: 'word' | 'char' | 'line';
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?:
    | 'fade'
    | 'slide'
    | 'scale'
    | 'blur'
    | 'blur-slide'
    | 'fade-in-blur';
  delay?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  segmentWrapperClassName?: string;
};

const defaultStaggerTimes = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const presetVariants = {
  fade: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
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
        transition: { staggerChildren: 0.05 },
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
        transition: { staggerChildren: 0.05 },
      },
    },
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  blur: {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
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
        transition: { staggerChildren: 0.05 },
      },
    },
    item: {
      hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
      visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
    },
  },
  'fade-in-blur': {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
      },
    },
    item: {
      hidden: { opacity: 0, filter: 'blur(4px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
    },
  },
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset,
  delay = 0,
  trigger = true,
  onAnimationComplete,
  segmentWrapperClassName,
}: TextEffectProps): ReactElement {
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.p;
  const segments = useMemo(() => {
    if (per === 'line') {
      return children.split('\n');
    }
    return per === 'word' ? children.split(' ') : children.split('');
  }, [children, per]);

  const selectedVariants = preset
    ? presetVariants[preset]
    : variants || presetVariants.fade;

  return (
    <MotionTag
      initial="hidden"
      animate={trigger ? 'visible' : 'hidden'}
      variants={selectedVariants.container}
      onAnimationComplete={onAnimationComplete}
      className={cn('whitespace-pre-wrap', className)}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          variants={selectedVariants.item}
          className={cn(
            'inline-block',
            per === 'line' && 'block',
            segmentWrapperClassName
          )}
        >
          {segment}
          {per === 'word' && index < segments.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </MotionTag>
  );
}
