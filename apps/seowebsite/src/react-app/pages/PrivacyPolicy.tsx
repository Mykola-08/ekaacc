import SEOOptimized from '@/react-app/components/SEOOptimized';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  
  return (
    <SEOOptimized
      title="Privacy Policy - EKA Balance"
      description="Privacy Policy for EKA Balance wellness center"
      url="https://ekabalance.com/privacy-policy"
    >
        <div className="min-h-screen bg-muted/30 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="bg-card rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-900 text-white px-12 py-10">
                <h1 className="text-3xl font-light tracking-tight mb-3">
                  {t('footer.privacyPolicy')}
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
                  <p className="text-foreground/90 leading-relaxed text-lg">
                    This Privacy Policy explains how we collect, use, process, store, protect, and share data when you access or use our website, applications, and services ("Services"). By using the Services, you agree to this Policy.
                  </p>
                </div>

                {/* Data Controller */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    Data Controller
                  </h2>
                  <div className="bg-muted/30 rounded-lg p-6 space-y-4">
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Name:</span>
                      <span className="text-foreground/90">Olena Kucherova Dryzhak (EKA Balance)</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Address:</span>
                      <span className="text-foreground/90">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Phone:</span>
                      <span className="text-foreground/90">+34 658 867 133</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Email:</span>
                      <a href="mailto:legal@ekabalance.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                        legal@ekabalance.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Data Protection Officer */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    Data Protection Officer (DPO)
                  </h2>
                  <div className="bg-blue-50 rounded-lg p-6 space-y-4 border border-blue-100">
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Name:</span>
                      <span className="text-foreground/90">Olena Kucherova Dryzhak</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Address:</span>
                      <span className="text-foreground/90">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Email:</span>
                      <a href="mailto:dpo@ekabalance.com" className="text-blue-600 hover:text-blue-800 transition-colors">
                        dpo@ekabalance.com
                      </a>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-foreground w-32 flex-shrink-0">Phone:</span>
                      <span className="text-foreground/90">+34 658 867 133</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4 leading-relaxed">
                    You may contact our DPO directly for any privacy-related inquiries, complaints, or to exercise your data protection rights.
                  </p>
                </div>

                {/* Data Collection */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    1. Data We Collect
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-8">
                    We collect all types of personal, technical, behavioral, and sensitive data, including but not limited to the following:
                  </p>

                  <div className="space-y-8">
                    <div className="border-l-4 border-blue-200 pl-6">
                      <h3 className="text-lg font-medium text-foreground mb-4">1.1 Personal Identification Data</h3>
                      <ul className="space-y-3 text-foreground/90">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Full name
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Username
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Email address
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Phone number
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Postal address
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Date of birth
                        </li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-red-200 pl-6">
                      <h3 className="text-lg font-medium text-foreground mb-4">1.2 Sensitive & Special Category Data</h3>
                      <p className="text-foreground/90 mb-4">We may collect special categories of personal data where permitted by law, including:</p>
                      <ul className="space-y-3 text-foreground/90">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Health information
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Physical condition, pain indicators, wellness data
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Biometric identifiers
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          Mental and emotional health insights
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Legal Basis */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    2. Legal Basis for Processing (GDPR Article 6)
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-6">
                    We process personal data based on the following legal grounds:
                  </p>
                  
                  <div className="grid gap-6">
                    <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                      <h3 className="text-lg font-medium text-foreground mb-3">2.1 Consent (Article 6(1)(a))</h3>
                      <p className="text-foreground/90 mb-4">We rely on your explicit consent for:</p>
                      <ul className="space-y-2 text-foreground/90">
                        <li>• Marketing communications (emails, newsletters, promotional offers)</li>
                        <li>• Non-essential cookies and tracking technologies</li>
                        <li>• Processing of special categories of health data (Article 9(2)(a))</li>
                        <li>• Automated decision-making and profiling activities</li>
                      </ul>
                      <p className="text-muted-foreground mt-4 text-sm">You may withdraw your consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.</p>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                      <h3 className="text-lg font-medium text-foreground mb-3">2.2 Contractual Necessity (Article 6(1)(b))</h3>
                      <p className="text-foreground/90 mb-4">Processing is necessary for:</p>
                      <ul className="space-y-2 text-foreground/90">
                        <li>• Providing our wellness services as requested</li>
                        <li>• Processing payments and managing bookings</li>
                        <li>• Creating and managing your user account</li>
                        <li>• Delivering customer support and responding to inquiries</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                      <h3 className="text-lg font-medium text-foreground mb-3">2.3 Legal Obligations (Article 6(1)(c))</h3>
                      <p className="text-foreground/90 mb-4">Processing is necessary to comply with:</p>
                      <ul className="space-y-2 text-foreground/90">
                        <li>• Tax and accounting regulations</li>
                        <li>• Health and safety requirements</li>
                        <li>• Consumer protection laws</li>
                        <li>• Data retention obligations</li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
                      <h3 className="text-lg font-medium text-foreground mb-3">2.4 Legitimate Interests (Article 6(1)(f))</h3>
                      <p className="text-foreground/90 mb-4">We process data based on our legitimate interests, which include:</p>
                      <ul className="space-y-2 text-foreground/90">
                        <li>• Improving and optimizing our services and website performance</li>
                        <li>• Preventing fraud and ensuring network security</li>
                        <li>• Direct marketing to existing customers (soft opt-in)</li>
                        <li>• Statistical analysis and service improvement</li>
                      </ul>
                      <p className="text-muted-foreground mt-4 text-sm">We conduct balancing tests to ensure our legitimate interests do not override your fundamental rights and freedoms.</p>
                    </div>
                  </div>
                </div>

                {/* User Rights */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    3. Your Rights Under GDPR (Articles 12-22)
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-8">
                    As a data subject, you have the following rights under the GDPR:
                  </p>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-foreground mb-3">3.1 Right of Access (Article 15)</h3>
                      <p className="text-foreground/90 mb-4">You have the right to obtain:</p>
                      <ul className="space-y-2 text-foreground/90">
                        <li>• Confirmation of whether we process your personal data</li>
                        <li>• Access to your personal data and information about processing purposes, categories, recipients, retention periods, and your rights</li>
                      </ul>
                      <div className="bg-muted/30 rounded p-4 mt-4">
                        <p className="text-sm text-muted-foreground"><strong>Response Time:</strong> We will respond within 30 days of receiving your request.</p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-foreground mb-3">3.2 Right to Erasure ('Right to be Forgotten') (Article 17)</h3>
                      <p className="text-foreground/90 mb-4">You have the right to obtain the erasure of personal data concerning you where one of the following grounds applies:</p>
                      <ul className="space-y-2 text-foreground/90">
                        <li>• The personal data is no longer necessary for the purposes for which it was collected</li>
                        <li>• You withdraw consent and there is no other legal ground for processing</li>
                        <li>• You object to processing and there are no overriding legitimate grounds</li>
                        <li>• The personal data has been unlawfully processed</li>
                      </ul>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-foreground mb-3">3.3 Right to Data Portability (Article 20)</h3>
                      <p className="text-foreground/90 mb-4">You have the right to receive your personal data in a structured, commonly used, and machine-readable format and have the right to transmit that data to another controller where:</p>
                      <ul className="space-y-2 text-foreground/90">
                        <li>• The processing is based on consent or contractual necessity</li>
                        <li>• The processing is carried out by automated means</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-6 mt-8 border border-blue-100">
                    <h4 className="font-medium text-foreground mb-3">Exercising Your Rights</h4>
                    <p className="text-foreground/90 mb-4">To exercise any of your rights, please contact us:</p>
                    <div className="space-y-2">
                      <div className="flex">
                        <span className="font-medium text-foreground w-24">Email:</span>
                        <a href="mailto:dpo@ekabalance.com" className="text-blue-600 hover:text-blue-800">dpo@ekabalance.com</a>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-foreground w-24">Mail:</span>
                        <span className="text-foreground/90">Data Protection Officer, Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium text-foreground w-24">Phone:</span>
                        <span className="text-foreground/90">+34 658 867 133</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground mt-4 text-sm">
                      <strong>Verification:</strong> We may request additional information to verify your identity before processing your request. This is to protect your personal data from unauthorized access.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    Contact Information and Complaints
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-6">
                    For privacy inquiries, exercising your rights, or making complaints:
                  </p>

                  <div className="grid gap-6">
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-foreground mb-4">Data Protection Officer (DPO)</h3>
                      <div className="space-y-3">
                        <div className="flex">
                          <span className="font-medium text-foreground w-20">Name:</span>
                          <span className="text-foreground/90">Olena Kucherova Dryzhak</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-foreground w-20">Email:</span>
                          <a href="mailto:dpo@ekabalance.com" className="text-blue-600 hover:text-blue-800">dpo@ekabalance.com</a>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-foreground w-20">Phone:</span>
                          <span className="text-foreground/90">+34 658 867 133</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-foreground w-20">Address:</span>
                          <span className="text-foreground/90">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        The DPO is your primary contact for all data protection matters and will respond to your inquiry within 30 days.
                      </p>
                    </div>

                    <div className="bg-red-50 rounded-lg p-6 border border-red-100">
                      <h3 className="text-lg font-medium text-foreground mb-4">Supervisory Authority</h3>
                      <p className="text-foreground/90 mb-4">
                        If you are not satisfied with our response or believe your data protection rights have been violated, you have the right to lodge a complaint with the supervisory authority:
                      </p>
                      <div className="space-y-2">
                        <div className="font-medium text-foreground">Agencia Española de Protección de Datos (AEPD)</div>
                        <div className="text-foreground/90">C/ Jorge Juan, 6, 28001 Madrid, Spain</div>
                        <div className="text-foreground/90">
                          Website: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">www.aepd.es</a>
                        </div>
                        <div className="text-foreground/90">Phone: +34 901 100 099 / +34 91 266 35 17</div>
                      </div>
                      <p className="text-muted-foreground mt-4 text-sm">
                        You may also contact the supervisory authority in your country of habitual residence or place of work.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <p className="text-center text-muted-foreground text-sm">
                    This Privacy Policy is provided in compliance with the General Data Protection Regulation (EU) 2016/679.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
    </SEOOptimized>
  );
}

