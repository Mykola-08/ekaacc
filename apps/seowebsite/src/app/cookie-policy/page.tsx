'use client';

import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function CookiePolicy() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="bg-white">
          {/* Header */}
          <div className="bg-white px-0 py-10 border-b border-gray-100 mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-black">
              {t('footer.cookiePolicy')}
            </h1>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="font-medium">{t('policy.lastUpdated')}</span>
              <span className="ml-2">November 15, 2025</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-0 py-0 text-black">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-black leading-relaxed text-lg font-light">
                This Cookie Policy explains how we use cookies and similar technologies on our website in compliance with GDPR requirements.
              </p>
            </div>

            {/* What Cookies Are */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-6">
                1. What Cookies Are (GDPR Article 4(11))
              </h2>
              <p className="text-black font-light text-lg leading-relaxed mb-6">
                Cookies are small text files stored on your device when you visit our website. They help us provide, secure, and improve our Services.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-8 mt-12">
              <p className="text-center text-gray-500 text-sm">
                This Cookie Policy is provided in compliance with the General Data Protection Regulation (EU) 2016/679.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
