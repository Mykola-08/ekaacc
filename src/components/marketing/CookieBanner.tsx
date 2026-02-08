'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/marketing/LanguageContext';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { t, setShowLanguagePopup } = useLanguage();

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem('ekabalance-cookie-consent');
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (cookieConsent === 'accepted') {
      // Restore consent if already accepted
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
        });
      }
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('ekabalance-cookie-consent', 'accepted');

    // Update Google Consent Mode
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    }

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[20px] border border-gray-200 bg-white/95 p-6 shadow-xl backdrop-blur-lg sm:p-8">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Cookie className="h-5 w-5 text-gray-600" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('cookies.title')}</h3>
              <p className="mb-4 text-sm leading-relaxed text-gray-600 sm:text-base">
                {t('cookies.description')}
              </p>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <button
                    onClick={acceptCookies}
                    className="rounded-full bg-[#FFB405] px-6 py-2 text-sm font-semibold text-[#000035] transition-colors duration-200 hover:bg-[#e8a204]"
                  >
                    {t('cookies.accept')}
                  </button>
                  <button
                    onClick={() => setShowLanguagePopup(true)}
                    className="text-sm font-medium text-gray-500 underline decoration-dotted transition-colors duration-200 hover:text-blue-600"
                  >
                    {t('cookies.wrongLanguage')}
                  </button>
                </div>

                <Link
                  href="/cookie-policy"
                  className="text-sm font-medium text-[#FFB405] transition-colors duration-200 hover:text-[#e8a204]"
                >
                  {t('cookies.learnMore')}
                </Link>
              </div>
            </div>

            <button
              onClick={acceptCookies}
              className="flex-shrink-0 p-2 text-gray-400 transition-colors duration-200 hover:text-gray-600"
              aria-label="Close cookie banner"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
