'use client';

import React from 'react';

import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';
import { HugeiconsIcon } from '@hugeicons/react';
import { UserMultipleIcon } from '@hugeicons/core-free-icons';

export default function ForParentsContent() {
  return (
    <PersonalizedServiceTemplate
      serviceId="parents"
      translationKey="personalized.parents"
      Icon={UserMultipleIcon}
      seoKeys={{
        title: 'seo.parents.title',
        description: 'seo.parents.description',
        keywords: 'seo.parents.keywords',
      }}
      recommendedServices={[
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
      ]}
      showMethodology={false}
    />
  );
}
