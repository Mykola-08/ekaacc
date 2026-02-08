import { ErrorInfo } from 'react';
import { sendClientErrorReport } from '@/lib/observability/client-error-reporting';

export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    void sendClientErrorReport({
      message: error.message || error.toString(),
      stack: error.stack ?? errorInfo?.componentStack,
      level: 'error',
      context: {
        source: 'hook.useErrorHandler',
      },
      additionalData: {
        componentStack: errorInfo?.componentStack,
      },
    });
  };
}
