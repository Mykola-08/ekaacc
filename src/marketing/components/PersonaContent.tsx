'use client';

import React from 'react';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';
import ForBusinessContent from '@/marketing/components/ForBusinessContent';
import { HugeiconsIcon } from '@hugeicons/react';
import { Brain01Icon, ComputerActivityIcon, ComputerIcon, MusicNote01Icon, UserMultipleIcon, ZapIcon } from '@hugeicons/core-free-icons';

export type PersonaType = 'athletes' | 'business' | 'musicians' | 'office-workers' | 'students' | 'parents';

interface PersonaContentProps {
  persona: PersonaType;
}

export default function PersonaContent({ persona }: PersonaContentProps) {
  const { t } = useLanguage();

  if (persona === 'business') {
    return <ForBusinessContent />;
  }

  const personaConfigs = {
    athletes: {
      serviceId: 'athletes',
      translationKey: 'personalized.athletes',
      Icon: ZapIcon,
      seoKeys: {
        title: 'seo.athletes.title',
        description: 'seo.athletes.description',
        keywords: 'seo.athletes.keywords',
      },
      recommendedServices: [
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
      ],
      faqItems: [
        { id: 'athlete-q1', question: t('personalized.athletes.faq.q1'), answer: t('personalized.athletes.faq.a1') },
        { id: 'athlete-q2', question: t('personalized.athletes.faq.q2'), answer: t('personalized.athletes.faq.a2') },
        { id: 'athlete-q3', question: t('personalized.athletes.faq.q3'), answer: t('personalized.athletes.faq.a3') },
      ],
      showMethodology: true,
    },
    musicians: {
      serviceId: 'musicians',
      translationKey: 'personalized.musicians',
      Icon: MusicNote01Icon,
      seoKeys: {
        title: 'seo.musicians.title',
        description: 'seo.musicians.description',
        keywords: 'seo.musicians.keywords',
      },
      recommendedServices: [
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
      ],
      faqItems: [
        { id: 'musician-q1', question: t('personalized.musicians.faq.q1'), answer: t('personalized.musicians.faq.a1') },
        { id: 'musician-q2', question: t('personalized.musicians.faq.q2'), answer: t('personalized.musicians.faq.a2') },
        { id: 'musician-q3', question: t('personalized.musicians.faq.q3'), answer: t('personalized.musicians.faq.a3') },
      ],
      showMethodology: true,
    },
    'office-workers': {
      serviceId: 'office-workers',
      translationKey: 'personalized.officeWorkers',
      Icon: ComputerIcon,
      seoKeys: {
        title: 'seo.officeWorkers.title',
        description: 'seo.officeWorkers.description',
        keywords: 'seo.officeWorkers.keywords',
      },
      recommendedServices: [
        {
          titleKey: 'personalized.officeWorkers.services.therapeuticMassage.title',
          descriptionKey: 'personalized.officeWorkers.services.therapeuticMassage.description',
          href: '/services/massage',
          duration: '60-90 min',
        },
        {
          titleKey: 'personalized.officeWorkers.services.feldenkrais.title',
          descriptionKey: 'personalized.officeWorkers.services.feldenkrais.description',
          href: '/services/feldenkrais',
          duration: '60 min',
        },
      ],
      faqItems: [
        { id: 'office-q1', question: t('personalized.officeWorkers.faq.q1'), answer: t('personalized.officeWorkers.faq.a1') },
        { id: 'office-q2', question: t('personalized.officeWorkers.faq.q2'), answer: t('personalized.officeWorkers.faq.a2') },
        { id: 'office-q3', question: t('personalized.officeWorkers.faq.q3'), answer: t('personalized.officeWorkers.faq.a3') },
      ],
      showMethodology: true,
    },
    students: {
      serviceId: 'students',
      translationKey: 'personalized.students',
      Icon: Brain01Icon,
      seoKeys: {
        title: 'seo.students.title',
        description: 'seo.students.description',
        keywords: 'seo.students.keywords',
      },
      recommendedServices: [
        {
          titleKey: 'personalized.students.services.kinesiologyStress.title',
          descriptionKey: 'personalized.students.services.kinesiologyStress.description',
          href: '/services/kinesiology',
          duration: '60 min',
        },
        {
          titleKey: 'personalized.students.services.relaxingMassage.title',
          descriptionKey: 'personalized.students.services.relaxingMassage.description',
          href: '/services/massage',
          duration: '60-90 min',
        },
      ],
      showMethodology: false,
    },
    parents: {
      serviceId: 'parents',
      translationKey: 'personalized.parents',
      Icon: UserMultipleIcon,
      seoKeys: {
        title: 'seo.parents.title',
        description: 'seo.parents.description',
        keywords: 'seo.parents.keywords',
      },
      recommendedServices: [
        {
          titleKey: 'personalized.parents.services.emotionalKinesiology.title',
          descriptionKey: 'personalized.parents.services.emotionalKinesiology.description',
          href: '/services/kinesiology',
          duration: '60-90 min',
        },
        {
          titleKey: 'personalized.parents.services.relaxingMassage.title',
          descriptionKey: 'personalized.parents.services.relaxingMassage.description',
          href: '/services/massage',
          duration: '60-90 min',
        },
      ],
      showMethodology: false,
    },
  };

  const config = personaConfigs[persona as keyof typeof personaConfigs];
  if (!config) return null;

  return (
    <PersonalizedServiceTemplate
      serviceId={config.serviceId}
      translationKey={config.translationKey}
      Icon={config.Icon}
      seoKeys={config.seoKeys}
      recommendedServices={config.recommendedServices}
      faqItems={'faqItems' in config ? config.faqItems : undefined}
      showMethodology={config.showMethodology}
    />
  );
}
