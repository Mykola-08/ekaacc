import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Language } from '@/marketing/contexts/LanguageTypes';
import { X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '@/hooks/use-scroll-lock';

import { useEffect } from 'react';

export default function LanguagePopup() {
  const { showLanguagePopup, setShowLanguagePopup, confirmLanguage, t } = useLanguage();

  const { lock, unlock } = useScrollLock({ autoLock: false });
  useEffect(() => {
    if (showLanguagePopup) lock();
    else unlock();
  }, [showLanguagePopup, lock, unlock]);

  if (!showLanguagePopup) return null;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'ca', label: 'Català', flag: '🇦🇩' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) setShowLanguagePopup(false);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-[340px] rounded-[2rem] border border-gray-100 bg-white p-6 shadow-2xl"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setShowLanguagePopup(false)}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="mb-4 text-center">
            <div className="bg-primary/5 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full">
              <Globe className="text-primary h-5 w-5" />
            </div>
            <h2 className="mb-0.5 text-lg leading-tight font-medium tracking-tight text-gray-900">
              {t('language.popup.title')}
            </h2>
            <p className="text-xs leading-tight text-gray-500">{t('language.popup.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => confirmLanguage(lang.code)}
                className="hover:border-primary/20 hover:bg-primary/5 group flex items-center rounded-xl border border-gray-100/80 p-2 transition duration-200"
              >
                <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-gray-50 text-base transition-colors group-hover:bg-white">
                  {lang.flag}
                </span>
                <span className="group-hover:text-primary text-xs font-medium text-gray-700 transition-colors">
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
