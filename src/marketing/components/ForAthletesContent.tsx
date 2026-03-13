'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';

export default function ForAthletesContent() {
  const { t } = useLanguage();

  const faqItems = [
    {
      id: 'athlete-q1',
      question: t('personalized.athletes.faq.q1'),
      answer: t('personalized.athletes.faq.a1'),
    },
    {
      id: 'athlete-q2',
      question: t('personalized.athletes.faq.q2'),
      answer: t('personalized.athletes.faq.a2'),
    },
    {
      id: 'athlete-q3',
      question: t('personalized.athletes.faq.q3'),
      answer: t('personalized.athletes.faq.a3'),
    },
  ];

  const recommendedServices = [
    {
      titleKey: 'personalized.athletes.services.sportsMassage.title',
      descriptionKey: 'personalized.athletes.services.sportsMassage.description',
      href: '/services/massage',
      duration: '60-90 min',
    },
    {
      titleKey: 'personalized.athletes.services.osteobalance.title',
      descriptionKey: 'personalized.athletes.services.osteobalance.description',
      href: '/services/osteobalance',
      duration: '60-90 min',
    },
  ];

  return (
    <PersonalizedServiceTemplate
      serviceId="athletes"
      translationKey="personalized.athletes"
      Icon={Zap}
      seoKeys={{
        title: 'seo.athletes.title',
        description: 'seo.athletes.description',
        keywords: 'seo.athletes.keywords',
      }}
      recommendedServices={recommendedServices}
      faqItems={faqItems}
    />
  );
}
