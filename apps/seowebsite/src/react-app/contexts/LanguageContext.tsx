'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { servicesTranslations } from './TranslationExtensions';
import { revision360Translations } from './Revision360Translations';
import { techniqueTranslations } from './TechniqueTranslations';

import { translations } from './translations';
import { Language, LanguageContextType } from './LanguageTypes';

// Types are imported for internal use, but not re-exported to avoid HMR issues.
// Import types directly from './LanguageTypes'.

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation files
// Detect browser language
const detectBrowserLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';
  const browserLang = navigator.language.toLowerCase();

  if (browserLang.startsWith('ca')) return 'ca';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('en')) return 'en';

  // Default to English for unsupported languages
  return 'en';
};

// Get language from localStorage or detect browser language
const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('eka-language') as Language;
    if (saved && ['ca', 'en', 'es', 'ru'].includes(saved)) {
      return saved;
    }
    return detectBrowserLanguage();
  }
  return 'en';
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [languageConfirmed, setLanguageConfirmed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('eka-language-confirmed') === 'true';
    }
    return false;
  });

  const confirmLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('eka-language-confirmed', 'true');
    setLanguageConfirmed(true);
    setShowLanguagePopup(false);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eka-language', lang);
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    // First check main translations, then extended translations
    let text = (translations[language] as Record<string, string>)?.[key] ||
      (servicesTranslations[language] as Record<string, string>)?.[key] ||
      (revision360Translations[language] as Record<string, string>)?.[key] ||
      (techniqueTranslations[language] as Record<string, string>)?.[key] ||
      (translations.en as Record<string, string>)?.[key] ||
      (servicesTranslations.en as Record<string, string>)?.[key] ||
      (revision360Translations.en as Record<string, string>)?.[key] ||
      (techniqueTranslations.en as Record<string, string>)?.[key] ||
      key;

    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        text = text.replace(new RegExp(`{${paramKey}}`, 'g'), String(value));
      });
    }

    return text;
  };

  useEffect(() => {
    // Set HTML lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      showLanguagePopup,
      setShowLanguagePopup,
      confirmLanguage,
      languageConfirmed
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

 
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

