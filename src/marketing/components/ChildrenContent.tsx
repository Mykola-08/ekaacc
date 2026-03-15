'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/marketing/components/PageLayout';
import { Button } from '@/marketing/components/ui/button';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import FAQ from '@/marketing/components/FAQ';
import CTASection from '@/marketing/components/CTASection';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import { SERVICES_DATA } from '@/marketing/shared/constants';
import { ServiceItem } from '@/marketing/shared/types';

export default function ChildrenContent() {
  const { t } = useLanguage();

  const kinesiologyBase = SERVICES_DATA.find((s) => s.id === 'kinesiologia');
  const customKinesiology: ServiceItem = {
    ...kinesiologyBase!,
    id: 'kinesiology-child-learning',
    // titleKey remains 'services.kinesiology.title'
    subtitleKey: 'children.kinesiology.badge',
    descriptionKey: 'children.kinesiology.desc',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2072&auto=format&fit=crop',
  };

  const customHealth: ServiceItem = {
    ...kinesiologyBase!,
    id: 'kinesiology-child-health',
    titleKey: 'children.health.title',
    subtitleKey: 'children.health.badge',
    descriptionKey: 'children.health.desc',
    image:
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop',
  };

  const Hero = (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 py-12 sm:py-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2">
              <span className="text-sm font-medium text-blue-700">
                {t('nav.personalizedServices')}
              </span>
            </div>

            <h1 className="-primary mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
              {t('elena.target.children.title')}
            </h1>

            <p className="mb-8 text-xl leading-relaxed font-light text-gray-600">
              {t('elena.target.children.desc')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/booking">
                <Button size="lg" variant="default" className="px-8 py-4 normal-case">
                  {t('common.reserveSession')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative h-[400px] w-full sm:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1920&h=1080&fit=crop"
                alt={t('elena.target.children.title')}
                fill
                className="rounded-apple-xl -rotate-1 object-cover transition-transform duration-500 hover:rotate-0"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <>
      <SEOUpdater
        titleKey="seo.children.title"
        descriptionKey="seo.children.description"
        keywordsKey="seo.children.keywords"
      />
      <PageLayout>
        {Hero}

        {/* Recommended Services */}
        <section className="bg-background py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-semibold tracking-tighter text-gray-900 md:text-5xl">
                {t('children.recommended')}
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-medium text-gray-500">
                {t('children.recommended.desc')}
              </p>
            </div>

            <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-2 md:gap-8">
              <ServiceBentoItem
                title={t(customKinesiology.titleKey)}
                description={t(customKinesiology.descriptionKey)}
                image={customKinesiology.image}
              />
              <ServiceBentoItem
                title={t(customHealth.titleKey)}
                description={t(customHealth.descriptionKey)}
                image={customHealth.image}
              />
            </div>
          </div>
        </section>

        <FAQ />
        <CTASection />
      </PageLayout>
    </>
  );
}
