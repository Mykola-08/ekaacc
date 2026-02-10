import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

import { cn } from '@/lib/utils';
import { SPRING_SNAPPY } from '@/lib/motion';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent bg-clip-padding text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive group/button select-none",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive/10 hover:bg-destructive/20 text-destructive dark:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30 focus-visible:border-destructive/40',
        outline:
          'border-border bg-background hover:bg-muted hover:text-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground',
        success:
          'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600',
        warning:
          'bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500',
        ghost: 'hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 aria-expanded:bg-muted aria-expanded:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 gap-1.5 px-2.5 has-[>svg]:px-2',
        sm: 'h-7 rounded-md gap-1 px-2.5 text-xs has-[>svg]:px-1.5 [&_svg:not([class*=size-])]:size-3.5',
        lg: 'h-9 gap-1.5 px-2.5 has-[>svg]:px-3',
        icon: 'size-8',
        'icon-sm': 'size-7 rounded-md',
        'icon-lg': 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends
    Omit<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'ref'
    >,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;
    const content = loading ? (
      <>
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
        {typeof children === 'string' ? children : null}
      </>
    ) : children;

    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref as React.ForwardedRef<HTMLElement>}
          {...props}
        >
          {content}
        </Slot>
      );
    }

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileTap={{ scale: 0.95 }}
        transition={SPRING_SNAPPY}
        disabled={isDisabled}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
