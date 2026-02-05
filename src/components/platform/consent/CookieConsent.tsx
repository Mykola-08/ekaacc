"use client";

import React, { useState, useEffect } from 'react';
import { useConsent, ConsentPreferences } from '@/hooks/platform/useConsent';
import { useLanguage } from '@/context/LanguageContext';
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Shield01Icon, CookieIcon, Information01Icon } from "@hugeicons/core-free-icons";
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
    const isPartial = !tempPreferences.analytics || !tempPreferences.marketing || !tempPreferences.functional;
    const newStatus = isPartial ? 'partial' : 'granted';
    
    saveConsent(newStatus, tempPreferences);
    setIsVisible(false);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === 'essential') return; // Cannot toggle essential
    setTempPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 p-6 md:p-8 bg-card/95 backdrop-blur-md border border-border shadow-2xl rounded-[32px] animate-in slide-in-from-bottom-8 duration-700 ease-out">
      <div className="max-w-7xl mx-auto">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <HugeiconsIcon icon={CookieIcon} className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-foreground">{t('cookie.title')}</h3>
              </div>
              <p className="text-[15px] leading-relaxed text-muted-foreground max-w-3xl">
                {t('cookie.intro')} <Link href="/legal/privacy" className="text-primary font-bold hover:underline">{t('cookie.privacy')}</Link> {t('cookie.and')} <Link href="/legal/cookies" className="text-primary font-bold hover:underline">{t('cookie.cookies')}</Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowDetails(true)}
                className="px-6 py-3 text-sm font-bold text-foreground/90 bg-secondary border border-border rounded-full hover:bg-muted/50 transition-all"
              >
                {t('cookie.customize')}
              </button>
              <button
                onClick={handleRejectAll}
                className="px-6 py-3 text-sm font-bold text-foreground/90 bg-secondary border border-border rounded-full hover:bg-muted/50 transition-all font-bold"
              >
                {t('cookie.rejectAll')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-6 py-3 text-sm font-bold text-white bg-primary rounded-full hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
              >
                {t('cookie.acceptAll')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <HugeiconsIcon icon={Shield01Icon} className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold tracking-tight text-foreground">{t('cookie.details.title')}</h3>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground/80 hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Essential */}
              <div className="p-6 border border-border rounded-[24px] bg-secondary/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{t('cookie.type.essential')}</span>
                    <div className="group relative">
                      <HugeiconsIcon icon={Information01Icon} className="w-4 h-4 text-muted-foreground/80 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-foreground text-background text-xs rounded-2xl hidden group-hover:block z-20 shadow-xl">
                        {t('cookie.type.essentialDesc')}
                      </div>
                    </div>
                  </div>
                  <div className="h-5 w-5 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary/10">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t('cookie.details.description')}</p>
              </div>

              {/* Analytics */}
              <div className="p-6 border border-border rounded-[24px] hover:border-primary/50 transition-all bg-card shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{t('cookie.type.analytics')}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={tempPreferences.analytics} 
                    onChange={() => togglePreference('analytics')}
                    className="h-5 w-5 text-primary border-border rounded-full focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{t('cookie.type.analyticsDesc')}</p>
              </div>

              {/* Marketing */}
              <div className="p-6 border border-border rounded-[24px] hover:border-primary/50 transition-all bg-card shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{t('cookie.type.marketing')}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={tempPreferences.marketing} 
                    onChange={() => togglePreference('marketing')}
                    className="h-5 w-5 text-primary border-border rounded-full focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{t('cookie.type.marketingDesc')}</p>
              </div>

              {/* Functional */}
              <div className="p-6 border border-border rounded-[24px] hover:border-primary/50 transition-all bg-card shadow-sm hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{t('cookie.type.functional')}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={tempPreferences.functional} 
                    onChange={() => togglePreference('functional')}
                    className="h-5 w-5 text-primary border-border rounded-full focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{t('cookie.type.functionalDesc')}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border">
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-3 text-sm font-bold text-foreground/90 bg-secondary border border-border rounded-full hover:bg-muted/50 transition-all"
              >
                {t('cookie.back')}
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-8 py-3 text-sm font-bold text-white bg-primary rounded-full hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
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

