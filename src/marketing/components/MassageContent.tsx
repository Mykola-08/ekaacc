'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import CoreServiceTemplate from '@/marketing/components/templates/CoreServiceTemplate';

export default function MassageContent() {
  const { t } = useLanguage();

  return (
    <CoreServiceTemplate
      serviceId="massatge"
      hero={{
        titleKey: 'services.massage.title',
        subtitleKey: 'services.massage.description',
        badgeKey: 'services.massage.subtitle',
        icon: Heart
      }}
      bentoGrid={{
        titleKey: 'massage.bento.title',
        subtitleKey: 'massage.bento.subtitle',
        items: [
          {
            titleKey: 'massage.techniques.deepTissue',
            descriptionKey: 'massage.techniques.deepTissue.desc',
            detailsKey: 'massage.techniques.deepTissue.details',
            image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=2070',
            colSpan: 2
          },
          {
            titleKey: 'massage.techniques.recovery',
            descriptionKey: 'massage.techniques.recovery.desc',
            detailsKey: 'massage.techniques.recovery.details',
            image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=2070',
            colSpan: 1
          },
          {
            titleKey: 'massage.techniques.relaxation',
            descriptionKey: 'massage.techniques.relaxation.desc',
            detailsKey: 'massage.techniques.relaxation.details',
            image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=2070',
            colSpan: 3
          }
        ]
      }}
      seoKeys={{
        title: 'seo.massage.title',
        description: 'seo.massage.description',
        keywords: 'seo.massage.keywords'
      }}
      features={{
        titleKey: 'massage.page.benefitsTitle',
        subtitleKey: 'massage.page.benefitsSubtitle',
        benefits: [
          'massage.benefits.pain',
          'services.massage.subtitle',
          'massage.benefits.circulation',
          'massage.benefits.wellbeing'
        ]
      }}
      pricing={{
        titleKey: 'massage.page.durationsTitle',
        subtitleKey: 'massage.page.durationsSubtitle',
        options: [
          { duration: 60, descriptionKey: 'massage.page.duration60' },
          { duration: 90, descriptionKey: 'massage.page.duration90' },
          { duration: 120, descriptionKey: 'massage.page.duration120' }
        ]
      }}
      testimonials={{
        titleKey: 'massage.page.testimonialsTitle',
        items: [
          {
            name: 'Maria S.',
            text: t('massage.testimonial.1.text'),
            rating: 5
          },
          {
            name: 'Jordi M.',
            text: t('massage.testimonial.2.text'),
            rating: 5
          }
        ]
      }}
    />
  );
}
