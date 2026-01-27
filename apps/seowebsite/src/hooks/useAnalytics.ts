 
import { useCallback } from 'react';
// import { supabase } from '@/lib/supabase-compat';
// import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export const useAnalytics = () => {
  // const { user } = useSupabaseAuth();
  const user = null;

  const logEvent = useCallback(async (
    interactionType: string,
    metadata: Record<string, any> = {},
    elementText?: string
  ) => {
    // Google Analytics Tracking
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', interactionType, {
        event_category: metadata.category || 'interaction',
        event_label: elementText || metadata.label,
        value: metadata.value,
        page_path: window.location.pathname,
        ...metadata
      });
    }

    /*
    try {
      await supabase.from('user_interactions').insert({
        interaction_type: interactionType,
        element_text: elementText,
        page_path: window.location.pathname,
        metadata: {
          ...metadata,
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenSize: `${window.screen.width}x${window.screen.height}`
        },
        user_id: user?.id || null,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging analytics event:', error);
    }
    */
  }, [user]);

  const logPageView = useCallback((path: string) => {
    logEvent('page_view', { path });
  }, [logEvent]);

  const logError = useCallback((error: string, context: Record<string, any> = {}) => {
    logEvent('error', { error, ...context });
  }, [logEvent]);

  return {
    logEvent,
    logPageView,
    logError
  };
};

