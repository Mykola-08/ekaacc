"use client";

import React, { useState, useEffect } from 'react';
import { useConsent, ConsentPreferences } from '@/hooks/platform/useConsent';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { X, Shield, Cookie, Info } from 'lucide-react';
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-card border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto">
        {!showDetails ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Cookie className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{t('cookie.title')}</h3>
              </div>
              <p className="text-sm text-muted-foreground max-w-3xl">
                {t('cookie.intro')} <Link href="/legal/privacy" className="text-primary hover:underline">{t('cookie.privacy')}</Link> {t('cookie.and')} <Link href="/legal/cookies" className="text-primary hover:underline">{t('cookie.cookies')}</Link>.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowDetails(true)}
                className="px-4 py-2 text-sm font-medium text-foreground/90 bg-card border border-gray-300 rounded-md hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('cookie.customize')}
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-sm font-medium text-foreground/90 bg-card border border-gray-300 rounded-md hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('cookie.rejectAll')}
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                {t('cookie.acceptAll')}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{t('cookie.details.title')}</h3>
              </div>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground/80 hover:text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Essential */}
              <div className="p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{t('cookie.type.essential')}</span>
                    <div className="group relative">
                      <Info className="w-4 h-4 text-muted-foreground/80 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded hidden group-hover:block z-10">
                        {t('cookie.type.essentialDesc')}
                      </div>
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={true} 
                    disabled 
                    className="h-4 w-4 text-primary border-gray-300 rounded opacity-50 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('cookie.details.description')}</p>
              </div>

              {/* Analytics */}
              <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{t('cookie.type.analytics')}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={tempPreferences.analytics} 
                    onChange={() => togglePreference('analytics')}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('cookie.type.analyticsDesc')}</p>
              </div>

              {/* Marketing */}
              <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{t('cookie.type.marketing')}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={tempPreferences.marketing} 
                    onChange={() => togglePreference('marketing')}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('cookie.type.marketingDesc')}</p>
              </div>

              {/* Functional */}
              <div className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{t('cookie.type.functional')}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={tempPreferences.functional} 
                    onChange={() => togglePreference('functional')}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{t('cookie.type.functionalDesc')}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 text-sm font-medium text-foreground/90 bg-card border border-gray-300 rounded-md hover:bg-muted/30"
              >
                {t('cookie.back')}
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
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
