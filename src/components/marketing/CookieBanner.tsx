'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { Card } from '@/components/ui/card';
import { AnimatePresence, motion } from 'motion/react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const { t, setShowLanguagePopup } = useLanguage();

  useEffect(() => {
    const cookieConsent = localStorage.getItem('ekabalance-cookie-consent');
    if (!cookieConsent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (cookieConsent === 'accepted') {
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

  const rejectCookies = () => {
    localStorage.setItem('ekabalance-cookie-consent', 'rejected');
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6"
        >
          <Card className="mx-auto max-w-4xl rounded-[24px] border border-gray-100 bg-white/95 p-6 shadow-xl backdrop-blur-lg sm:p-8">
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <Cookie className="h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('cookies.title')}</h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-500 sm:text-base">
                  {t('cookies.description')}
                </p>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-3">
                    <button
                      onClick={acceptCookies}
                      className="rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-800"
                    >
                      {t('cookies.accept')}
                    </button>
                    <button
                      onClick={rejectCookies}
                      className="rounded-full border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                    >
                      {t('cookies.reject') || 'Reject'}
                    </button>
                    <button
                      onClick={() => setShowLanguagePopup(true)}
                      className="text-sm font-medium text-gray-400 underline decoration-dotted transition-colors duration-200 hover:text-gray-600"
                    >
                      {t('cookies.wrongLanguage')}
                    </button>
                  </div>

                  <Link
                    href="/cookie-policy"
                    className="text-sm font-medium text-gray-400 transition-colors duration-200 hover:text-gray-600"
                  >
                    {t('cookies.learnMore')}
                  </Link>
                </div>
              </div>

              <button
                onClick={rejectCookies}
                className="shrink-0 p-2 text-gray-300 transition-colors duration-200 hover:text-gray-600"
                aria-label="Close cookie banner"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
