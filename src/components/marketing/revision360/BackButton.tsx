'use client';

import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function BackButton() {
  const { t } = useLanguage();
  const router = useRouter();

  const handleBack = () => {
    // If there is history, go back. Otherwise go to home.
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <motion.button
      onClick={handleBack}
      className="fixed top-4 left-4 z-50 flex items-center space-x-2 rounded-lg border border-vip-gold-1/30 bg-card/90 px-3 py-2 text-vip-gold-4 shadow-lg backdrop-blur-sm sm:top-6 sm:left-6 sm:px-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="text-sm font-medium">{t('back.return')}</span>
    </motion.button>
  );
}
