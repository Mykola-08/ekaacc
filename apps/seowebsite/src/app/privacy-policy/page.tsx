'use client';

import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { motion, useScroll, useSpring } from 'framer-motion';
import { iosSpring } from '@/lib/ui-utils';
import { cn } from '@/lib/utils';
import React from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: iosSpring }
};

export default function PrivacyPolicy() {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  return (
    <div className="min-h-screen bg-white">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-20">
        <div className="bg-white">
          {/* Header */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className="bg-white px-0 py-10 mb-8 border-b border-gray-100"
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-slate-900">
              {t('footer.privacyPolicy')}
            </h1>
            <div className="flex items-center text-slate-500 text-sm font-medium">
              <span>{t('policy.lastUpdated')}</span>
              <span className="ml-2 bg-slate-100 px-3 py-1 rounded-full text-slate-700">November 15, 2025</span>
            </div>
          </motion.div>

          {/* Content */}
          <div className="px-0 py-0 text-slate-900">
            {/* Introduction */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <p className="text-slate-600 leading-relaxed text-xl font-normal">
                This Privacy Policy explains how we collect, use, process, store, protect, and share data when you access or use our website, applications, and services ("Services"). By using the Services, you agree to this Policy.
              </p>
            </motion.div>

            {/* Data Controller */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 mb-8 tracking-tight">
                Data Controller
              </h2>
              <div className="space-y-4 text-slate-600 font-normal text-lg">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Name:</span>
                  <span>Olena Kucherova Dryzhak (EKA Balance)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Address:</span>
                  <span>Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Phone:</span>
                  <span>+34 658 867 133</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Email:</span>
                  <a href="mailto:legal@ekabalance.com" className="text-blue-600 hover:text-blue-700 transition-colors font-medium border-b border-blue-600/20 hover:border-blue-600">
                    legal@ekabalance.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Data Protection Officer */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 mb-8 tracking-tight">
                Data Protection Officer (DPO)
              </h2>
              <div className="bg-slate-50/80 backdrop-blur-sm rounded-2xl p-8 space-y-4 border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Name:</span>
                  <span className="text-slate-700">Olena Kucherova Dryzhak</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Address:</span>
                  <span className="text-slate-700">Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Email:</span>
                  <a href="mailto:dpo@ekabalance.com" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                    dpo@ekabalance.com
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
                  <span className="font-semibold text-slate-900 w-32 flex-shrink-0">Phone:</span>
                  <span className="text-slate-700">+34 658 867 133</span>
                </div>
              </div>
              <p className="text-slate-500 mt-6 leading-relaxed text-sm">
                You may contact our DPO directly for any privacy-related inquiries, complaints, or to exercise your data protection rights.
              </p>
            </motion.div>

            {/* Data Collection */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 tracking-tight">
                1. Data We Collect
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                We collect all types of personal, technical, behavioral, and sensitive data, including but not limited to the following:
              </p>

              <div className="space-y-8">
                <div className="border-l-2 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">1.1 Personal Identification Data</h3>
                  <ul className="space-y-3 text-slate-700">
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

                <div className="border-l-2 border-red-400 pl-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">1.2 Sensitive & Special Category Data</h3>
                  <p className="text-slate-600 mb-4">We may collect special categories of personal data where permitted by law, including:</p>
                  <ul className="space-y-3 text-slate-700">
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
            </motion.div>

            {/* Legal Basis */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 tracking-tight">
                2. Legal Basis for Processing (GDPR Article 6)
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                We process personal data based on the following legal grounds:
              </p>
              
              <div className="grid gap-6">
                <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                  <h3 className="text-lg font-semibold text-emerald-900 mb-3">2.1 Consent (Article 6(1)(a))</h3>
                  <p className="text-emerald-800 mb-4">We rely on your explicit consent for:</p>
                  <ul className="space-y-2 text-emerald-700">
                    <li>• Marketing communications (emails, newsletters, promotional offers)</li>
                    <li>• Non-essential cookies and tracking technologies</li>
                    <li>• Processing of special categories of health data (Article 9(2)(a))</li>
                    <li>• Automated decision-making and profiling activities</li>
                  </ul>
                  <p className="text-emerald-600 mt-4 text-sm font-medium">You may withdraw your consent at any time without affecting the lawfulness of processing based on consent before its withdrawal.</p>
                </div>

                <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">2.2 Contractual Necessity (Article 6(1)(b))</h3>
                  <p className="text-blue-800 mb-4">Processing is necessary for:</p>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Providing our wellness services as requested</li>
                    <li>• Processing payments and managing bookings</li>
                    <li>• Creating and managing your user account</li>
                    <li>• Delivering customer support and responding to inquiries</li>
                  </ul>
                </div>

                <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">2.3 Legal Obligations (Article 6(1)(c))</h3>
                  <p className="text-purple-800 mb-4">Processing is necessary to comply with:</p>
                  <ul className="space-y-2 text-purple-700">
                    <li>• Tax and accounting regulations</li>
                    <li>• Health and safety requirements</li>
                    <li>• Consumer protection laws</li>
                    <li>• Data retention obligations</li>
                  </ul>
                </div>

                <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="text-lg font-semibold text-amber-900 mb-3">2.4 Legitimate Interests (Article 6(1)(f))</h3>
                  <p className="text-amber-800 mb-4">We process data based on our legitimate interests, which include:</p>
                  <ul className="space-y-2 text-amber-700">
                    <li>• Improving and optimizing our services and website performance</li>
                    <li>• Preventing fraud and ensuring network security</li>
                    <li>• Direct marketing to existing customers (soft opt-in)</li>
                    <li>• Statistical analysis and service improvement</li>
                  </ul>
                  <p className="text-amber-600 mt-4 text-sm font-medium">We conduct balancing tests to ensure our legitimate interests do not override your fundamental rights and freedoms.</p>
                </div>
              </div>
            </motion.div>

            {/* User Rights */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 tracking-tight">
                3. Your Rights Under GDPR (Articles 12-22)
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                As a data subject, you have the following rights under the GDPR:
              </p>

              <div className="space-y-6">
                <div className="border border-slate-200 rounded-2xl p-8 hover:border-blue-200 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">3.1 Right of Access (Article 15)</h3>
                  <p className="text-slate-600 mb-4">You have the right to obtain:</p>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Confirmation of whether we process your personal data</li>
                    <li>• Access to your personal data and information about processing purposes, categories, recipients, retention periods, and your rights</li>
                  </ul>
                  <div className="bg-slate-50 rounded-xl p-4 mt-6">
                    <p className="text-sm text-slate-500"><strong>Response Time:</strong> We will respond within 30 days of receiving your request.</p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:border-blue-200 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">3.2 Right to Erasure ('Right to be Forgotten') (Article 17)</h3>
                  <p className="text-slate-600 mb-4">You have the right to obtain the erasure of personal data concerning you where one of the following grounds applies:</p>
                  <ul className="space-y-2 text-slate-700">
                    <li>• The personal data is no longer necessary for the purposes for which it was collected</li>
                    <li>• You withdraw consent and there is no other legal ground for processing</li>
                    <li>• You object to processing and there are no overriding legitimate grounds</li>
                    <li>• The personal data has been unlawfully processed</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-2xl p-8 hover:border-blue-200 transition-colors duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">3.3 Right to Data Portability (Article 20)</h3>
                  <p className="text-slate-600 mb-4">You have the right to receive your personal data in a structured, commonly used, and machine-readable format and have the right to transmit that data to another controller where:</p>
                  <ul className="space-y-2 text-slate-700">
                    <li>• The processing is based on consent or contractual necessity</li>
                    <li>• The processing is carried out by automated means</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50/50 rounded-2xl p-8 mt-8 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-3">Exercising Your Rights</h4>
                <p className="text-blue-800 mb-4">To exercise any of your rights, please contact us:</p>
                <div className="space-y-2 text-blue-700">
                  <div className="flex">
                    <span className="font-medium w-24">Email:</span>
                    <a href="mailto:dpo@ekabalance.com" className="hover:text-blue-900 underline decoration-blue-300 underline-offset-4">dpo@ekabalance.com</a>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Mail:</span>
                    <span>Data Protection Officer, Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">Phone:</span>
                    <span>+34 658 867 133</span>
                  </div>
                </div>
                <p className="text-blue-600 mt-6 text-sm">
                  <strong>Verification:</strong> We may request additional information to verify your identity before processing your request. This is to protect your personal data from unauthorized access.
                </p>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 tracking-tight">
                Contact Information and Complaints
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                For privacy inquiries, exercising your rights, or making complaints:
              </p>

              <div className="grid gap-6">
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Protection Officer (DPO)</h3>
                  <div className="space-y-3 text-slate-600">
                    <div className="flex">
                      <span className="font-medium text-slate-900 w-20">Name:</span>
                      <span>Olena Kucherova Dryzhak</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-slate-900 w-20">Email:</span>
                      <a href="mailto:dpo@ekabalance.com" className="text-blue-600 hover:text-blue-700">dpo@ekabalance.com</a>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-slate-900 w-20">Phone:</span>
                      <span>+34 658 867 133</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-slate-900 w-20">Address:</span>
                      <span>Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
                    </div>
                  </div>
                  <p className="text-slate-500 mt-6 text-sm">
                    The DPO is your primary contact for all data protection matters and will respond to your inquiry within 30 days.
                  </p>
                </div>

                <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Supervisory Authority</h3>
                  <p className="text-red-800 mb-4">
                    If you are not satisfied with our response or believe your data protection rights have been violated, you have the right to lodge a complaint with the supervisory authority:
                  </p>
                  <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-red-700 hover:text-red-900 font-medium underline decoration-red-300 underline-offset-4">
                    Agencia Española de Protección de Datos (AEPD)
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
