'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/loading-states';
import { sendClientErrorReport } from '@/lib/observability/client-error-reporting';

/**
 * Error boundary for all dashboard pages.
 * Catches runtime errors in any page under (dashboard)/ and shows a recovery UI.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report to observability
    sendClientErrorReport({
      message: error.message || error.toString(),
      stack: error.stack,
      digest: error.digest,
      level: 'error',
      context: {
        source: 'dashboard-error-boundary',
      },
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <ErrorState
        title="Dashboard Error"
        message="Something went wrong loading this page. Your data is safe — please try again."
        error={error}
        onRetry={reset}
        onGoHome={() => (window.location.href = '/dashboard')}
      />
    </div>
  );
}
