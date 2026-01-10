'use client';

import { useEffect } from 'react';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { PageContainer } from '@/components/platform/eka/page-container';
import { SurfacePanel } from '@/components/platform/eka/surface-panel';

/**
 * Global Error Page
 * 
 * This page is shown when an unhandled error occurs in the app
 * Provides user-friendly error message and recovery options
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console
    console.error('Global error occurred:', error);

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Sentry
      // Sentry.captureException(error);
      
      // Send to server-side logging
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: error.toString(),
          errorInfo: error.stack,
          digest: error.digest,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      }).catch(console.error);
    }
  }, [error]);

  return (
    <html>
      <body>
        <PageContainer>
          <SurfacePanel className="flex items-center justify-center p-4">
            <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-4">
                <AlertTriangle className="h-6 w-6" />
                <CardTitle>Application Error</CardTitle>
              </div>
              <CardDescription>
                Something went wrong with the application. We apologize for the inconvenience.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && (
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
                  {error.digest && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
              
              <div className="text-sm text-muted-foreground">
                <p>This error has been logged and our team will investigate.</p>
                <p className="mt-2">
                  If this problem persists, please contact support.
                </p>
                {error.digest && (
                  <p className="mt-2">
                    Reference code:{' '}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      {error.digest}
                    </code>
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
          </SurfacePanel>
        </PageContainer>
      </body>
    </html>
  );
}
