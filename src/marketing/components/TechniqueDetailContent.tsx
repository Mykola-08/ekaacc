'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CTASection from '@/marketing/components/CTASection';

// Move map to shared or props if needed, but safe here for rendering logic if id is passed
const techniqueMap: Record<string, string> = {
  myofascial: 'technique.myofascial',
  kinesio: 'technique.kinesio',
  reflexology: 'technique.reflexology',
  lymphatic: 'technique.lymphatic',
  craniosacral: 'technique.craniosacral',
  acupressure: 'technique.acupressure',
};

interface TechniqueDetailContentProps {
  id: string;
}

export default function TechniqueDetailContent({ id }: TechniqueDetailContentProps) {
  const { t } = useLanguage();

  // Handled in page.tsx technically, but good for safety
  if (!techniqueMap[id]) {
    return (
      <div className="min-h-screen px-4 pt-32 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Technique not found</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
          {t('common.back')}
        </Link>
      </div>
    );
  }

  const baseKey = techniqueMap[id];

  return (
    <div className="px-4 pt-24 pb-16">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/#techniques"
          className="group mb-8 inline-flex items-center text-gray-600 transition-colors hover:text-blue-600"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transition-colors" />
          {t('common.back')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {t(`${baseKey}.title`)}
          </h1>

          <div className="prose prose-lg max-w-none text-gray-600">
            <p>{t(`${baseKey}.desc`)}</p>
          </div>

          <div className="mt-12 rounded-3xl border border-orange-100 bg-white p-8">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">{t('technique.why')}</h3>
            <p className="text-gray-600">{t(`${baseKey}.why`)}</p>
          </div>
        </motion.div>
      </div>

      <CTASection />
    </div>
  );
}
