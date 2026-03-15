'use client';

import React from 'react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import CoreServiceTemplate from '@/marketing/components/templates/CoreServiceTemplate';
import { HugeiconsIcon } from '@hugeicons/react';
import { Leaf01Icon } from '@hugeicons/core-free-icons';

export default function NutritionContent() {
  const { t } = useLanguage();

  // Note: Nutrition pricing options are slightly more complex in the original (name + description + duration string)
  // The CoreServiceTemplate supports `nameKey` and string duration, so I'll adapt it.

  return (
    <CoreServiceTemplate
      serviceId="nutritio"
      hero={{
        titleKey: 'services.nutrition.title',
        subtitleKey: 'services.nutrition.description',
        badgeKey: 'services.nutrition.subtitle',
        icon: Leaf01Icon,
      }}
      bentoGrid={{
        titleKey: 'nutrition.page.benefitsTitle',
        subtitleKey: 'nutrition.page.benefitsSubtitle',
        items: [
          {
            titleKey: 'nutrition.benefits.habits',
            descriptionKey: 'nutrition.benefits.habits',
            detailsKey: 'nutrition.benefits.habits.details',
            image:
              'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=2070', // healthy food bowls
            colSpan: 2,
          },
          {
            titleKey: 'services.nutrition.subtitle',
            descriptionKey: 'services.nutrition.subtitle',
            detailsKey: 'nutrition.benefits.knowledge.details',
            image:
              'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=2070', // fresh ingredients making salad
            colSpan: 1,
          },
          {
            titleKey: 'nutrition.benefits.weight',
            descriptionKey: 'nutrition.benefits.weight',
            detailsKey: 'nutrition.benefits.weight.details',
            image:
              'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=2070', // fit body / healthy lifestyle
            colSpan: 1,
          },
          {
            titleKey: 'nutrition.benefits.prevention',
            descriptionKey: 'nutrition.benefits.prevention',
            detailsKey: 'nutrition.benefits.prevention.details',
            image:
              'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=2070', // healthy detox juice / salad bowl
            colSpan: 2,
          },
        ],
      }}
      seoKeys={{
        title: 'seo.nutrition.title',
        description: 'seo.nutrition.description',
        keywords: 'seo.nutrition.keywords',
      }}
      features={{
        titleKey: 'nutrition.page.benefitsTitle',
        subtitleKey: 'nutrition.page.benefitsSubtitle',
        benefits: [
          'nutrition.benefits.habits',
          'services.nutrition.subtitle',
          'nutrition.benefits.weight',
          'nutrition.benefits.prevention',
        ],
      }}
      pricing={{
        titleKey: 'nutrition.page.durationsTitle',
        subtitleKey: 'nutrition.page.durationsSubtitle',
        options: [
          {
            duration: '60 min',
            nameKey: 'nutrition.session.first.name',
            descriptionKey: 'nutrition.session.first.description',
          },
          {
            duration: '45 min',
            nameKey: 'nutrition.session.followup.name',
            descriptionKey: 'nutrition.session.followup.description',
          },
        ],
      }}
      testimonials={{
        titleKey: 'nutrition.page.testimonialsTitle',
        items: [
          {
            name: 'Carla Ferrer',
            text: t('nutrition.testimonial.1.text'),
            rating: 5,
          },
          {
            name: 'Pere Castell',
            text: t('nutrition.testimonial.2.text'),
            rating: 5,
          },
        ],
      }}
    />
  );
}
