'use client';

import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function TermsOfService() {
  const { t } = useLanguage();
  
  return (
        <div className="min-h-screen bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-900 text-white px-12 py-10">
                <h1 className="text-3xl font-light tracking-tight mb-3">
                  {t('footer.termsOfService')}
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
                    These Terms govern your access to and use of the EKA Balance website, applications, and services ("Services"). By using the Services, you agree to these Terms in full. If you do not agree, please discontinue use immediately.
                  </p>
                </div>

                {/* Acceptance and Consent */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    1. Acceptance and Consent
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. Your use of the Services constitutes explicit consent to:
                  </p>
                  <ul className="space-y-3 text-gray-700 mb-6">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      The collection, processing, and storage of your personal data as described in our Privacy Policy
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      The use of cookies and similar technologies as described in our Cookie Policy
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      International transfers of your data as outlined in our Privacy Policy
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Our data processing activities for the purposes described in our Privacy Policy
                    </li>
                  </ul>
                  <p className="text-gray-700 leading-relaxed">
                    If you do not agree to these Terms or our Privacy Policy, you must not access or use our Services.
                  </p>
                </div>

                {/* Eligibility and Age Requirements */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    2. Eligibility and Age Requirements
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    By using the Services, you confirm that:
                  </p>
                  <ul className="space-y-3 text-gray-700 mb-6">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You are at least 18 years old, or if you are 16-18 years old, you have obtained parental consent to use our Services
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You have the legal capacity to enter into binding agreements
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You will provide accurate and complete information
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You will comply with all applicable laws and regulations, including data protection laws
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You understand and accept our data processing practices as described in our Privacy Policy
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      You have the authority to provide any personal data you share with us and that such data does not infringe upon the rights of any third party
                    </li>
                  </ul>
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                    <p className="text-gray-700">
                      <strong>Parental Consent:</strong> If you are under 16 years of age, you may not use our Services. If you are between 16-18 years of age, you may only use our Services with the consent of your parent or legal guardian who must review and accept these Terms and our Privacy Policy on your behalf.
                    </p>
                  </div>
                </div>

                {/* Nature of Services */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    3. Nature of Services
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    EKA Balance provides wellness and kinesiology services. Our services are:
                  </p>
                  <ul className="space-y-3 text-gray-700 mb-6">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Informational and educational in nature
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Not intended as medical diagnosis or treatment
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Not a substitute for professional medical advice
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      Provided as complementary wellness support
                    </li>
                  </ul>
                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                    <p className="text-gray-700">
                      <strong>Important:</strong> You acknowledge that all decisions based on information from EKA Balance are made at your own risk.
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">
                    18. Contact Information and Data Protection Inquiries
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    For questions about these Terms, privacy matters, or data protection inquiries:
                  </p>

                  <div className="grid gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Data Protection Officer (DPO)</h3>
                      <div className="space-y-3">
                        <div className="flex">
                          <span className="font-medium text-gray-900 w-20">Name:</span>
                          <span className="text-gray-700">Olena Kucherova Dryzhak</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-gray-900 w-20">Email:</span>
                          <a href="mailto:dpo@ekabalance.com" className="text-blue-600 hover:text-blue-800">dpo@ekabalance.com</a>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-gray-900 w-20">Phone:</span>
                          <span className="text-gray-700">+34 658 867 133</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-gray-900 w-20">Address:</span>
                          <span className="text-gray-700">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                        </div>
                      </div>
                      <p className="text-gray-600 mt-4 text-sm">
                        The DPO is your primary contact for all data protection matters, privacy inquiries, and exercising your data subject rights.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Legal and General Inquiries</h3>
                      <div className="space-y-3">
                        <div className="flex">
                          <span className="font-medium text-gray-900 w-20">Email:</span>
                          <a href="mailto:legal@ekabalance.com" className="text-blue-600 hover:text-blue-800">legal@ekabalance.com</a>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-gray-900 w-20">Address:</span>
                          <span className="text-gray-700">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-gray-900 w-20">Phone:</span>
                          <span className="text-gray-700">+34 658 867 133</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-100 mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Response Times</h4>
                    <p className="text-gray-700 mb-4">We aim to respond to all inquiries within:</p>
                    <ul className="space-y-2 text-gray-700">
                      <li>• <strong>Data protection inquiries:</strong> 30 days (as required by GDPR)</li>
                      <li>• <strong>General inquiries:</strong> 7 business days</li>
                      <li>• <strong>Legal matters:</strong> 14 business days</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Complaints</h4>
                    <p className="text-gray-700">
                      If you have a complaint about our handling of your personal data or any other aspect of our Services, please contact our DPO first. If you are not satisfied with our response, you have the right to lodge a complaint with the relevant supervisory authority as outlined in Section 14.2.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <p className="text-center text-gray-500 text-sm">
                    These Terms of Service are provided in compliance with applicable data protection regulations and consumer protection laws.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
