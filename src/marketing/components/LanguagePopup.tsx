import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Language } from '@/marketing/contexts/LanguageTypes';
import { X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollLock } from '@/marketing/hooks/useScrollLock';

export default function LanguagePopup() {
    const { showLanguagePopup, setShowLanguagePopup, confirmLanguage, t } = useLanguage();

    useScrollLock(showLanguagePopup);

    if (!showLanguagePopup) return null;

    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'ca', label: 'Català', flag: '🇦🇩' },
        { code: 'es', label: 'Español', flag: '🇪🇸' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' }
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowLanguagePopup(false)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-3xl  max-w-md w-full p-8 relative border border-gray-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setShowLanguagePopup(false)}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Globe className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {t('language.popup.title')}
                        </h2>
                        <p className="text-gray-600">
                            {t('language.popup.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => confirmLanguage(lang.code)}
                                className="flex items-center p-4 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition duration-200 group"
                            >
                                <span className="text-2xl mr-4">{lang.flag}</span>
                                <span className="font-medium text-gray-700 group-hover:text-primary">
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
