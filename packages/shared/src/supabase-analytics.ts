import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Analytics Integration
 * Track user events, page views, and custom analytics
 */

export interface AnalyticsEvent {
  event_name: string;
  event_data?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  page_url?: string;
  referrer?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface PageView {
  page_url: string;
  page_title?: string;
  user_id?: string;
  session_id?: string;
  referrer?: string;
  duration_ms?: number;
}

/**
 * Track a custom analytics event
 */
export async function trackEvent(
  supabase: SupabaseClient,
  event: AnalyticsEvent
): Promise<void> {
  try {
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_name: event.event_name,
        event_data: event.event_data || {},
        user_id: event.user_id,
        session_id: event.session_id,
        page_url: event.page_url,
        referrer: event.referrer,
        user_agent: event.user_agent,
        ip_address: event.ip_address,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[Analytics] Failed to track event:', error);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
  }
}

/**
 * Track a page view
 */
export async function trackPageView(
  supabase: SupabaseClient,
  pageView: PageView
): Promise<void> {
  try {
    const { error } = await supabase
      .from('analytics_page_views')
      .insert({
        page_url: pageView.page_url,
        page_title: pageView.page_title,
        user_id: pageView.user_id,
        session_id: pageView.session_id,
        referrer: pageView.referrer,
        duration_ms: pageView.duration_ms,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[Analytics] Failed to track page view:', error);
    }
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
  }
}

/**
 * Track user session start
 */
export async function trackSessionStart(
  supabase: SupabaseClient,
  sessionId: string,
  userId?: string
): Promise<void> {
  await trackEvent(supabase, {
    event_name: 'session_start',
    session_id: sessionId,
    user_id: userId,
    event_data: {
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Track user session end
 */
export async function trackSessionEnd(
  supabase: SupabaseClient,
  sessionId: string,
  userId?: string,
  durationMs?: number
): Promise<void> {
  await trackEvent(supabase, {
    event_name: 'session_end',
    session_id: sessionId,
    user_id: userId,
    event_data: {
      timestamp: new Date().toISOString(),
      duration_ms: durationMs,
    },
  });
}

/**
 * Track button click
 */
export async function trackButtonClick(
  supabase: SupabaseClient,
  buttonId: string,
  userId?: string,
  additionalData?: Record<string, any>
): Promise<void> {
  await trackEvent(supabase, {
    event_name: 'button_click',
    user_id: userId,
    event_data: {
      button_id: buttonId,
      ...additionalData,
    },
  });
}

/**
 * Track form submission
 */
export async function trackFormSubmit(
  supabase: SupabaseClient,
  formId: string,
  userId?: string,
  formData?: Record<string, any>
): Promise<void> {
  await trackEvent(supabase, {
    event_name: 'form_submit',
    user_id: userId,
    event_data: {
      form_id: formId,
      ...formData,
    },
  });
}

/**
 * Track error occurrence
 */
export async function trackError(
  supabase: SupabaseClient,
  error: Error,
  context?: Record<string, any>
): Promise<void> {
  await trackEvent(supabase, {
    event_name: 'error',
    event_data: {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    },
  });
}

/**
 * Track feature usage
 */
export async function trackFeatureUsage(
  supabase: SupabaseClient,
  featureName: string,
  userId?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await trackEvent(supabase, {
    event_name: 'feature_used',
    user_id: userId,
    event_data: {
      feature_name: featureName,
      ...metadata,
    },
  });
}

/**
 * Get analytics summary for a user
 */
export async function getUserAnalyticsSummary(
  supabase: SupabaseClient,
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<any> {
  try {
    let query = supabase
      .from('analytics_events')
      .select('event_name, event_data, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }

    const { data, error } = await query.limit(1000);

    if (error) {
      console.error('[Analytics] Failed to get summary:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[Analytics] Error getting summary:', error);
    return null;
  }
}

/**
 * Get popular pages
 */
export async function getPopularPages(
  supabase: SupabaseClient,
  limit: number = 10
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .rpc('get_popular_pages', { limit_count: limit });

    if (error) {
      console.error('[Analytics] Failed to get popular pages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('[Analytics] Error getting popular pages:', error);
    return [];
  }
}
