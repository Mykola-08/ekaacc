import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Language } from '@/react-app/contexts/LanguageTypes';
import { X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LanguagePopup() {
    const { showLanguagePopup, setShowLanguagePopup, confirmLanguage, t } = useLanguage();

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
                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card rounded-3xl shadow-2xl max-w-md w-full p-8 relative border border-gray-100"
                >
                    <button
                        onClick={() => setShowLanguagePopup(false)}
                        className="absolute top-4 right-4 p-2 text-muted-foreground/80 hover:text-muted-foreground rounded-full hover:bg-muted transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" aria-hidden="true" />
                    </button>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Globe className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-foreground mb-2">
                            {t('language.popup.title')}
                        </h2>
                        <p className="text-muted-foreground">
                            {t('language.popup.subtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => confirmLanguage(lang.code)}
                                className="flex items-center p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                            >
                                <span className="text-2xl mr-4">{lang.flag}</span>
                                <span className="font-medium text-foreground/90 group-hover:text-blue-700">
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

