import { useEffect, useCallback } from 'react';
import { BehavioralTrackingService, UserInteraction } from '@/services/behavioral-tracking-service';
import { useAuth } from '@/lib/platform/supabase-auth';

export interface UseBehavioralTrackingOptions {
  trackPageViews?: boolean;
  trackClicks?: boolean;
  trackFormSubmissions?: boolean;
  trackSessions?: boolean;
}

export const useBehavioralTracking = (options: UseBehavioralTrackingOptions = {}) => {
  const { user } = useAuth();
  const trackingService = BehavioralTrackingService.getInstance();

  const {
    trackPageViews = true,
    trackClicks = true,
    trackFormSubmissions = true,
    trackSessions = true
  } = options;

  // Define all tracking functions first
  // Track page view
  const trackPageView = useCallback((pagePath?: string, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'page_view',
      page_path: pagePath || window.location.pathname,
      metadata: {
        referrer: document.referrer,
        title: document.title,
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track button click
  const trackClick = useCallback((elementId: string, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'button_click',
      element_id: elementId,
      page_path: window.location.pathname,
      metadata: {
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track form submission
  const trackFormSubmission = useCallback((formId: string, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'form_submission',
      element_id: formId,
      page_path: window.location.pathname,
      metadata: {
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track session events
  const trackSessionStart = useCallback((metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'session_start',
      page_path: window.location.pathname,
      metadata: {
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        ...metadata
      }
    });
  }, [user, trackingService]);

  const trackSessionEnd = useCallback((metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'session_end',
      page_path: window.location.pathname,
      metadata: {
        sessionDuration: Date.now() - (window as any).__sessionStartTime,
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track mood logging
  const trackMoodLog = useCallback((mood: string, intensity?: number, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'mood_logged',
      page_path: window.location.pathname,
      metadata: {
        mood,
        intensity,
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track exercise completion
  const trackExerciseCompletion = useCallback((exerciseType: string, duration?: number, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'exercise_completed',
      page_path: window.location.pathname,
      metadata: {
        exerciseType,
        duration,
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track goal achievement
  const trackGoalAchievement = useCallback((goalId: string, goalTitle: string, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'exercise_completed',
      page_path: window.location.pathname,
      metadata: {
        goalId,
        goalTitle,
        achievementType: 'goal',
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track crisis interaction
  const trackCrisisInteraction = useCallback((crisisType: string, severity: 'low' | 'medium' | 'high', metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'crisis_interaction',
      page_path: window.location.pathname,
      metadata: {
        crisisType,
        severity,
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track appointment booking
  const trackAppointmentBooked = useCallback((appointmentId: string, therapistId: string, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'appointment_booked',
      page_path: window.location.pathname,
      metadata: {
        appointmentId,
        therapistId,
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Track message sent
  const trackMessageSent = useCallback((recipientId: string, messageType: string, metadata?: Record<string, any>) => {
    if (!user) return;

    trackingService.trackInteraction({
      user_id: user.id,
      interaction_type: 'message_sent',
      page_path: window.location.pathname,
      metadata: {
        recipientId,
        messageType,
        timestamp: Date.now(),
        ...metadata
      }
    });
  }, [user, trackingService]);

  // Auto-track events based on options
  useEffect(() => {
    if (!user) return () => {}; // Return cleanup function

    // Track session start
    if (trackSessions) {
      trackSessionStart();
      (window as any).__sessionStartTime = Date.now();

      // Track session end on page unload
      const handleBeforeUnload = () => {
        trackSessionEnd();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
    return () => {}; // Empty cleanup function
  }, [user, trackSessions, trackSessionStart, trackSessionEnd]);

  // Auto-track page views
  useEffect(() => {
    if (trackPageViews && user) {
      trackPageView();
    }
    return () => {}; // Empty cleanup function
  }, [user, trackPageViews, trackPageView]);

  // Auto-track clicks
  useEffect(() => {
    if (trackClicks && user) {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const trackableElement = target.closest('[data-track-click]') as HTMLElement;
        
        if (trackableElement) {
          const elementId = trackableElement.dataset.trackClick;
          const metadata = trackableElement.dataset.trackMetadata ? 
            JSON.parse(trackableElement.dataset.trackMetadata) : {};
          
          if (elementId) {
            trackClick(elementId, metadata);
          }
        }
      };

      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
    return () => {}; // Empty cleanup function
  }, [user, trackClicks, trackClick]);

  // Auto-track form submissions
  useEffect(() => {
    if (trackFormSubmissions && user) {
      const handleSubmit = (event: SubmitEvent) => {
        const target = event.target as HTMLFormElement;
        const trackableForm = target.closest('[data-track-form]') as HTMLFormElement;
        
        if (trackableForm) {
          const formId = trackableForm.dataset.trackForm;
          const metadata = trackableForm.dataset.trackMetadata ? 
            JSON.parse(trackableForm.dataset.trackMetadata) : {};
          
          if (formId) {
            trackFormSubmission(formId, metadata);
          }
        }
      };

      document.addEventListener('submit', handleSubmit);
      return () => document.removeEventListener('submit', handleSubmit);
    }
    return () => {}; // Empty cleanup function
  }, [user, trackFormSubmissions, trackFormSubmission]);

  return {
    trackPageView,
    trackClick,
    trackFormSubmission,
    trackSessionStart,
    trackSessionEnd,
    trackMoodLog,
    trackExerciseCompletion,
    trackGoalAchievement,
    trackCrisisInteraction,
    trackAppointmentBooked,
    trackMessageSent,
    trackingService
  };
};

export default useBehavioralTracking;