export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CaseDetailContent from './CaseDetailContent';

const caseSlugs: Record<string, { title: string; description: string }> = {
  'back-pain': {
    title: 'Back Pain Treatment',
    description:
      'Effective integrative therapy for back pain relief using massage and somatic techniques.',
  },
  'stress-anxiety': {
    title: 'Stress & Anxiety Relief',
    description: 'Holistic kinesiology and somatic therapy for managing stress and anxiety.',
  },
  'digestive-problems': {
    title: 'Digestive Health Solutions',
    description: 'Nutritional therapy and kinesiology for digestive wellness.',
  },
  migraines: {
    title: 'Migraine Relief Therapy',
    description: 'Therapeutic massage and integrative approaches for migraine relief.',
  },
  'low-energy': {
    title: 'Energy Restoration',
    description: 'Kinesiology-based therapy to restore natural energy levels.',
  },
  'hormonal-problems': {
    title: 'Hormonal Balance Therapy',
    description: 'Integrative kinesiology for hormonal health and balance.',
  },
  'sleep-difficulties': {
    title: 'Sleep Improvement Therapy',
    description: 'Somatic and kinesiology therapy for better sleep quality.',
  },
  'injury-recovery': {
    title: 'Injury Recovery',
    description: 'Therapeutic massage for accelerated injury recovery.',
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const caseInfo = caseSlugs[id];
  if (!caseInfo) return { title: 'Case Not Found | EKA Balance' };

  return {
    title: `${caseInfo.title} | EKA Balance`,
    description: caseInfo.description,
    openGraph: {
      title: `${caseInfo.title} | EKA Balance`,
      description: caseInfo.description,
      type: 'article',
    },
  };
}

export default async function CasoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!caseSlugs[id]) return notFound();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <CaseDetailContent id={id} />
    </Suspense>
  );
}
