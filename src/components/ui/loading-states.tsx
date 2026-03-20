'use client';

import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, Alert02Icon, ArrowTurnBackwardIcon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export function LoadingSpinner({ size = 'md', className, message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <HugeiconsIcon
        icon={Loading03Icon}
        role="status"
        className={cn('text-primary animate-spin', sizeClasses[size])}
      />
      {message && <p className="text-muted-foreground animate-pulse text-sm">{message}</p>}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  error,
  onRetry,
  onGoHome,
  className,
}: ErrorStateProps) {
  return (
    <Card className={cn('w-full max-w-lg', className)}>
      <CardHeader>
        <div className="text-destructive mb-4 flex items-center gap-2">
          <HugeiconsIcon icon={Alert02Icon} className="h-6 w-6" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>

      {error && process.env.NODE_ENV === 'development' && (
        <CardContent>
          <div className="bg-muted rounded-[calc(var(--radius)*0.8)] p-4 text-sm">
            <p className="text-destructive mb-2 font-semibold">Error Details:</p>
            <pre className="max-h-40 overflow-auto text-xs whitespace-pre-wrap">
              {error.message}
            </pre>
            {error.stack && (
              <pre className="text-muted-foreground mt-2 max-h-40 overflow-auto text-xs whitespace-pre-wrap">
                {error.stack}
              </pre>
            )}
          </div>
        </CardContent>
      )}

      <CardFooter className="flex flex-wrap gap-2">
        {onRetry && (
          <Button onClick={onRetry} variant="default" className="flex-1 sm:flex-none">
            <HugeiconsIcon icon={ArrowTurnBackwardIcon} className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button onClick={onGoHome} variant="outline" className="flex-1 sm:flex-none">
            Go Home
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface LoadingContainerProps {
  isLoading: boolean;
  isError?: boolean;
  error?: Error;
  onRetry?: () => void;
  loadingMessage?: string;
  errorTitle?: string;
  errorMessage?: string;
  children?: React.ReactNode;
  className?: string;
}

export function LoadingContainer({
  isLoading,
  isError = false,
  error,
  onRetry,
  loadingMessage = 'Loading...',
  errorTitle,
  errorMessage,
  children,
  className,
}: LoadingContainerProps) {
  if (isLoading) {
    return (
      <div className={cn('flex min-h-50 items-center justify-center', className)}>
        <LoadingSpinner message={loadingMessage} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex min-h-50 items-center justify-center', className)}>
        <ErrorState title={errorTitle} message={errorMessage} error={error} onRetry={onRetry} />
      </div>
    );
  }

  return <>{children}</>;
}

interface AsyncContentProps {
  data: any;
  isLoading: boolean;
  isError?: boolean;
  error?: Error;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  children: (data: any) => React.ReactNode;
}

export function AsyncContent({
  data,
  isLoading,
  isError = false,
  error,
  onRetry,
  loadingComponent,
  errorComponent,
  children,
}: AsyncContentProps) {
  if (isLoading) {
    return (loadingComponent as React.ReactElement) || <LoadingContainer isLoading={true} />;
  }

  if (isError) {
    return (
      errorComponent || (
        <LoadingContainer isLoading={false} isError={true} error={error} onRetry={onRetry} />
      )
    );
  }

  return <>{children(data)}</>;
}

// Specialized loading components for different content types
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div data-testid="table-skeleton" className="">
      {/* Header */}
      <div className="flex gap-2 border-b pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <span key={i} className="bg-muted h-4 flex-1 rounded" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2 py-2">
          {Array.from({ length: columns }).map((_, j) => (
            <span key={j} className="bg-muted h-4 flex-1 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div data-testid="form-skeleton" className="">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="">
          <span className="bg-muted block h-4 w-24 rounded" />
          <span className="bg-muted block h-10 rounded" />
        </div>
      ))}
      <div className="bg-muted h-10 w-24 rounded" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div data-testid="chart-skeleton" className="">
      <div className="bg-muted h-6 w-32 rounded" />
      <div className="bg-muted h-64 rounded" />
    </div>
  );
}
