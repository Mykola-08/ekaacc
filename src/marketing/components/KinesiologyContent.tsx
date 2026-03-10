'use client';

import React from 'react';
import { Brain } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import CoreServiceTemplate from '@/marketing/components/templates/CoreServiceTemplate';

export default function KinesiologiaContent() {
  const { t } = useLanguage();

  return (
    <CoreServiceTemplate
      serviceId="kinesiologia"
      hero={{
        titleKey: 'services.kinesiology.title',
        subtitleKey: 'services.kinesiology.description',
        badgeKey: 'services.kinesiology.subtitle',
        icon: Brain
      }}
      bentoGrid={{
        titleKey: 'kinesiology.page.benefitsTitle',
        subtitleKey: 'kinesiology.page.benefitsSubtitle',
        items: [
          {
            titleKey: 'services.kinesiology.subtitle',
            descriptionKey: 'services.kinesiology.subtitle',
            detailsKey: 'kinesiology.benefits.balance.details',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2070', // yoga / balance
            colSpan: 1
          },
          {
            titleKey: 'kinesiology.benefits.posture',
            descriptionKey: 'kinesiology.benefits.posture',
            detailsKey: 'kinesiology.benefits.posture.details',
            image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2070',
            colSpan: 2
          },
          {
            titleKey: 'kinesiology.benefits.stress',
            descriptionKey: 'kinesiology.benefits.stress',
            detailsKey: 'kinesiology.benefits.stress.details',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=2070', // calm meditation
            colSpan: 2
          },
          {
            titleKey: 'kinesiology.benefits.energy',
            descriptionKey: 'kinesiology.benefits.energy',
            detailsKey: 'kinesiology.benefits.energy.details',
            image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&q=80&w=2070', // hiking enjoying nature / vital energy
            colSpan: 1
          }
        ]
      }}
      seoKeys={{
        title: 'seo.kinesiology.title',
        description: 'seo.kinesiology.description',
        keywords: 'seo.kinesiology.keywords'
      }}
      features={{
        titleKey: 'kinesiology.page.benefitsTitle',
        subtitleKey: 'kinesiology.page.benefitsSubtitle',
        benefits: [
          'services.kinesiology.subtitle',
          'kinesiology.benefits.posture',
          'kinesiology.benefits.stress',
          'kinesiology.benefits.energy'
        ]
      }}
      pricing={{
        titleKey: 'kinesiology.page.durationsTitle',
        subtitleKey: 'kinesiology.page.durationsSubtitle',
        options: [
          { duration: 60, descriptionKey: 'kinesiology.page.duration60' },
          { duration: 90, descriptionKey: 'kinesiology.page.duration90' }
        ]
      }}
      testimonials={{
        titleKey: 'kinesiology.page.testimonialsTitle',
        items: [
          {
            name: 'Anna Puig',
            text: t('kinesiology.testimonial.1.text'),
            rating: 5
          },
          {
            name: 'Marc Rivera',
            text: t('kinesiology.testimonial.2.text'),
            rating: 5
          }
        ]
      }}
    />
  );
}
