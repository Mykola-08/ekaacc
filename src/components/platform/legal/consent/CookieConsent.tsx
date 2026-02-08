'use client';

import React, { useState, useEffect } from 'react';
import { useConsent, ConsentPreferences } from '@/hooks/platform/legal/useConsent';
import { X, Shield, Cookie, Info } from 'lucide-react';
import Link from 'next/link';

export default function CookieConsent() {
  const { status, preferences, isLoading, saveConsent } = useConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<ConsentPreferences>(preferences);
  const [isReopenVisible, setIsReopenVisible] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (status === 'undecided') {
        setIsVisible(true);
        setIsReopenVisible(false);
      } else {
        setIsVisible(false);
        setIsReopenVisible(true);
      }
    }
  }, [isLoading, status]);

  // Listen for custom event to open settings
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsVisible(true);
      setIsReopenVisible(false);
      setShowDetails(true); // Open directly to details view
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  // Update temp preferences when loaded
  useEffect(() => {
    setTempPreferences(preferences);
  }, [preferences]);

  const handleAcceptAll = () => {
    const allGranted: ConsentPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    saveConsent('granted', allGranted);
    setIsVisible(false);
    setIsReopenVisible(true);
  };

  const handleRejectAll = () => {
    const allDenied: ConsentPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    saveConsent('denied', allDenied);
    setIsVisible(false);
    setIsReopenVisible(true);
  };

  const handleSavePreferences = () => {
    // Determine status based on preferences
    const isPartial =
      !tempPreferences.analytics || !tempPreferences.marketing || !tempPreferences.functional;
    const newStatus = isPartial ? 'partial' : 'granted';

    saveConsent(newStatus, tempPreferences);
    setIsVisible(false);
    setIsReopenVisible(true);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    setTempPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (isLoading) return null;

  if (!isVisible && isReopenVisible) {
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          setIsReopenVisible(false);
        }}
        className="bg-card border-border hover:bg-muted/30 group fixed bottom-4 left-4 z-50 rounded-full border p-3 shadow-lg transition-all"
        title="Cookie Settings"
      >
        <Shield className="text-primary h-6 w-6 transition-transform group-hover:scale-110" />
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="bg-card border-border animate-in slide-in-from-bottom fixed right-0 bottom-0 left-0 z-50 border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] duration-500 md:p-6">
      <div className="mx-auto max-w-7xl">
        {!showDetails ? (
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <Cookie className="text-primary h-5 w-5" />
                <h3 className="text-foreground text-lg font-semibold">We value your privacy</h3>
              </div>
              <p className="text-muted-foreground max-w-3xl text-sm">
                We use cookies to enhance your browsing experience, serve personalized ads or
                content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to
                our use of cookies. Read our{' '}
                <Link href="/legal/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>{' '}
                and{' '}
                <Link href="/legal/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
              <p className="text-muted-foreground mt-2 max-w-3xl text-xs italic">
                Compliance Notice: We have implemented comprehensive measures to align with CCPA,
                GDPR, ISO 27001, SOC 2, and HIPAA standards. However, compliance is an ongoing
                process, and we cannot guarantee absolute adherence at all times. We are dedicated
                to maintaining the highest standards of data privacy and security.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <button
                onClick={() => setShowDetails(true)}
                className="text-foreground/90 bg-card hover:bg-muted/30 focus:ring-primary rounded-md border border-gray-300 px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Customize
              </button>
              <button
                onClick={handleRejectAll}
                className="text-foreground/90 bg-card hover:bg-muted/30 focus:ring-primary rounded-md border border-gray-300 px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Reject All
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-primary hover:bg-primary/90 focus:ring-primary rounded-md px-4 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Shield className="text-primary h-5 w-5" />
                <h3 className="text-foreground text-lg font-semibold">Cookie Preferences</h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground/80 hover:text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Essential */}
              <div className="bg-muted/30 rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Essential</span>
                    <div className="group relative">
                      <Info className="text-muted-foreground/80 h-4 w-4 cursor-help" />
                      <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden w-48 -translate-x-1/2 rounded bg-gray-900 p-2 text-xs text-white group-hover:block">
                        Necessary for the website to function. Cannot be disabled.
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="text-primary h-4 w-4 cursor-not-allowed rounded border-gray-300 opacity-50"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Required for basic site functionality like security, network management, and
                  accessibility.
                </p>
              </div>

              {/* Analytics */}
              <div className="hover:border-primary/50 rounded-lg border p-4 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Analytics</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempPreferences.analytics}
                    onChange={() => togglePreference('analytics')}
                    className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Help us understand how visitors interact with the website by collecting and
                  reporting information anonymously.
                </p>
              </div>

              {/* Marketing */}
              <div className="hover:border-primary/50 rounded-lg border p-4 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Marketing</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempPreferences.marketing}
                    onChange={() => togglePreference('marketing')}
                    className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Used to track visitors across websites to display ads that are relevant and
                  engaging for the individual user.
                </p>
              </div>

              {/* Functional */}
              <div className="hover:border-primary/50 rounded-lg border p-4 transition-colors">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-medium">Functional</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempPreferences.functional}
                    onChange={() => togglePreference('functional')}
                    className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Enable the website to provide enhanced functionality and personalization, such as
                  live chats and videos.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => setShowDetails(false)}
                className="text-foreground/90 bg-card hover:bg-muted/30 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium"
              >
                Back
              </button>
              <button
                onClick={handleSavePreferences}
                className="bg-primary hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium text-white"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
