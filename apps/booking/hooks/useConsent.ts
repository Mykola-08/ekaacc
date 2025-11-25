import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

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
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rbnfyxhewsivofvwdpuk.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJibmZ5eGhld3Npdm9mdndkcHVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMwNTYzNDQsImV4cCI6MjA3ODYzMjM0NH0.beEFcpqzV7obLX0McrR-lK7V37RE0RbRTpVEKcub_Ko'
  );

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
        setIsLoading(false);
        return;
      } else {
        // Check for Global Privacy Control (GPC)
        // @ts-ignore
        if (typeof navigator !== 'undefined' && navigator.globalPrivacyControl) {
          console.log('Global Privacy Control (GPC) signal detected.');
          const gpcPreferences = { ...DEFAULT_PREFERENCES };
          setStatus('denied');
          setPreferences(gpcPreferences);
        }
      }

      // 2. If not in local storage, check DB if user is logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
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
          // Sync back to local storage
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

      // 2. Save to DB if logged in
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('user_consents').insert({
          user_id: session.user.id,
          consent_type: 'cookies',
          status: newStatus,
          preferences: newPreferences,
          user_agent: navigator.userAgent,
          version: '1.0'
        });
      }
    } catch (error) {
      console.error('Error saving consent:', error);
    }
  };

  const acceptAll = () => {
    const allGranted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    saveConsent('granted', allGranted);
  };

  const denyAll = () => {
    const allDenied: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    saveConsent('denied', allDenied);
  };

  const savePreferences = (newPreferences: ConsentPreferences) => {
    // Determine status based on preferences
    const isAllGranted = Object.values(newPreferences).every(v => v);
    const isAllDenied = !newPreferences.analytics && !newPreferences.marketing && !newPreferences.functional;
    
    let newStatus: ConsentStatus = 'partial';
    if (isAllGranted) newStatus = 'granted';
    if (isAllDenied) newStatus = 'denied';

    saveConsent(newStatus, newPreferences);
  };

  return {
    status,
    preferences,
    isLoading,
    acceptAll,
    denyAll,
    savePreferences,
  };
}
