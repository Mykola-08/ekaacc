'use client';

import { useLanguage } from '@/context/marketing/LanguageContext';
import PageLayout from '@/components/marketing/PageLayout';

export default function CookiePolicyContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
      hero={{
        title: t('footer.cookiePolicy') || 'Cookie Policy',
        subtitle: `${t('policy.lastUpdated') || 'Last Updated'}: November 15, 2025`,
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        <div className="rounded-apple-xl overflow-hidden border border-border bg-card p-8 shadow-xl shadow-primary/5 md:p-12">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg leading-relaxed font-light text-foreground">
              This Cookie Policy explains how we use cookies and similar technologies on our website
              in compliance with GDPR requirements.
            </p>
          </div>

          {/* What Cookies Are */}
          <div className="mb-12">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-medium text-foreground">
              1. What Cookies Are (GDPR Article 4(11))
            </h2>
            <p className="mb-6 leading-relaxed text-foreground">
              Cookies are small text files stored on your device when you visit our website. They
              help us provide, secure, and improve our Services.
            </p>
          </div>

          {/* Complementary Methods Disclaimer */}
          <div className="mb-12">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-medium text-foreground">
              Complementary Services Notice
            </h2>
            <div className="rounded-[20px] border border-warning/30 bg-warning p-6">
              <p className="leading-relaxed text-foreground">
                The EKA Balance website presents complementary wellness services. Website content is
                informational and is not medical advice, diagnosis, or treatment. For medical
                concerns, consult a licensed healthcare professional.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground/60">
              This Cookie Policy is provided in compliance with the General Data Protection
              Regulation (EU) 2016/679.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
