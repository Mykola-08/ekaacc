'use client';

import { useLanguage } from '@/context/marketing/LanguageContext';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
        <h1 className="text-2xl font-bold text-foreground">Technique not found</h1>
        <Link href="/" className="mt-4 inline-block text-primary hover:text-info-foreground">
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
          className="group mb-8 inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="mr-2 h-5 w-5 transform transition-transform group-hover:-translate-x-1" />
          {t('common.back')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 bg-linear-to-r from-foreground via-info to-foreground bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {t(`${baseKey}.title`)}
          </h1>

          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>{t(`${baseKey}.desc`)}</p>
          </div>

          <div className="mt-12 rounded-[20px] border border-warning/20 bg-card p-8 shadow-sm">
            <h3 className="mb-4 text-xl font-semibold text-foreground">{t('technique.why')}</h3>
            <p className="text-muted-foreground">{t(`${baseKey}.why`)}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
