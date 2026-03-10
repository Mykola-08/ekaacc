import { useCallback } from 'react';

export const useAnalytics = () => {
  const logEvent = useCallback(async (
    interactionType: string,
    metadata: Record<string, string | number | boolean | undefined> = {},
    elementText?: string
  ) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', interactionType, {
        event_category: metadata.category || 'interaction',
        event_label: elementText || metadata.label,
        value: metadata.value,
        page_path: window.location.pathname,
        ...metadata
      });
    }
  }, []);

  const logPageView = useCallback((path: string) => {
    logEvent('page_view', { path });
  }, [logEvent]);

  const logError = useCallback((error: string, context: Record<string, string | number | boolean | undefined> = {}) => {
    logEvent('error', { error, ...context });
  }, [logEvent]);

  return {
    logEvent,
    logPageView,
    logError
  };
};

