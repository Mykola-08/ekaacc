'use client';

import React from 'react';

import PersonalizedServiceTemplate from '@/marketing/components/templates/PersonalizedServiceTemplate';
import { HugeiconsIcon } from '@hugeicons/react';
import { PaintBoardIcon } from '@hugeicons/core-free-icons';

export default function ArtistsContent() {
  return (
    <PersonalizedServiceTemplate
      serviceId="artists"
      translationKey="personalized.artists" // Strategy: I'll need to define this, OR I can rely on 'artists' if I change the key
      Icon={PaintBoardIcon}
      seoKeys={{
        title: 'seo.artists.title',
        description: 'seo.artists.description',
        keywords: 'seo.artists.keywords',
      }}
      recommendedServices={[
        {
          titleKey: 'artists.session.title', // Reusing existing key
          descriptionKey: 'artists.session.cta', // Reusing
          href: '/booking',
          duration: '60 min',
        },
      ]}
      showMethodology={false}
    />
  );
}
