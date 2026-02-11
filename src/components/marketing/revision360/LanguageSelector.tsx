import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { Language } from '@/context/marketing/LanguageTypes';

interface LanguageOption {
  code: Language;
  name: string; // This will be a translation key
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'ca', name: 'lang.catalan', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  { code: 'en', name: 'lang.english', flag: '🇬🇧' },
  { code: 'es', name: 'lang.spanish', flag: '🇪🇸' },
  { code: 'ru', name: 'lang.russian', flag: '🇷🇺' },
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg border border-vip-gold-1/20 bg-card/60 px-3 py-2 text-vip-gold-4 backdrop-blur-sm transition-all duration-200 hover:border-vip-gold-1/40 hover:bg-card/80"
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {currentLanguage?.flag} {currentLanguage ? t(currentLanguage.name) : 'Català'}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 bottom-full z-50 mb-2 w-40 overflow-hidden rounded-lg border border-vip-gold-1/20 bg-card shadow-xl"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex w-full items-center space-x-3 px-4 py-2 text-left text-sm transition-colors duration-150 ${
                    language === lang.code
                      ? 'bg-warning/10 text-vip-gold-4'
                      : 'text-muted-foreground hover:bg-card hover:text-vip-gold-2'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{t(lang.name)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
