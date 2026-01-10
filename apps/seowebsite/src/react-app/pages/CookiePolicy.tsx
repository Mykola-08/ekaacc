import SEOOptimized from '@/react-app/components/SEOOptimized';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function CookiePolicy() {
  const { t } = useLanguage();
  
  return (
    <SEOOptimized
      title="Cookie Policy - EKA Balance"
      description="Cookie Policy for EKA Balance wellness center"
      url="https://ekabalance.com/cookie-policy"
    >
      
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-900 text-white px-12 py-10">
                <h1 className="text-3xl font-light tracking-tight mb-3">
                  {t('footer.cookiePolicy')}
                </h1>
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="font-medium">{t('policy.lastUpdated')}</span>
                  <span className="ml-2">November 15, 2025</span>
                </div>
              </div>

              {/* Content */}
              <div className="px-12 py-10">
                {/* Introduction */}
                <div className="mb-12">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    This Cookie Policy explains how we use cookies and similar technologies on our website in compliance with GDPR requirements.
                  </p>
                </div>

                {/* What Cookies Are */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    1. What Cookies Are (GDPR Article 4(11))
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Cookies are small text files stored on your device when you visit our website. They help us provide, secure, and improve our Services.
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <p className="text-center text-gray-500 text-sm">
                    This Cookie Policy is provided in compliance with the General Data Protection Regulation (EU) 2016/679.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </SEOOptimized>
  );
}

