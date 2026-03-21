'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PageLayout from '@/marketing/components/PageLayout';
import { Card, CardContent } from '@/marketing/components/ui/card';

export default function PrivacyPolicyContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
      hero={{
        title: t('footer.privacyPolicy') || 'Privacy Policy',
        subtitle: `${t('policy.lastUpdated') || 'Last Updated'}: November 15, 2025`,
      }}
    >
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        <Card className="overflow-hidden bg-white">
          <CardContent className="p-8 md:p-12">
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-lg leading-relaxed font-light text-gray-700">
                This Privacy Policy explains how we collect, use, process, store, protect, and share
                data when you access or use our website, applications, and services ("Services"). By
                using the Services, you agree to this Policy.
              </p>
            </div>

            {/* Complementary Methods Disclaimer */}
            <div className="mb-12">
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-medium text-gray-900">
                Complementary Methods Disclaimer
              </h2>
              <div className="rounded-[var(--radius)] border border-yellow-200 bg-yellow-50 p-6">
                <p className="mb-4 leading-relaxed text-gray-700">
                  EKA Balance services are complementary wellness services. They are not medical
                  diagnosis or treatment and do not replace care from licensed medical or
                  mental-health professionals.
                </p>
                <ul className="ml-5 list-disc text-gray-700">
                  <li>
                    Do not stop prescribed medication or medical care based on website content.
                  </li>
                  <li>
                    Consult your physician for medical decisions, symptoms, or health emergencies.
                  </li>
                  <li>If you are in immediate danger, call emergency services right away.</li>
                </ul>
              </div>
            </div>

            {/* Data Controller */}
            <div className="mb-12">
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-medium text-gray-900">
                Data Controller
              </h2>
              <div className="rounded-[var(--radius)] bg-gray-50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Name:</span>
                  <span className="text-gray-700">Olena Kucherova Dryzhak (EKA Balance)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Address:</span>
                  <span className="text-gray-700">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Phone:</span>
                  <span className="text-gray-700">+34 658 867 133</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Email:</span>
                  <a
                    href="mailto:legal@ekabalance.com"
                    className="text-blue-600 transition-colors hover:text-blue-800"
                  >
                    legal@ekabalance.com
                  </a>
                </div>
              </div>
            </div>

            {/* Data Protection Officer */}
            <div className="mb-12">
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-medium text-gray-900">
                Data Protection Officer (DPO)
              </h2>
              <div className="rounded-[var(--radius)] border border-blue-100 bg-blue-50/50 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Name:</span>
                  <span className="text-gray-700">Olena Kucherova Dryzhak</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Address:</span>
                  <span className="text-gray-700">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Email:</span>
                  <a
                    href="mailto:dpo@ekabalance.com"
                    className="text-blue-600 transition-colors hover:text-blue-800"
                  >
                    dpo@ekabalance.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <span className="w-32 flex-shrink-0 font-medium text-gray-900">Phone:</span>
                  <span className="text-gray-700">+34 658 867 133</span>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed font-light text-gray-600">
                You may contact our DPO directly for any privacy-related inquiries, complaints, or
                to exercise your data protection rights.
              </p>
            </div>

            {/* Data Collection */}
            <div className="mb-12">
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-medium text-gray-900">
                1. Data We Collect
              </h2>
              <p className="mb-8 leading-relaxed text-gray-700">
                We collect all types of personal, technical, behavioral, and sensitive data,
                including but not limited to the following:
              </p>

              <div className="">
                <div className="border-l-4 border-blue-200 pl-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    1.1 Personal Identification Data
                  </h3>
                  <ul className="text-gray-700">
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></span>
                      Full name
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></span>
                      Username
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></span>
                      Email address
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></span>
                      Phone number
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></span>
                      Postal address
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400"></span>
                      Date of birth
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-rose-200 pl-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    1.2 Sensitive & Special Category Data
                  </h3>
                  <p className="mb-4 text-gray-700">
                    We may collect special categories of personal data where permitted by law,
                    including:
                  </p>
                  <ul className="text-gray-700">
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400"></span>
                      Health information
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400"></span>
                      Physical condition, pain indicators, wellness data
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400"></span>
                      Biometric identifiers
                    </li>
                    <li className="flex items-start">
                      <span className="mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400"></span>
                      Mental and emotional health insights
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Legal Basis */}
            <div className="mb-12">
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-medium text-gray-900">
                2. Legal Basis for Processing (GDPR Article 6)
              </h2>
              <p className="mb-6 leading-relaxed text-gray-700">
                We process personal data based on the following legal grounds:
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-[var(--radius)] border border-green-100 bg-green-50/50 p-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    2.1 Consent (Article 6(1)(a))
                  </h3>
                  <p className="mb-4 text-sm text-gray-700">
                    We rely on your explicit consent for:
                  </p>
                  <ul className="text-sm text-gray-700">
                    <li>• Marketing communications</li>
                    <li>• Non-essential cookies</li>
                    <li>• Processing of special categories of health data</li>
                    <li>• Automated decision-making</li>
                  </ul>
                </div>

                <div className="rounded-[var(--radius)] border border-blue-100 bg-blue-50/50 p-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    2.2 Contractual Necessity
                  </h3>
                  <p className="mb-4 text-sm text-gray-700">Processing is necessary for:</p>
                  <ul className="text-sm text-gray-700">
                    <li>• Providing services</li>
                    <li>• Processing payments</li>
                    <li>• Managing your account</li>
                    <li>• Customer support</li>
                  </ul>
                </div>

                <div className="rounded-[var(--radius)] border border-purple-100 bg-purple-50/50 p-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">2.3 Legal Obligations</h3>
                  <p className="mb-4 text-sm text-gray-700">
                    Processing is necessary to comply with:
                  </p>
                  <ul className="text-sm text-gray-700">
                    <li>• Tax and accounting regulations</li>
                    <li>• Health and safety requirements</li>
                    <li>• Consumer protection laws</li>
                    <li>• Data retention obligations</li>
                  </ul>
                </div>

                <div className="rounded-[var(--radius)] border border-orange-100 bg-orange-50/50 p-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    2.4 Legitimate Interests
                  </h3>
                  <p className="mb-4 text-sm text-gray-700">
                    We process data based on our legitimate interests:
                  </p>
                  <ul className="text-sm text-gray-700">
                    <li>• Improving services</li>
                    <li>• Fraud prevention</li>
                    <li>• Direct marketing (soft opt-in)</li>
                    <li>• Statistical analysis</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* User Rights */}
            <div className="mb-12">
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-medium text-gray-900">
                3. Your Rights Under GDPR (Articles 12-22)
              </h2>
              <p className="mb-8 leading-relaxed text-gray-700">
                As a data subject, you have the following rights under the GDPR:
              </p>

              <div className="">
                <div className="rounded-[var(--radius)] border border-gray-100 bg-gray-50/50 p-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    3.1 Right of Access (Article 15)
                  </h3>
                  <p className="mb-4 text-gray-700">You have the right to obtain:</p>
                  <ul className="ml-4 list-disc text-gray-700">
                    <li>Confirmation of whether we process your personal data</li>
                    <li>
                      Access to your personal data and information about processing purposes,
                      categories, recipients, retention periods, and your rights
                    </li>
                  </ul>
                  <div className="mt-4 rounded-[var(--radius)] border border-gray-100 bg-white p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Response Time:</strong> We will respond within 30 days of receiving
                      your request.
                    </p>
                  </div>
                </div>

                <div className="rounded-[var(--radius)] border border-gray-100 bg-gray-50/50 p-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    3.2 Right to Erasure (Article 17)
                  </h3>
                  <p className="mb-4 text-gray-700">
                    You have the right to obtain the erasure of personal data concerning you where
                    one of the following grounds applies:
                  </p>
                  <ul className="ml-4 list-disc text-gray-700">
                    <li>The personal data is no longer necessary</li>
                    <li>You withdraw consent and there is no other legal ground</li>
                    <li>You object to processing and there are no overriding legitimate grounds</li>
                    <li>The personal data has been unlawfully processed</li>
                  </ul>
                </div>

                <div className="rounded-[var(--radius)] border border-gray-100 bg-gray-50/50 p-6">
                  <h3 className="mb-3 text-lg font-medium text-gray-900">
                    3.3 Right to Data Portability (Article 20)
                  </h3>
                  <p className="mb-4 text-gray-700">
                    You have the right to receive your personal data in a structured, commonly used,
                    and machine-readable format.
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-[var(--radius)] border border-blue-100 bg-blue-50/50 p-6">
                <h4 className="mb-3 font-medium text-gray-900">Exercising Your Rights</h4>
                <p className="mb-4 text-gray-700">
                  To exercise any of your rights, please contact us:
                </p>
                <div className="">
                  <div className="flex flex-col sm:flex-row">
                    <span className="w-24 font-medium text-gray-900">Email:</span>
                    <a
                      href="mailto:dpo@ekabalance.com"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      dpo@ekabalance.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-12">
              <h2 className="mb-6 border-b border-gray-200 pb-4 text-xl font-medium text-gray-900">
                Contact Information and Complaints
              </h2>

              <div className="grid gap-6">
                <div className="rounded-[var(--radius)] border border-gray-100 bg-gray-50 p-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Data Protection Officer (DPO)
                  </h3>
                  <div className="">
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-20 font-medium text-gray-900">Name:</span>
                      <span className="text-gray-700">Olena Kucherova Dryzhak</span>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-20 font-medium text-gray-900">Email:</span>
                      <a
                        href="mailto:dpo@ekabalance.com"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        dpo@ekabalance.com
                      </a>
                    </div>
                    <div className="flex flex-col sm:flex-row">
                      <span className="w-20 font-medium text-gray-900">Phone:</span>
                      <span className="text-gray-700">+34 658 867 133</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[var(--radius)] border border-rose-100 bg-rose-50 p-6">
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Supervisory Authority</h3>
                  <p className="mb-4 text-gray-700">
                    If you are not satisfied with our response or believe your data protection
                    rights have been violated, you have the right to lodge a complaint with the
                    supervisory authority:
                  </p>
                  <div className="">
                    <div className="font-medium text-gray-900">
                      Agencia Española de Protección de Datos (AEPD)
                    </div>
                    <div className="text-gray-700">C/ Jorge Juan, 6, 28001 Madrid, Spain</div>
                    <div className="text-gray-700">
                      Website:{' '}
                      <a
                        href="https://www.aepd.es"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        www.aepd.es
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 border-t border-gray-100 pt-8">
              <p className="text-center text-sm text-gray-400">
                This Privacy Policy is provided in compliance with the General Data Protection
                Regulation (EU) 2016/679.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
