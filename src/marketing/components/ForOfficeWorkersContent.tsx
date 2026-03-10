'use client';

import React from 'react';
import { Monitor } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';

export default function ForOfficeWorkersContent() {
  const { t } = useLanguage();

  const faqItems = [
    {
      id: 'office-q1',
      question: t('personalized.officeWorkers.faq.q1'),
      answer: t('personalized.officeWorkers.faq.a1')
    },
    {
      id: 'office-q2',
      question: t('personalized.officeWorkers.faq.q2'),
      answer: t('personalized.officeWorkers.faq.a2')
    },
    {
      id: 'office-q3',
      question: t('personalized.officeWorkers.faq.q3'),
      answer: t('personalized.officeWorkers.faq.a3')
    }
  ];

  const recommendedServices = [
    {
      titleKey: 'personalized.officeWorkers.services.therapeuticMassage.title',
      descriptionKey: 'personalized.officeWorkers.services.therapeuticMassage.description',
      href: '/services/massage',
      duration: '60-90 min'
    },
    {
      titleKey: 'personalized.officeWorkers.services.feldenkrais.title',
      descriptionKey: 'personalized.officeWorkers.services.feldenkrais.description',
      href: '/services/feldenkrais',
      duration: '60 min'
    }
  ];

  return (
    <PersonalizedServiceTemplate
      serviceId="office-workers"
      translationKey="personalized.officeWorkers"
      Icon={Monitor}
      seoKeys={{
        title: 'seo.officeWorkers.title',
        description: 'seo.officeWorkers.description',
        keywords: 'seo.officeWorkers.keywords'
      }}
      recommendedServices={recommendedServices}
      faqItems={faqItems}
    />
  );
}
