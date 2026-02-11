// Enhanced Motion Components using Framer Motion
import { motion, useInView, useAnimation, Transition } from 'motion/react';
import { useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/shared/marketing/utils';

// InView Component
interface InViewProps {
  children: ReactNode;
  variants?: {
    hidden: { opacity?: number; y?: number; x?: number; scale?: number };
    visible: { opacity?: number; y?: number; x?: number; scale?: number };
  };
  transition?: Transition;
  className?: string;
}

export function InView({
  children,
  variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  transition = { duration: 0.3, ease: 'easeOut' },
  className,
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// TextShimmer Component
interface TextShimmerProps {
  children: ReactNode;
  className?: string;
}

export function TextShimmer({ children, className }: TextShimmerProps) {
  return (
    <motion.span
      className={cn('relative inline-block', className)}
      initial={{ backgroundPosition: '-200%' }}
      animate={{ backgroundPosition: '200%' }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
      style={{
        background:
          'linear-gradient(90deg, transparent 30%, oklch(1 0 0 / 0.8) 50%, transparent 70%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
      }}
    >
      {children}
    </motion.span>
  );
}

// AnimatedNumber Component
interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {value}
      </motion.span>
    </motion.span>
  );
}

// Tilt Component (simplified - no rotation effects)
interface TiltProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Tilt({ children, className, onClick }: TiltProps) {
  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
}

// Magnetic Component (simplified for buttons only)
interface MagneticProps {
  children: ReactNode;
  className?: string;
}

export function Magnetic({ children, className }: MagneticProps) {
  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

// BorderTrail Component
interface BorderTrailProps {
  children: ReactNode;
  className?: string;
}

export function BorderTrail({ children, className }: BorderTrailProps) {
  return (
    <motion.div
      className={cn('relative', className)}
      whileHover={{
        boxShadow: '0 0 20px color-mix(in oklch, var(--eka-gold) 30%, transparent)',
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-transparent bg-linear-to-r from-warning/50 via-info/50 to-warning/50 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: `linear-gradient(45deg, transparent, color-mix(in oklch, var(--eka-gold) 10%, transparent), transparent)`,
        }}
      />
      {children}
    </motion.div>
  );
}

// GlowEffect Component
interface GlowEffectProps {
  children?: ReactNode;
  className?: string;
}

export function GlowEffect({ children, className }: GlowEffectProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.7 }}
      animate={{
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// AnimatedBackground Component
interface AnimatedBackgroundProps {
  className?: string;
}

export function AnimatedBackground({ className }: AnimatedBackgroundProps) {
  return (
    <motion.div
      className={cn('absolute inset-0', className)}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background:
          `radial-gradient(circle at 50% 50%, color-mix(in oklch, var(--eka-gold) 10%, transparent) 0%, transparent 50%)`,
      }}
    />
  );
}

// Spotlight Component (no scale effects for non-buttons)
interface SpotlightProps {
  children: ReactNode;
  className?: string;
}

export function Spotlight({ children, className }: SpotlightProps) {
  return (
    <motion.div className={cn('relative', className)}>
      <motion.div
        className="bg-gradient-radial absolute inset-0 from-background/20 via-transparent to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </motion.div>
  );
}

// Cursor Component (Global cursor effect)
interface CursorProps {
  className?: string;
}

export function Cursor({ className }: CursorProps) {
  return (
    <motion.div
      className={cn(
        'pointer-events-none fixed top-0 left-0 z-50 h-4 w-4 mix-blend-difference',
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
