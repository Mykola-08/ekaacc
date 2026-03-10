'use client';

import React from 'react';
import { Users } from 'lucide-react';

import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';

export default function ForParentsContent() {
  return (
    <PersonalizedServiceTemplate
      serviceId="parents"
      translationKey="personalized.parents"
      Icon={Users}
      seoKeys={{
        title: 'seo.parents.title',
        description: 'seo.parents.description',
        keywords: 'seo.parents.keywords'
      }}
      recommendedServices={[
        {
          titleKey: 'personalized.parents.services.emotionalKinesiology.title',
          descriptionKey: 'personalized.parents.services.emotionalKinesiology.description',
          href: '/services/kinesiology',
          duration: '60-90 min'
        },
        {
          titleKey: 'personalized.parents.services.relaxingMassage.title',
          descriptionKey: 'personalized.parents.services.relaxingMassage.description',
          href: '/services/massage',
          duration: '60-90 min'
        }
      ]}
      showMethodology={false}
    />
  );
}
