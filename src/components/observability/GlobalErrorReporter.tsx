'use client';

import { useEffect } from 'react';
import { sendClientErrorReport } from '@/lib/observability/client-error-reporting';

export function GlobalErrorReporter() {
  useEffect(() => {
    const isAbortError = (err: unknown): boolean =>
      err instanceof DOMException && err.name === 'AbortError';

    const onWindowError = (event: ErrorEvent) => {
      // Ignore AbortError caused by React strict-mode double-mount or navigation
      if (isAbortError(event.error)) return;

      const message = event.message || 'Unhandled window error';
      const stack =
        event.error instanceof Error
          ? event.error.stack
          : `${event.filename}:${event.lineno}:${event.colno}`;

      void sendClientErrorReport({
        message,
        stack,
        level: 'error',
        context: {
          source: 'window.onerror',
        },
      });
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      // Ignore AbortError caused by React strict-mode double-mount or navigation
      if (isAbortError(reason)) return;

      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === 'string'
            ? reason
            : 'Unhandled promise rejection';
      const stack = reason instanceof Error ? reason.stack : undefined;

      void sendClientErrorReport({
        message,
        stack,
        level: 'fatal',
        context: {
          source: 'window.unhandledrejection',
        },
        additionalData: {
          reason:
            reason instanceof Error
              ? { name: reason.name, message: reason.message }
              : String(reason),
        },
      });
    };

    window.addEventListener('error', onWindowError);
    window.addEventListener('unhandledrejection', onUnhandledRejection);

    return () => {
      window.removeEventListener('error', onWindowError);
      window.removeEventListener('unhandledrejection', onUnhandledRejection);
    };
  }, []);

  return null;
}
