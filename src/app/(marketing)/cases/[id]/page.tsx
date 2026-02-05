import { Metadata } from 'next';
import { translations } from '@/context/translations';
import CaseDetailClient from './CaseDetailClient';

const problemsConfig: Record<string, string> = {
  'back-pain': 'backPain',
  'stress-anxiety': 'stress',
  'digestive-problems': 'digestive',
  'migraines': 'migraines',
  'low-energy': 'lowEnergy',
  'hormonal-problems': 'hormonal',
  'sleep-difficulties': 'sleep',
  'injury-recovery': 'recovery'
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const key = problemsConfig[id];

  if (!key) {
    return {
      title: 'Case Not Found',
    };
  }

  // Default to English for SEO metadata if language is not known contextually
  const t = (k: string) => translations['en'][k] || k;

  return {
    title: t(`casos.problems.${key}.title`),
    description: t(`casos.problems.${key}.description`),
  };
}

export default async function CasoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CaseDetailClient id={id} />;
}
