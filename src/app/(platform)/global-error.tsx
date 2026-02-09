'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { sendClientErrorReport } from '@/lib/observability/client-error-reporting';
// import { PageContainer } from '@/components/platform/eka/page-container';
// import { SurfacePanel } from '@/components/platform/eka/surface-panel';

const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`container mx-auto p-4 md:p-8 ${className || ''}`}>{children}</div>;

const SurfacePanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-card text-card-foreground rounded-xl border shadow-sm ${className || ''}`}>
    {children}
  </div>
);

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
    console.error('Global error occurred:', error);

    void sendClientErrorReport({
      message: error.message || error.toString(),
      stack: error.stack,
      digest: error.digest,
      level: 'fatal',
      context: {
        source: 'next.global-error',
      },
    });
  }, [error]);

  return (
    <html>
      <body>
        <PageContainer>
          <SurfacePanel className="flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="text-destructive mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <CardTitle>Application Error</CardTitle>
                </div>
                <CardDescription>
                  Something went wrong with the application. We apologize for the inconvenience.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && (
                  <div className="bg-muted rounded-xl p-4 text-sm">
                    <p className="text-destructive mb-2 font-semibold">Error Details:</p>
                    <pre className="max-h-40 overflow-auto text-xs whitespace-pre-wrap">
                      {error.toString()}
                    </pre>
                    {error.stack && (
                      <pre className="text-muted-foreground mt-2 max-h-40 overflow-auto text-xs whitespace-pre-wrap">
                        {error.stack}
                      </pre>
                    )}
                    {error.digest && (
                      <p className="text-muted-foreground mt-2 text-xs">Error ID: {error.digest}</p>
                    )}
                  </div>
                )}

                <div className="text-muted-foreground text-sm">
                  <p>This error has been logged and our team will investigate.</p>
                  <p className="mt-2">If this problem persists, please contact support.</p>
                  {error.digest && (
                    <p className="mt-2">
                      Reference code:{' '}
                      <code className="bg-muted rounded px-1 py-0.5 text-xs">{error.digest}</code>
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2">
                <Button onClick={reset} variant="default" className="flex-1 sm:flex-none">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = '/')}
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
