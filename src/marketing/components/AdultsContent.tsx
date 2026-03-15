'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import Link from 'next/link';

import PageLayout from '@/marketing/components/PageLayout';
import { Button } from '@/marketing/components/ui/button';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import { SERVICES_DATA } from '@/marketing/shared/constants';
import { ServiceItem } from '@/marketing/shared/types';

export default function AdultsContent() {
  const { t } = useLanguage();

  const kinesiologyBase = SERVICES_DATA.find((s) => s.id === 'kinesiologia');
  const customKinesiology: ServiceItem = {
    ...kinesiologyBase!,
    id: 'kinesiology-adult',
    subtitleKey: 'adult.kinesiology.badge',
    descriptionKey: 'services.kinesiology.shortDesc',
    image:
      'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop',
  };

  const nutritionBase = SERVICES_DATA.find((s) => s.id === 'nutritio');
  const customNutrition: ServiceItem = {
    ...nutritionBase!,
    id: 'nutrition-adult',
    subtitleKey: 'adult.nutrition.badge',
    descriptionKey: 'services.nutrition.shortDesc', // Fallback or check if exists
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop',
  };

  const HeroCustom = (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 py-20 sm:py-28">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-8">
        <h1 className="heading-1 mb-6 max-w-4xl">{t('elena.target.adults.title')}</h1>
        <p className="mb-12 max-w-2xl text-xl leading-relaxed font-light text-gray-600 sm:text-2xl">
          {t('elena.target.adults.desc')}
        </p>
      </div>
    </section>
  );

  return (
    <>
      <SEOUpdater
        titleKey="seo.adults.title"
        descriptionKey="seo.adults.description"
        keywordsKey="seo.adults.keywords"
      />
      <PageLayout>
        {HeroCustom}

        <section className="relative z-10 -mt-10 rounded-t-[3rem] bg-background py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-semibold tracking-tighter text-gray-900 md:text-5xl">
                {t('adult.recommended')}
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-medium tracking-tight text-gray-500">
                {t('adult.recommended.desc')}
              </p>
            </div>

            <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2 md:gap-8">
              <ServiceBentoItem
                title={t(customKinesiology.titleKey)}
                description={t(customKinesiology.descriptionKey)}
                image={customKinesiology.image}
              />
              <ServiceBentoItem
                title={t(customNutrition.titleKey)}
                description={t(customNutrition.descriptionKey)}
                image={customNutrition.image}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h2 className="heading-2 mb-6 font-bold">{t('adult.cta.title')}</h2>
            <p className="mb-8 text-xl font-light text-gray-600">{t('adult.cta.desc')}</p>
            <Link href="/booking">
              <Button size="lg" variant="default">
                {t('common.bookNow')}
              </Button>
            </Link>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
