'use client';

import React from 'react';
import { Brain } from 'lucide-react';

import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';

export default function ForStudentsContent() {
  return (
    <PersonalizedServiceTemplate
      serviceId="students"
      translationKey="personalized.students"
      Icon={Brain}
      seoKeys={{
        title: 'seo.students.title',
        description: 'seo.students.description',
        keywords: 'seo.students.keywords',
      }}
      recommendedServices={[
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
      ]}
      showMethodology={false}
    />
  );
}
