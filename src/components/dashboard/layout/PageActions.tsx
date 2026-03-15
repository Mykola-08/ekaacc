import { cn } from '@/lib/utils';

export function PageActions({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex items-center justify-end gap-2', className)}>{children}</div>;
}
