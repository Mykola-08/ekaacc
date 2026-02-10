import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium transition-all [&>svg]:size-3! inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground [a&]:hover:bg-primary/80',
        secondary:
          'bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 [a&]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20',
        outline: 'border-border text-foreground [a&]:hover:bg-muted [a&]:hover:text-muted-foreground',
        success:
          'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        warning:
          'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        info:
          'bg-primary/10 text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span data-slot="badge" data-variant={variant} className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
