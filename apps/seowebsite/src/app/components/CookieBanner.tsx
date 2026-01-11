 
'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

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
    }
    
    if (cookieConsent === 'accepted') {
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
    return () => {}; // Empty cleanup function
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

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-gray-600" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('cookies.title')}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                {t('cookies.description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex gap-3">
                  <button
                    onClick={acceptCookies}
                    className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-6 py-2 rounded-full transition-colors duration-200 text-sm"
                  >
                    {t('cookies.accept')}
                  </button>
                  <button
                    onClick={() => setShowLanguagePopup(true)}
                    className="text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors duration-200 underline decoration-dotted"
                  >
                    {t('cookies.wrongLanguage')}
                  </button>
                </div>

                <Link
                  href="/cookie-policy"
                  className="text-[#FFB405] hover:text-[#e8a204] font-medium text-sm transition-colors duration-200"
                >
                  {t('cookies.learnMore')}
                </Link>
              </div>
            </div>

            <button
              onClick={acceptCookies}
              className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
