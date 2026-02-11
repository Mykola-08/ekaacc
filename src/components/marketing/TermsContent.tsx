'use client';

import { useLanguage } from '@/context/marketing/LanguageContext';
import PageLayout from '@/components/marketing/PageLayout';

export default function TermsContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
      hero={{
        title: t('footer.termsOfService') || 'Terms of Service',
        subtitle: `${t('policy.lastUpdated') || 'Last Updated'}: November 15, 2025`,
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        <div className="rounded-apple-xl overflow-hidden border border-border bg-card p-8 shadow-xl shadow-primary/5 md:p-12">
          {/* Introduction */}
          <div className="mb-12">
            <p className="text-lg leading-relaxed font-light text-foreground">
              These Terms govern your access to and use of the EKA Balance website, applications,
              and services ("Services"). By using the Services, you agree to these Terms in full. If
              you do not agree, please discontinue use immediately.
            </p>
          </div>

          {/* Acceptance and Consent */}
          <div className="mb-12">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-medium text-foreground">
              1. Acceptance and Consent
            </h2>
            <p className="mb-6 leading-relaxed text-foreground">
              By accessing or using our Services, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and our Privacy Policy. Your use of the Services
              constitutes explicit consent to:
            </p>
            <ul className="mb-6 ml-5 list-disc space-y-3 text-foreground">
              <li>
                The collection, processing, and storage of your personal data as described in our
                Privacy Policy
              </li>
              <li>The use of cookies and similar technologies as described in our Cookie Policy</li>
              <li>International transfers of your data as outlined in our Privacy Policy</li>
              <li>
                Our data processing activities for the purposes described in our Privacy Policy
              </li>
            </ul>
            <p className="leading-relaxed text-foreground">
              If you do not agree to these Terms or our Privacy Policy, you must not access or use
              our Services.
            </p>
          </div>

          {/* Eligibility and Age Requirements */}
          <div className="mb-12">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-medium text-foreground">
              2. Eligibility and Age Requirements
            </h2>
            <p className="mb-6 leading-relaxed text-foreground">
              By using the Services, you confirm that:
            </p>
            <ul className="mb-6 ml-5 list-disc space-y-3 text-foreground">
              <li>
                You are at least 18 years old, or if you are 16-18 years old, you have obtained
                parental consent to use our Services
              </li>
              <li>You have the legal capacity to enter into binding agreements</li>
              <li>You will provide accurate and complete information</li>
              <li>
                You will comply with all applicable laws and regulations, including data protection
                laws
              </li>
              <li>
                You understand and accept our data processing practices as described in our Privacy
                Policy
              </li>
            </ul>
            <div className="rounded-[20px] border border-info bg-info/50 p-6">
              <p className="text-foreground">
                <strong>Parental Consent:</strong> If you are under 16 years of age, you may not use
                our Services. If you are between 16-18 years of age, you may only use our Services
                with the consent of your parent or legal guardian who must review and accept these
                Terms and our Privacy Policy on your behalf.
              </p>
            </div>
          </div>

          {/* Nature of Services */}
          <div className="mb-12">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-medium text-foreground">
              3. Nature of Services
            </h2>
            <p className="mb-6 leading-relaxed text-foreground">
              EKA Balance provides complementary wellness and bodywork services. Our services are:
            </p>
            <ul className="mb-6 ml-5 list-disc space-y-3 text-foreground">
              <li>Educational and supportive in nature</li>
              <li>Complementary and non-medical</li>
              <li>Not intended to diagnose, treat, cure, or prevent disease</li>
              <li>Not a substitute for licensed medical or mental-health care</li>
            </ul>
            <div className="rounded-[20px] border border-warning/30 bg-warning p-6">
              <p className="text-foreground">
                <strong>Important:</strong> Keep following your physician or licensed clinician
                recommendations. If you have urgent symptoms, contact emergency services
                immediately.
              </p>
            </div>
          </div>

          {/* Complementary Methods Disclaimer */}
          <div className="mb-12">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-medium text-foreground">
              4. Complementary Methods Disclaimer
            </h2>
            <p className="mb-6 leading-relaxed text-foreground">
              Our approach is complementary. We support wellbeing through somatic education,
              movement, touch-based techniques, and lifestyle guidance.
            </p>
            <ul className="mb-6 ml-5 list-disc space-y-3 text-foreground">
              <li>We do not provide medical diagnosis, prescriptions, or medical treatment.</li>
              <li>We do not advise stopping prescribed medication or clinical care.</li>
              <li>Outcomes vary by person, context, and consistency of practice.</li>
              <li>
                For physical or psychological emergencies, seek immediate licensed medical care.
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="mb-12">
            <h2 className="mb-6 border-b border-border pb-4 text-xl font-medium text-foreground">
              18. Contact Information and Data Protection Inquiries
            </h2>
            <p className="mb-6 leading-relaxed text-foreground">
              For questions about these Terms, privacy matters, or data protection inquiries:
            </p>

            <div className="grid gap-6">
              <div className="rounded-[20px] border border-info bg-info/50 p-6">
                <h3 className="mb-4 text-lg font-medium text-foreground">
                  Data Protection Officer (DPO)
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-20 font-medium text-foreground">Name:</span>
                    <span className="text-foreground">Olena Kucherova Dryzhak</span>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-20 font-medium text-foreground">Email:</span>
                    <a
                      href="mailto:dpo@ekabalance.com"
                      className="text-primary hover:text-info-foreground"
                    >
                      dpo@ekabalance.com
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-20 font-medium text-foreground">Phone:</span>
                    <span className="text-foreground">+34 658 867 133</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  The DPO is your primary contact for all data protection matters, privacy
                  inquiries, and exercising your data subject rights.
                </p>
              </div>

              <div className="rounded-[20px] bg-muted p-6">
                <h3 className="mb-4 text-lg font-medium text-foreground">
                  Legal and General Inquiries
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-20 font-medium text-foreground">Email:</span>
                    <a
                      href="mailto:legal@ekabalance.com"
                      className="text-primary hover:text-info-foreground"
                    >
                      legal@ekabalance.com
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-20 font-medium text-foreground">Address:</span>
                    <span className="text-foreground">
                      Calle Plata 1, 08191 Rubí, Barcelona, Spain
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground/60">
              These Terms of Service are provided in compliance with applicable data protection
              regulations and consumer protection laws.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
