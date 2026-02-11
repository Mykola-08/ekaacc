'use client';

import React, { useState, useEffect } from 'react';
import { useConsent, ConsentPreferences } from '@/hooks/platform/useConsent';
import { useLanguage } from '@/context/LanguageContext';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Shield01Icon, CookieIcon, Information } from '@hugeicons/core-free-icons';
import Link from 'next/link';

export default function CookieConsent() {
  const { status, preferences, isLoading, saveConsent } = useConsent();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<ConsentPreferences>(preferences);

  useEffect(() => {
    if (!isLoading && status === 'undecided') {
      setIsVisible(true);
    }
  }, [isLoading, status]);

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
  };

  const handleSavePreferences = () => {
    // Determine status based on preferences
    const isPartial =
      !tempPreferences.analytics || !tempPreferences.marketing || !tempPreferences.functional;
    const newStatus = isPartial ? 'partial' : 'granted';

    saveConsent(newStatus, tempPreferences);
    setIsVisible(false);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    setTempPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="bg-card/95 border-border animate-in slide-in-from-bottom-8 fixed right-6 bottom-6 left-6 z-50 rounded-lg border p-6 shadow-sm backdrop-blur-md duration-700 ease-out md:p-8">
      <div className="mx-auto max-w-7xl">
        {!showDetails ? (
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-3">
                <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
                  <HugeiconsIcon icon={CookieIcon} className="text-primary h-5 w-5" />
                </div>
                <h3 className="text-foreground text-xl font-semibold tracking-tight">
                  {t('cookie.title')}
                </h3>
              </div>
              <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed">
                {t('cookie.intro')}{' '}
                <Link href="/legal/privacy" className="text-primary font-semibold hover:underline">
                  {t('cookie.privacy')}
                </Link>{' '}
                {t('cookie.and')}{' '}
                <Link href="/legal/cookies" className="text-primary font-semibold hover:underline">
                  {t('cookie.cookies')}
                </Link>
                .
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
              <button
                onClick={() => setShowDetails(true)}
                className="text-foreground/90 bg-secondary border-border hover:bg-muted/50 rounded-full border px-6 py-3 text-sm font-semibold transition-all"
              >
                {t('cookie.customize')}
              </button>
              <button
                onClick={handleRejectAll}
                className="text-foreground/90 bg-secondary border-border hover:bg-muted/50 rounded-full border px-6 py-3 text-sm font-semibold transition-all"
              >
                {t('cookie.rejectAll')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="bg-primary hover:bg-primary/90 shadow-primary/20 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all"
              >
                {t('cookie.acceptAll')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-border flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={Shield01Icon} className="text-primary h-5 w-5" />
                <h3 className="text-foreground text-xl font-semibold tracking-tight">
                  {t('cookie.details.title')}
                </h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground/80 hover:text-foreground hover:bg-secondary flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                aria-label="Close"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Essential */}
              <div className="border-border bg-secondary/30 rounded-3xl border p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">{t('cookie.type.essential')}</span>
                    <div className="group relative">
                      <HugeiconsIcon
                        icon={Information}
                        className="text-muted-foreground/80 h-4 w-4 cursor-help"
                      />
                      <div className="bg-foreground text-background absolute bottom-full left-1/2 z-20 mb-3 hidden w-64 -translate-x-1/2 rounded-lg p-3 text-xs shadow-sm group-hover:block">
                        {t('cookie.type.essentialDesc')}
                      </div>
                    </div>
                  </div>
                  <div className="border-primary/30 bg-primary/10 flex h-5 w-5 items-center justify-center rounded-full border-2">
                    <div className="bg-primary h-2.5 w-2.5 rounded-full" />
                  </div>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t('cookie.details.description')}
                </p>
              </div>

              {/* Analytics */}
              <div className="border-border hover:border-primary/50 bg-card rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">{t('cookie.type.analytics')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempPreferences.analytics}
                    onChange={() => togglePreference('analytics')}
                    className="text-primary border-border focus:ring-primary accent-primary h-5 w-5 cursor-pointer rounded-full"
                  />
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t('cookie.type.analyticsDesc')}
                </p>
              </div>

              {/* Marketing */}
              <div className="border-border hover:border-primary/50 bg-card rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">{t('cookie.type.marketing')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempPreferences.marketing}
                    onChange={() => togglePreference('marketing')}
                    className="text-primary border-border focus:ring-primary accent-primary h-5 w-5 cursor-pointer rounded-full"
                  />
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t('cookie.type.marketingDesc')}
                </p>
              </div>

              {/* Functional */}
              <div className="border-border hover:border-primary/50 bg-card rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold">{t('cookie.type.functional')}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={tempPreferences.functional}
                    onChange={() => togglePreference('functional')}
                    className="text-primary border-border focus:ring-primary accent-primary h-5 w-5 cursor-pointer rounded-full"
                  />
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t('cookie.type.functionalDesc')}
                </p>
              </div>
            </div>

            <div className="border-border flex justify-end gap-3 border-t pt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="text-foreground/90 bg-secondary border-border hover:bg-muted/50 rounded-full border px-6 py-3 text-sm font-semibold transition-all"
              >
                {t('cookie.back')}
              </button>
              <button
                onClick={handleSavePreferences}
                className="bg-primary hover:bg-primary/90 shadow-primary/20 rounded-full px-8 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all"
              >
                {t('cookie.saveParams')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
