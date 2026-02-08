
export type Language = 'ca' | 'en' | 'es' | 'ru';

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, params?: Record<string, string | number>) => string;
    showLanguagePopup: boolean;
    setShowLanguagePopup: (show: boolean) => void;
    confirmLanguage: (lang: Language) => void;
    languageConfirmed: boolean;
}

