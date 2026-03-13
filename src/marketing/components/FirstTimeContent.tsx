'use client';

import PersonalizedOnboarding from '@/marketing/components/PersonalizedOnboarding';
import PageLayout from '@/marketing/components/PageLayout';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

export default function FirstTimeContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
      hero={{
        title: t('onboarding.welcome.title') || 'Primera Visita',
        subtitle:
          t('onboarding.welcome.description') ||
          'Descubre tu plan personalizado respondiendo unas breves preguntas.',
        badge: t('hero.firstTime') || 'First Time',
        icon: <Sparkles className="h-4 w-4" />,
      }}
      className="bg-secondary"
    >
      <div className="section-container flex justify-center py-12 md:py-20">
        <PersonalizedOnboarding />
      </div>
    </PageLayout>
  );
}
