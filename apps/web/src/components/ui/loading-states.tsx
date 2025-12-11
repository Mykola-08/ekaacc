'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

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
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function LoadingSkeleton({ className, lines = 3, height = 'h-4' }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('bg-muted rounded', height)}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

interface CardSkeletonProps {
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function CardSkeleton({ className, showHeader = true, showFooter = true }: CardSkeletonProps) {
  return (
    <Card className={cn('animate-pulse', className)}>
      {showHeader && (
        <CardHeader>
          <div className="h-6 bg-muted rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </CardHeader>
      )}
      <CardContent>
        <LoadingSkeleton lines={4} />
      </CardContent>
      {showFooter && (
        <CardFooter>
          <div className="h-10 bg-muted rounded w-24" />
        </CardFooter>
      )}
    </Card>
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
  className
}: ErrorStateProps) {
  return (
    <Card className={cn('max-w-lg w-full', className)}>
      <CardHeader>
        <div className="flex items-center gap-2 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>

      {error && process.env.NODE_ENV === 'development' && (
        <CardContent>
          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-semibold text-destructive mb-2">Error Details:</p>
            <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40">
              {error.toString()}
            </pre>
            {error.stack && (
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40 mt-2 text-muted-foreground">
                {error.stack}
              </pre>
            )}
          </div>
        </CardContent>
      )}

      <CardFooter className="flex gap-2 flex-wrap">
        {onRetry && (
          <Button onClick={onRetry} variant="default" className="flex-1 sm:flex-none">
            <RefreshCw className="mr-2 h-4 w-4" />
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
      <div className={cn('flex items-center justify-center min-h-[200px]', className)}>
        <LoadingSpinner message={loadingMessage} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={cn('flex items-center justify-center min-h-[200px]', className)}>
        <ErrorState
          title={errorTitle}
          message={errorMessage}
          error={error}
          onRetry={onRetry}
        />
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
    return errorComponent || (
      <LoadingContainer
        isLoading={false}
        isError={true}
        error={error}
        onRetry={onRetry}
      />
    );
  }

  return <>{children(data)}</>;
}

// Specialized loading components for different content types
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-2 pb-2 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2 py-2">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 bg-muted rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-10 bg-muted rounded" />
        </div>
      ))}
      <div className="h-10 bg-muted rounded w-24" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 bg-muted rounded w-32" />
      <div className="h-64 bg-muted rounded" />
    </div>
  );
}