'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * Error boundary for admin routes
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-lg">Admin Panel Error</CardTitle>
          </div>
          <CardDescription>
            An error occurred in the admin panel.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-lg bg-muted p-3 text-xs">
              <p className="font-semibold mb-1">Error Details:</p>
              <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                {error.message}
              </pre>
            </div>
          )}
          
          <p className="text-sm text-muted-foreground">
            This issue has been logged. Please try refreshing or contact support if it persists.
          </p>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button onClick={reset} size="sm" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
          <Button
            onClick={() => window.location.href = '/home'}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
