'use client';

import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { motion, useScroll, useSpring } from 'framer-motion';
import { iosSpring } from '@/lib/ui-utils';
import React from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: iosSpring }
};

export default function CookiePolicy() {
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
              {t('footer.cookiePolicy')}
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
                This Cookie Policy explains how we use cookies and similar technologies on our website in compliance with GDPR requirements.
              </p>
            </motion.div>

            {/* What Cookies Are */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-16">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6 tracking-tight">
                1. What Cookies Are (GDPR Article 4(11))
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-6">
                Cookies are small text files stored on your device when you visit our website. They help us provide, secure, and improve our Services.
              </p>
              
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mt-6">
                 <p className="text-blue-800 text-lg">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                 </p>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-8 mt-12">
              <p className="text-center text-slate-400 text-sm">
                This Cookie Policy is provided in compliance with the General Data Protection Regulation (EU) 2016/679.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
