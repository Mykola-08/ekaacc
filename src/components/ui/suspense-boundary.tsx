import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
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
