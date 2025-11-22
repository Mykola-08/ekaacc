'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

/**
 * Error boundary for journal routes
 */
export default function JournalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Journal error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-lg">Journal Error</CardTitle>
          </div>
          <CardDescription>
            We couldn't load your journal. Please try again.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-lg bg-muted p-3 text-xs">
              <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                {error.message}
              </pre>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button onClick={reset} size="sm" className="flex-1">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/home'}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
