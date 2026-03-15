'use client';

import React from 'react';
import CoreServiceTemplate from '@/marketing/components/templates/CoreServiceTemplate';

export default function Revision360Content() {
  return (
    <CoreServiceTemplate
      serviceId="revisio360"
      hero={{
        titleKey: 'revision360.hero.title',
        subtitleKey: 'revision360.hero.subtitle',
        badgeKey: 'revision360.seo.title',
      }}
      bentoGrid={{
        titleKey: 'revision360.why360.title',
        subtitleKey: 'revision360.why360.subtitle',
        items: [
          {
            titleKey: 'revision360.why360.layers.physical',
            descriptionKey: 'revision360.why360.physical.desc',
            colSpan: 1,
            image:
              'https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            titleKey: 'revision360.why360.layers.emotional',
            descriptionKey: 'revision360.why360.emotional.desc',
            colSpan: 1,
            image:
              'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=800',
          },
          {
            titleKey: 'revision360.service.title',
            descriptionKey: 'revision360.service.total.duration',
            colSpan: 2,
          },
        ],
      }}
      features={{
        titleKey: 'services.benefits.title',
        subtitleKey: 'services.benefits.subtitle',
        benefits: [
          'services.benefits.assessment',
          'services.benefits.plan',
          'services.benefits.recommendations',
          'services.benefits.followup',
        ],
      }}
      pricing={{
        titleKey: 'revision360.variants.title',
        subtitleKey: 'revision360.variants.subtitle',
        options: [
          {
            nameKey: 'revision360.variants.reset.title',
            duration: '90m',
            price: 450,
            descriptionKey: 'revision360.variants.reset.description',
          },
          {
            nameKey: 'revision360.variants.mapping.title',
            duration: '90m',
            price: 350,
            descriptionKey: 'revision360.variants.mapping.description',
          },
          {
            nameKey: 'revision360.variants.alignment.title',
            duration: '60m',
            price: 280,
            descriptionKey: 'revision360.variants.alignment.description',
          },
          {
            nameKey: 'revision360.variants.integral.title',
            duration: '120m',
            price: 750,
            descriptionKey: 'revision360.variants.integral.description',
          },
        ],
      }}
      seoKeys={{
        title: 'revision360.seo.title',
        description: 'revision360.seo.description',
        keywords: 'revision360.seo.keywords',
      }}
    />
  );
}
