'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Button } from '@/marketing/components/ui/button';
import { Card } from '@/marketing/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';

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

  const rejectCookies = () => {
    localStorage.setItem('ekabalance-cookie-consent', 'rejected');

    // Deny all non-essential cookies via Google Consent Mode
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
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed right-0 bottom-0 left-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl">
            <Card className="overflow-hidden rounded-[2rem] border-gray-200 bg-white/95 shadow-2xl backdrop-blur-lg">
              <div className="relative flex flex-col items-start gap-5 p-5 sm:flex-row">
                {/* Icon */}
                <div className="hidden flex-shrink-0 sm:flex">
                  <div className="bg-primary/5 flex h-10 w-10 items-center justify-center rounded-full">
                    <Cookie className="text-primary h-5 w-5" />
                  </div>
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 sm:gap-0">
                      <div className="bg-primary/5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full sm:hidden">
                        <Cookie className="text-primary h-4 w-4" />
                      </div>
                      <h3 className="text-base font-semibold tracking-tight text-gray-900">
                        {t('cookies.title')}
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={rejectCookies}
                      className="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:hidden"
                      aria-label="Reject cookies and close banner"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <p className="text-xs leading-relaxed text-gray-600">
                    {t('cookies.description')}
                  </p>

                  <div className="flex w-full flex-wrap items-center gap-2 pt-1">
                    <Button
                      onClick={acceptCookies}
                      className="bg-gold text-eka-dark h-9 flex-1 rounded-xl px-5 text-xs font-medium transition-all hover:bg-[#e8a204] sm:flex-none"
                    >
                      {t('cookies.accept')}
                    </Button>

                    <Button
                      onClick={rejectCookies}
                      variant="outline"
                      className="h-9 flex-1 rounded-xl border-gray-300 px-4 text-xs font-medium text-gray-600 transition-all hover:bg-gray-100 sm:flex-none"
                    >
                      {t('cookies.reject') || 'Rebutjar'}
                    </Button>

                    <button
                      onClick={() => setShowLanguagePopup(true)}
                      className="px-2 text-[11px] font-medium text-gray-500 underline decoration-dotted underline-offset-4 transition-colors duration-200 hover:text-blue-600"
                    >
                      {t('cookies.wrongLanguage')}
                    </button>

                    <Link
                      href="/cookie-policy"
                      className="text-gold ml-auto px-2 text-[11px] font-medium transition-colors duration-200 hover:text-[#e8a204] sm:ml-0"
                    >
                      {t('cookies.learnMore')}
                    </Link>
                  </div>
                </div>

                {/* Desktop Close Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={rejectCookies}
                  className="absolute top-4 right-4 hidden rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 sm:flex"
                  aria-label="Reject cookies and close banner"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
