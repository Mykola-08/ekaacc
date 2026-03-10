'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PageLayout from '@/marketing/components/PageLayout';
import { Card, CardContent } from '@/marketing/components/ui/card';

export default function CookiePolicyContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
        hero={{
          title: t('footer.cookiePolicy') || 'Cookie Policy',
          subtitle: `${t('policy.lastUpdated') || 'Last Updated'}: November 15, 2025`
        }}
    >
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
            <Card className="  bg-white overflow-hidden">
                <CardContent className="p-8 md:p-12">

                 {/* Introduction */}
                 <div className="mb-12">
                  <p className="text-gray-700 leading-relaxed text-lg font-light">
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

                {/* Complementary Methods Disclaimer */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    Complementary Services Notice
                  </h2>
                  <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                    <p className="text-gray-700 leading-relaxed">
                      The EKA Balance website presents complementary wellness services. Website content is informational and is not medical advice, diagnosis, or treatment. For medical concerns, consult a licensed healthcare professional.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-8 mt-12">
                  <p className="text-center text-gray-400 text-sm">
                    This Cookie Policy is provided in compliance with the General Data Protection Regulation (EU) 2016/679.
                  </p>
                </div>

            </CardContent>
            </Card>
        </div>
    </PageLayout>
  );
}
