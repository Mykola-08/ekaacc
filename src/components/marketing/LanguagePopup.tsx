import { useLanguage } from '@/context/marketing/LanguageContext';
import { Language } from '@/context/marketing/LanguageTypes';
import { X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguagePopup() {
  const { showLanguagePopup, setShowLanguagePopup, confirmLanguage, t } = useLanguage();

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
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-md rounded-[20px] border border-gray-100 bg-white p-8 shadow-2xl"
        >
          <button
            onClick={() => setShowLanguagePopup(false)}
            className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="mb-8 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-gray-900">
              {t('language.popup.title')}
            </h2>
            <p className="text-gray-600">{t('language.popup.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => confirmLanguage(lang.code)}
                className="group flex items-center rounded-xl border-2 border-gray-100 p-4 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50"
              >
                <span className="mr-4 text-2xl">{lang.flag}</span>
                <span className="font-medium text-gray-700 group-hover:text-blue-700">
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
