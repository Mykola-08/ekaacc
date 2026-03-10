import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Language } from '@/marketing/contexts/LanguageTypes';

interface LanguageOption {
  code: Language;
  name: string; // This will be a translation key
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'ca', name: 'lang.catalan', flag: '🏴󠁥󠁳󠁣󠁴󠁿' },
  { code: 'en', name: 'lang.english', flag: '🇬🇧' },
  { code: 'es', name: 'lang.spanish', flag: '🇪🇸' },
  { code: 'ru', name: 'lang.russian', flag: '🇷🇺' }
];

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-zinc-800/60 border border-amber-500/20 text-amber-200 rounded-lg backdrop-blur-md hover:bg-zinc-800/80 hover:border-amber-500/40 transition duration-200 shadow-sm"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentLanguage?.flag} {currentLanguage ? t(currentLanguage.name) : 'Català'}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-full right-0 mb-3 w-48 bg-zinc-900/85 backdrop-blur-xl border border-amber-500/30 rounded-xl overflow-hidden z-[100] shadow-2xl ring-1 ring-white/5"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="p-1.5 space-y-0.5">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={"w-full text-left px-3 py-2.5 text-sm flex items-center space-x-3 transition-all duration-200 rounded-lg " + (
                    language === lang.code
                      ? 'bg-amber-500/15 text-amber-200 font-medium'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-amber-100'
                  )}
                >
                  <span className="text-base">{lang.flag}</span>
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
