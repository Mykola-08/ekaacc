import { Suspense } from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string; // Additional classes for the default fallback container
}

export function SuspenseBoundary({ children, fallback, className }: SuspenseBoundaryProps) {
  return (
    <Suspense
      fallback={
        fallback || (
          <div
            className={cn(
              'text-muted-foreground flex h-full min-h-[50vh] w-full items-center justify-center p-8',
              className
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <HugeiconsIcon icon={Loading03Icon} className="text-primary size-8 animate-spin" />
              <span className="text-sm font-medium">Carregant...</span>
            </div>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
}
