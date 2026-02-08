'use client';

import * as React from 'react';
import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { motion, AnimatePresence, type Variants } from 'motion/react';

import { cn } from '@/lib/utils';

const HoverCard = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const hoverCardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 2,
    transitionEnd: { display: 'none' },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    display: 'block',
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
};

const MotionHoverCardContentWrapper = React.forwardRef<HTMLDivElement, any>(
  ({ className, ...props }, ref) => {
    const isOpen = props['data-state'] === 'open';
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isOpen ? 'visible' : 'hidden'}
        variants={hoverCardVariants}
        className={className}
        {...props}
      />
    );
  }
);
MotionHoverCardContentWrapper.displayName = 'MotionHoverCardContentWrapper';

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    forceMount
    asChild
    className={cn(
      'bg-popover text-popover-foreground z-50 w-64 origin-[--radix-hover-card-content-transform-origin] rounded-[20px] border-none p-4 shadow-md outline-none',
      className
    )}
    {...props}
  >
    <MotionHoverCardContentWrapper />
  </HoverCardPrimitive.Content>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
