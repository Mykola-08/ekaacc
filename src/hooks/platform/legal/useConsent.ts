import { useState, useEffect } from 'react';
import { createClient } from "@/lib/platform/legal/supabase";

export type ConsentPreferences = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

export type ConsentStatus = 'granted' | 'denied' | 'partial' | 'undecided';

const DEFAULT_PREFERENCES: ConsentPreferences = {
  essential: true, // Always true
  analytics: false,
  marketing: false,
  functional: false,
};

export function useConsent() {
  const [status, setStatus] = useState<ConsentStatus>('undecided');
  const [preferences, setPreferences] = useState<ConsentPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      // 1. Check Local Storage first (fastest)
      const storedConsent = localStorage.getItem('eka_consent_status');
      const storedPreferences = localStorage.getItem('eka_consent_preferences');

      if (storedConsent && storedPreferences) {
        setStatus(storedConsent as ConsentStatus);
        setPreferences(JSON.parse(storedPreferences));
      } else {
        // Check for Global Privacy Control (GPC)
        if (typeof navigator !== 'undefined' && (navigator as any).globalPrivacyControl) {
          console.log('Global Privacy Control (GPC) signal detected.');
          const gpcPreferences = { ...DEFAULT_PREFERENCES };
          // GPC primarily signals "Do Not Sell", which maps to denying marketing/analytics
          setStatus('denied');
          setPreferences(gpcPreferences);
          // We don't auto-save to DB to avoid creating records without explicit interaction,
          // but we respect the signal for the session.
        }
      }

      // 2. Check Supabase (if logged in)
      const { data: { session } } = await (supabase.auth as any).getSession();
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('user_consents')
          .select('status, preferences')
          .eq('user_id', session.user.id)
          .eq('consent_type', 'cookies')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data && !error) {
          setStatus(data.status as ConsentStatus);
          setPreferences(data.preferences as ConsentPreferences);
          
          // Sync back to local storage to keep them in sync
          localStorage.setItem('eka_consent_status', data.status);
          localStorage.setItem('eka_consent_preferences', JSON.stringify(data.preferences));
        }
      }
    } catch (error) {
      console.error('Error checking consent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConsent = async (newStatus: ConsentStatus, newPreferences: ConsentPreferences) => {
    try {
      // 1. Save to Local Storage
      localStorage.setItem('eka_consent_status', newStatus);
      localStorage.setItem('eka_consent_preferences', JSON.stringify(newPreferences));
      
      setStatus(newStatus);
      setPreferences(newPreferences);

      // 2. Save to Supabase (if logged in)
      const { data: { session } } = await (supabase.auth as any).getSession();
      
      if (session?.user) {
        const { error } = await supabase
          .from('user_consents')
          .insert({
            user_id: session.user.id,
            consent_type: 'cookies',
            status: newStatus,
            preferences: newPreferences,
            user_agent: navigator.userAgent,
            version: '1.0' // Could be dynamic
          });

        if (error) {
          console.error('Error saving consent to DB:', error);
        }
      }

      // Apply consent (e.g., enable/disable scripts)
      if (newPreferences.analytics) {
        console.log('Analytics enabled');
      }
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  return {
    status,
    preferences,
    isLoading,
    saveConsent,
    checkConsent
  };
}
