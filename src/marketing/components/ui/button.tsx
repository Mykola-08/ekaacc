import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-transform duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-600  border border-transparent',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 ',
        outline: 'border border-primary bg-transparent text-primary hover:bg-primary/5 ',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80  border border-transparent',
        ghost: 'hover:bg-accent hover:text-accent-foreground ',
        link: 'text-primary underline-offset-4 hover:underline ',
        white: 'bg-white text-black hover:bg-gray-100  border-transparent',
        'white-outline': 'bg-transparent text-white border border-white hover:bg-white/10 ',
      },
      size: {
        default: 'h-10 px-5 py-2.5', // slightly larger touch target
        sm: 'h-8 rounded-full px-3 text-xs',
        lg: 'h-12 rounded-full px-8 text-base',
        xl: 'h-14 rounded-full px-10 text-lg font-medium',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
