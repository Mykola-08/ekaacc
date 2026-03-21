import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-muted animate-pulse rounded-[calc(var(--radius)*0.6)]', className)}
      {...props}
    />
  );
}

export { Skeleton };
