'use client';

import { cn } from '@/lib/utils';

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  headerExtra?: React.ReactNode;
}

export function PageContainer({
  title,
  description,
  headerExtra,
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {(title || description) && (
        <div className="space-y-1 border-b pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
            {headerExtra}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}