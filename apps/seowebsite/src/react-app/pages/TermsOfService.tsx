import SEOOptimized from '@/react-app/components/SEOOptimized';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function TermsOfService() {
  const { t } = useLanguage();
  
  return (
    <SEOOptimized
      title="Terms of Service - EKA Balance"
      description="Terms of Service for EKA Balance wellness center"
      url="https://ekabalance.com/terms-of-service"
    >
      
        <div className="min-h-screen bg-muted/30 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <div className="bg-card rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                  <p className="text-foreground/90 leading-relaxed text-lg">
                    These Terms govern your access to and use of the EKA Balance website, applications, and services ("Services"). By using the Services, you agree to these Terms in full. If you do not agree, please discontinue use immediately.
                  </p>
                </div>

                {/* Acceptance and Consent */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    1. Acceptance and Consent
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-6">
                    By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. Your use of the Services constitutes explicit consent to:
                  </p>
                  <ul className="space-y-3 text-foreground/90 mb-6">
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
                  <p className="text-foreground/90 leading-relaxed">
                    If you do not agree to these Terms or our Privacy Policy, you must not access or use our Services.
                  </p>
                </div>

                {/* Eligibility and Age Requirements */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    2. Eligibility and Age Requirements
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-6">
                    By using the Services, you confirm that:
                  </p>
                  <ul className="space-y-3 text-foreground/90 mb-6">
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
                    <p className="text-foreground/90">
                      <strong>Parental Consent:</strong> If you are under 16 years of age, you may not use our Services. If you are between 16-18 years of age, you may only use our Services with the consent of your parent or legal guardian who must review and accept these Terms and our Privacy Policy on your behalf.
                    </p>
                  </div>
                </div>

                {/* Nature of Services */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    3. Nature of Services
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-6">
                    EKA Balance provides wellness and kinesiology services. Our services are:
                  </p>
                  <ul className="space-y-3 text-foreground/90 mb-6">
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
                    <p className="text-foreground/90">
                      <strong>Important:</strong> You acknowledge that all decisions based on information from EKA Balance are made at your own risk.
                    </p>
                  </div>
                </div>

              <h2>4. User Responsibilities and Data Protection Obligations</h2>
              <p>You agree to:</p>
              <ul>
                <li>Keep your account credentials secure and confidential</li>
                <li>Use the Services lawfully and ethically in accordance with applicable data protection laws</li>
                <li>Not engage in harmful activities including:
                  <ul>
                    <li>Malware distribution or security breaches</li>
                    <li>Unauthorized access attempts or hacking</li>
                    <li>Data scraping, harvesting, or unauthorized data collection</li>
                    <li>Spam, phishing, or abusive behavior</li>
                    <li>Impersonation, identity theft, or fraud</li>
                    <li>Any activity that violates GDPR or other data protection laws</li>
                  </ul>
                </li>
                <li>Provide accurate, complete, and up-to-date information for bookings and communications</li>
                <li>Respect intellectual property rights and data privacy rights of others</li>
                <li>Notify us immediately of any unauthorized use of your account or security breach</li>
                <li>Ensure that any personal data you provide about third parties is done so with their consent and in compliance with applicable laws</li>
              </ul>

              <h3>4.1 Data Protection Responsibilities</h3>
              <p>When using our Services, you acknowledge that:</p>
              <ul>
                <li>You are responsible for the accuracy of personal data you provide</li>
                <li>You must not share sensitive personal data unless specifically requested and necessary for service provision</li>
                <li>You have the right to access, correct, or delete your personal data as outlined in our Privacy Policy</li>
                <li>We will process your personal data in accordance with our Privacy Policy and applicable data protection laws</li>
              </ul>

              <h2>5. Intellectual Property</h2>
              <p>All content, branding, materials, designs, text, images, logos, and software on the Services are owned by EKA Balance or licensed third parties. You may not:</p>
              <ul>
                <li>Copy, reproduce, or redistribute content without written consent</li>
                <li>Use our trademarks or branding</li>
                <li>Create derivative works</li>
                <li>Reverse engineer our software</li>
              </ul>

              <h2>6. Bookings, Payments, and Data Processing</h2>

              <h3>6.1 Booking Confirmation and Data Processing Consent</h3>
              <p>By booking a session, you explicitly consent to:</p>
              <ul>
                <li>Processing of your personal data for booking, payment, and service delivery purposes</li>
                <li>Storage of your health and wellness data for session planning and progress tracking</li>
                <li>Communication via email, phone, or messaging for appointment confirmations and reminders</li>
                <li>Recording and retention of session notes and progress data as required by professional standards</li>
                <li>Sharing of relevant health information with other healthcare providers only with your explicit consent</li>
              </ul>
              <p>You acknowledge that you have the right to withdraw this consent at any time, subject to legal and contractual limitations.</p>

              <h3>6.2 Payment Terms</h3>
              <ul>
                <li>All prices are in Euros (€) unless otherwise stated</li>
                <li>Payment is required at the time of booking</li>
                <li>We accept payment methods as displayed during checkout</li>
                <li>Payment processing is handled by secure third-party providers</li>
              </ul>

              <h3>6.3 Cancellations and Refunds</h3>
              <ul>
                <li>Cancellations made with at least 24 hours' notice may receive a full refund</li>
                <li>Cancellations with less than 24 hours' notice are non-refundable</li>
                <li>No-shows will not receive refunds</li>
                <li>Refunds are processed within 7-14 business days</li>
                <li>We reserve the right to cancel or reschedule sessions with full refund</li>
              </ul>

              <h2>7. Service Modifications</h2>
              <p>We reserve the right to:</p>
              <ul>
                <li>Add, remove, or modify features at any time</li>
                <li>Change pricing with reasonable notice</li>
                <li>Suspend or discontinue services</li>
                <li>Update these Terms without prior notice</li>
              </ul>

              <h2>8. Account Termination and Data Handling</h2>
              <p>We may suspend or terminate your account if you:</p>
              <ul>
                <li>Breach these Terms or our Privacy Policy</li>
                <li>Engage in fraudulent activity or data misuse</li>
                <li>Violate applicable laws, including data protection regulations</li>
                <li>Harm or attempt to harm our systems, data, or other users</li>
                <li>Fail to provide required information or cooperate with data protection requirements</li>
              </ul>
              
              <h3>8.1 Account Closure by User</h3>
              <p>You may close your account at any time by contacting us at <a href="mailto:dpo@ekabalance.com">dpo@ekabalance.com</a>. Upon account closure:</p>
              <ul>
                <li>We will delete or anonymize your personal data in accordance with our Privacy Policy</li>
                <li>Certain data may be retained as required by law or legitimate business interests</li>
                <li>You will lose access to all account features and historical data</li>
                <li>Any ongoing services or bookings will be cancelled</li>
              </ul>

              <h3>8.2 Data Retention After Termination</h3>
              <p>Following account termination, we may retain certain data as required by:</p>
              <ul>
                <li>Legal and regulatory obligations (tax, accounting, healthcare regulations)</li>
                <li>Contractual obligations and dispute resolution</li>
                <li>Legitimate business interests (fraud prevention, security)</li>
                <li>Statute of limitations for potential legal claims</li>
              </ul>
              <p>All retained data will continue to be protected in accordance with our Privacy Policy and applicable data protection laws.</p>

              <h2>9. Disclaimers</h2>
              <p>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
              <ul>
                <li>Merchantability</li>
                <li>Fitness for a particular purpose</li>
                <li>Non-infringement</li>
                <li>Accuracy or completeness</li>
                <li>Uninterrupted or error-free operation</li>
              </ul>

              <h2>10. Limitation of Liability</h2>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, EKA BALANCE AND ITS OWNER SHALL NOT BE LIABLE FOR:</p>
              <ul>
                <li>Data loss or corruption</li>
                <li>Service interruptions or failures</li>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, revenue, or goodwill</li>
                <li>Personal injury or property damage</li>
                <li>Actions or omissions by third parties</li>
                <li>Reliance on any information provided through the Services</li>
              </ul>
              <p>IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT PAID BY YOU FOR THE SERVICES IN THE PAST 12 MONTHS.</p>

              <h2>11. Indemnification</h2>
              <p>You agree to indemnify, defend, and hold harmless EKA Balance, its owner, employees, and collaborators from any claims, losses, damages, liabilities, costs, or expenses (including legal fees) arising from:</p>
              <ul>
                <li>Your use or misuse of the Services</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any rights of third parties</li>
                <li>Your negligence or willful misconduct</li>
              </ul>

              <h2>12. Data Protection and Privacy Rights</h2>
              <p>By using the Services, you acknowledge and consent to the collection, storage, and processing of your personal data as outlined in our Privacy Policy and Cookie Policy. You retain all rights under applicable data protection laws, including:</p>
              <ul>
                <li>The right to access your personal data</li>
                <li>The right to correct inaccurate data</li>
                <li>The right to request deletion of your data (right to be forgotten)</li>
                <li>The right to restrict or object to processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time</li>
                <li>The right to lodge a complaint with a supervisory authority</li>
              </ul>
              
              <h3>12.1 Data Processing Purposes</h3>
              <p>Your personal data is processed for the following purposes:</p>
              <ul>
                <li>Providing and improving our wellness services</li>
                <li>Processing payments and managing bookings</li>
                <li>Communicating with you about your appointments and services</li>
                <li>Maintaining health and safety records as required by law</li>
                <li>Complying with legal and regulatory obligations</li>
                <li>Protecting our legitimate business interests</li>
              </ul>

              <h3>12.2 Data Retention</h3>
              <p>Personal data is retained only as long as necessary for the purposes stated in our Privacy Policy and as required by applicable laws. Specific retention periods are outlined in our Privacy Policy.</p>

              <h3>12.3 International Data Transfers</h3>
              <p>Your data may be transferred to and processed in countries outside the European Economic Area. We implement appropriate safeguards for such transfers as described in our Privacy Policy.</p>

              <h3>12.4 Data Security</h3>
              <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction as described in our Privacy Policy.</p>

              <h3>12.5 Contact for Privacy Matters</h3>
              <p>For any privacy-related questions or to exercise your data protection rights, please contact our Data Protection Officer at <a href="mailto:dpo@ekabalance.com">dpo@ekabalance.com</a>.</p>

              <h2>13. Third-Party Services</h2>
              <p>The Services may contain links to or integrate with third-party websites, applications, or services. We are not responsible for:</p>
              <ul>
                <li>The content or policies of external sites</li>
                <li>The availability or security of third-party services</li>
                <li>Actions taken by third parties</li>
              </ul>

              <h2>14. Governing Law, Jurisdiction, and Data Protection</h2>
              <p>These Terms are governed by and construed in accordance with the laws of Spain, including but not limited to:</p>
              <ul>
                <li>General Data Protection Regulation (GDPR) (EU) 2016/679</li>
                <li>Spanish Organic Law 3/2018 on Data Protection and Digital Rights Guarantee</li>
                <li>Spanish Civil Code and Commercial Code</li>
                <li>Consumer protection laws and regulations</li>
              </ul>

              <h3>14.1 Jurisdiction</h3>
              <p>Any disputes arising from or relating to these Terms, including data protection matters, will be resolved exclusively by the courts of Barcelona, Spain, subject to mandatory consumer protection laws that may apply in your jurisdiction.</p>

              <h3>14.2 Data Protection Authority</h3>
              <p>You have the right to lodge a complaint with the Spanish data protection authority:</p>
              <p><strong>Agencia Española de Protección de Datos (AEPD)</strong><br/>
              C/ Jorge Juan, 6, 28001 Madrid, Spain<br/>
              Website: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a><br/>
              Phone: +34 901 100 099 / +34 91 266 35 17</p>
              <p>You may also contact the supervisory authority in your country of habitual residence or place of work.</p>

              <h2>15. Dispute Resolution and Data Protection Complaints</h2>
              <p>Before initiating legal proceedings, parties agree to attempt resolution through good-faith negotiation. If negotiation fails within 30 days, either party may pursue legal remedies.</p>

              <h3>15.1 Data Protection Complaints</h3>
              <p>For complaints specifically related to data protection and privacy:</p>
              <ul>
                <li>Contact our Data Protection Officer at <a href="mailto:dpo@ekabalance.com">dpo@ekabalance.com</a> first</li>
                <li>We will investigate and respond within 30 days of receiving your complaint</li>
                <li>If you are not satisfied with our response, you have the right to lodge a complaint with the relevant supervisory authority</li>
                <li>You may also seek judicial remedy for data protection violations</li>
              </ul>

              <h3>15.2 Alternative Dispute Resolution</h3>
              <p>Where applicable, you may have the right to use alternative dispute resolution mechanisms for consumer disputes, including those related to data protection.</p>

              <h2>16. Severability</h2>
              <p>If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will continue in full force and effect.</p>

              <h2>17. Entire Agreement</h2>
              <p>These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and EKA Balance regarding the Services.</p>

              <h2>18. Contact Information and Data Protection Inquiries</h2>
              <p>For questions about these Terms, privacy matters, or data protection inquiries:</p>
              
              <h3>18.1 Data Protection Officer (DPO)</h3>
              <p><strong>Name:</strong> Olena Kucherova Dryzhak<br/>
              <strong>Email:</strong> <a href="mailto:dpo@ekabalance.com">dpo@ekabalance.com</a><br/>
              <strong>Phone:</strong> +34 658 867 133<br/>
              <strong>Address:</strong> Calle Plata 1, 08191 Rubí, Barcelona, Spain</p>
              <p>The DPO is your primary contact for all data protection matters, privacy inquiries, and exercising your data subject rights.</p>

              <h3>18.2 Legal and General Inquiries</h3>
              <p><strong>Email:</strong> <a href="mailto:legal@ekabalance.com">legal@ekabalance.com</a><br/>
              <strong>Address:</strong> Calle Plata 1, 08191 Rubí, Barcelona, Spain<br/>
              <strong>Phone:</strong> +34 658 867 133</p>

              <h3>18.3 Response Times</h3>
              <p>We aim to respond to all inquiries within:</p>
              <ul>
                <li><strong>Data protection inquiries:</strong> 30 days (as required by GDPR)</li>
                <li><strong>General inquiries:</strong> 7 business days</li>
                <li><strong>Legal matters:</strong> 14 business days</li>
              </ul>

                {/* Contact Information */}
                <div className="mb-12">
                  <h2 className="text-xl font-medium text-foreground mb-6 border-b border-gray-200 pb-4">
                    18. Contact Information and Data Protection Inquiries
                  </h2>
                  <p className="text-foreground/90 leading-relaxed mb-6">
                    For questions about these Terms, privacy matters, or data protection inquiries:
                  </p>

                  <div className="grid gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
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
                        The DPO is your primary contact for all data protection matters, privacy inquiries, and exercising your data subject rights.
                      </p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="text-lg font-medium text-foreground mb-4">Legal and General Inquiries</h3>
                      <div className="space-y-3">
                        <div className="flex">
                          <span className="font-medium text-foreground w-20">Email:</span>
                          <a href="mailto:legal@ekabalance.com" className="text-blue-600 hover:text-blue-800">legal@ekabalance.com</a>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-foreground w-20">Address:</span>
                          <span className="text-foreground/90">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                        </div>
                        <div className="flex">
                          <span className="font-medium text-foreground w-20">Phone:</span>
                          <span className="text-foreground/90">+34 658 867 133</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6 border border-green-100 mt-6">
                    <h4 className="font-medium text-foreground mb-3">Response Times</h4>
                    <p className="text-foreground/90 mb-4">We aim to respond to all inquiries within:</p>
                    <ul className="space-y-2 text-foreground/90">
                      <li>• <strong>Data protection inquiries:</strong> 30 days (as required by GDPR)</li>
                      <li>• <strong>General inquiries:</strong> 7 business days</li>
                      <li>• <strong>Legal matters:</strong> 14 business days</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200 mt-6">
                    <h4 className="font-medium text-foreground mb-3">Complaints</h4>
                    <p className="text-foreground/90">
                      If you have a complaint about our handling of your personal data or any other aspect of our Services, please contact our DPO first. If you are not satisfied with our response, you have the right to lodge a complaint with the relevant supervisory authority as outlined in Section 14.2.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-8 mt-12">
                  <p className="text-center text-muted-foreground text-sm">
                    These Terms of Service are provided in compliance with applicable data protection regulations and consumer protection laws.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
    </SEOOptimized>
  );
}

