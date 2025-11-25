"use client";

import { useState, useEffect } from 'react';

export type ConsentStatus = 'undecided' | 'accepted' | 'denied';

export function useConsent() {
  const [status, setStatus] = useState<ConsentStatus>('undecided');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for GPC
    if (typeof navigator !== 'undefined' && (navigator as any).globalPrivacyControl) {
      setStatus('denied');
      localStorage.setItem('cookie-consent', 'denied');
      setIsLoading(false);
      return;
    }

    const stored = localStorage.getItem('cookie-consent');
    if (stored === 'accepted' || stored === 'denied') {
      setStatus(stored);
    }
    setIsLoading(false);
  }, []);

  const updateConsent = (newStatus: ConsentStatus) => {
    setStatus(newStatus);
    localStorage.setItem('cookie-consent', newStatus);
  };

  return {
    status,
    isLoading,
    accept: () => updateConsent('accepted'),
    deny: () => updateConsent('denied'),
  };
}
