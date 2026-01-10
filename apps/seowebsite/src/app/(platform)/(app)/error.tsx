'use client';

import { useEffect } from 'react';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error boundary for protected app routes
 * 
 * Catches and displays errors that occur in the (app) route group
 * Provides recovery options for users
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('App route error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive mb-4">
            <AlertTriangle className="h-6 w-6" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
          <CardDescription>
            An error occurred while loading this page. This has been logged and we'll look into it.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="font-semibold text-destructive mb-2">Error Details:</p>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40">
                {error.message}
              </pre>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground">
            <p>Try refreshing the page or returning to the home page.</p>
            {error.digest && (
              <p className="mt-2">
                Error ID: <code className="bg-muted px-1 py-0.5 rounded text-xs">{error.digest}</code>
              </p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2 flex-wrap">
          <Button onClick={reset} variant="default" className="flex-1 sm:flex-none">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
