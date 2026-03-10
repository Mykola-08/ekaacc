/* eslint-disable @typescript-eslint/no-explicit-any */
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
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted',
          'analytics_storage': 'granted'
        });
      }
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('ekabalance-cookie-consent', 'accepted');
    
    // Update Google Consent Mode
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
    }
    
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem('ekabalance-cookie-consent', 'rejected');

    // Deny all non-essential cookies via Google Consent Mode
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
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
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-lg border-gray-200  overflow-hidden rounded-2xl">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start relative">
                
                {/* Icon */}
                <div className="hidden sm:flex flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-100/80 rounded-full flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-gray-600" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex items-start justify-between">
                     <div className="flex items-center gap-3 sm:gap-0">
                        <div className="sm:hidden w-10 h-10 bg-gray-100/80 rounded-full flex items-center justify-center flex-shrink-0">
                           <Cookie className="w-5 h-5 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                            {t('cookies.title')}
                        </h3>
                     </div>
                     <Button
                        variant="ghost"
                        size="icon"
                        onClick={rejectCookies}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full -mt-2 -mr-2 sm:hidden"
                        aria-label="Reject cookies and close banner"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {t('cookies.description')}
                  </p>

                  <div className="flex flex-wrap gap-3 items-center pt-2">
                    <Button
                      onClick={acceptCookies}
                      className="bg-gold hover:bg-[#e8a204] text-eka-dark font-medium rounded-full px-8  hover:shadow transition-all"
                    >
                      {t('cookies.accept')}
                    </Button>

                    <Button
                      onClick={rejectCookies}
                      variant="outline"
                      className="font-medium rounded-full px-6 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      {t('cookies.reject') || 'Rebutjar'}
                    </Button>
                    
                    <button
                      onClick={() => setShowLanguagePopup(true)}
                      className="text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors duration-200 underline decoration-dotted underline-offset-4 px-2"
                    >
                      {t('cookies.wrongLanguage')}
                    </button>

                    <Link
                      href="/cookie-policy"
                      className="text-gold hover:text-[#e8a204] font-medium text-sm transition-colors duration-200 ml-auto sm:ml-0 px-2"
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
                  className="hidden sm:flex absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                  aria-label="Reject cookies and close banner"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
