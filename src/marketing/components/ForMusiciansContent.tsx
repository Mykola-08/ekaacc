'use client';

import React from 'react';
import { Music } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';

export default function ForMusiciansContent() {
  const { t } = useLanguage();

  const faqItems = [
    {
      id: 'musician-q1',
      question: t('personalized.musicians.faq.q1'),
      answer: t('personalized.musicians.faq.a1'),
    },
    {
      id: 'musician-q2',
      question: t('personalized.musicians.faq.q2'),
      answer: t('personalized.musicians.faq.a2'),
    },
    {
      id: 'musician-q3',
      question: t('personalized.musicians.faq.q3'),
      answer: t('personalized.musicians.faq.a3'),
    },
  ];

  const recommendedServices = [
    {
      titleKey: 'personalized.musicians.services.feldenkraisExpression.title',
      descriptionKey: 'personalized.musicians.services.feldenkraisExpression.description',
      href: '/services/feldenkrais',
      duration: '60-90 min',
    },
    {
      titleKey: 'personalized.musicians.services.kinesiologyPerformance.title',
      descriptionKey: 'personalized.musicians.services.kinesiologyPerformance.description',
      href: '/services/kinesiology',
      duration: '60 min',
    },
  ];

  return (
    <PersonalizedServiceTemplate
      serviceId="musicians"
      translationKey="personalized.musicians"
      Icon={Music}
      seoKeys={{
        title: 'seo.musicians.title',
        description: 'seo.musicians.description',
        keywords: 'seo.musicians.keywords',
      }}
      recommendedServices={recommendedServices}
      faqItems={faqItems}
    />
  );
}
