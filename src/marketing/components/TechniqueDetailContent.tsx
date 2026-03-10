"use client";

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CTASection from '@/marketing/components/CTASection';

// Move map to shared or props if needed, but safe here for rendering logic if id is passed
const techniqueMap: Record<string, string> = {
  'myofascial': 'technique.myofascial',
  'kinesio': 'technique.kinesio',
  'reflexology': 'technique.reflexology',
  'lymphatic': 'technique.lymphatic',
  'craniosacral': 'technique.craniosacral',
  'acupressure': 'technique.acupressure'
};

interface TechniqueDetailContentProps {
  id: string;
}

export default function TechniqueDetailContent({ id }: TechniqueDetailContentProps) {
  const { t } = useLanguage();
  
  // Handled in page.tsx technically, but good for safety
  if (!techniqueMap[id]) {
    return (
      <div className="min-h-screen pt-32 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Technique not found</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          {t('common.back')}
        </Link>
      </div>
    );
  }

  const baseKey = techniqueMap[id];

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/#techniques" 
          className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-colors" />
          {t('common.back')}
        </Link>
        
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 mb-6">
            {t(`${baseKey}.title`)}
          </h1>
          
          <div className="prose prose-lg text-gray-600 max-w-none">
            <p>
              {t(`${baseKey}.desc`)}
            </p>
          </div>
          
          <div className="mt-12 p-8 bg-white rounded-3xl  border border-orange-100">
             <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('technique.why')}</h3>
             <p className="text-gray-600">
                {t(`${baseKey}.why`)}
             </p>
          </div>
        </motion.div>
      </div>
      
      <CTASection />
    </div>
  );
}
