'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PageLayout from '@/marketing/components/PageLayout';
import { Button } from '@/marketing/components/ui/button';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import FAQ from '@/marketing/components/FAQ';
import CTASection from '@/marketing/components/CTASection';
import { PERSONALIZED_SERVICES_DATA } from '@/marketing/shared/constants';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

interface RecommendedService {
  titleKey: string;
  descriptionKey: string;
  duration?: string;
  href: string;
}

interface MethodStep {
  title: string;
  description: string;
}

interface PersonalizedServiceTemplateProps {
  serviceId: string;
  translationKey: string;
  Icon: IconSvgElement;
  seoKeys: {
    title: string;
    description: string;
    keywords: string;
  };
  recommendedServices: RecommendedService[];
  faqItems?: Array<{ id: string; question: string; answer: string }>;
  showMethodology?: boolean;
  benefits?: string[];
  methodSteps?: MethodStep[];
  children?: React.ReactNode;
  childrenTop?: React.ReactNode;
}

const themeConfig: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    subtext: string;
    accent: string;
    dots: string;
    stepsBg: string;
    stepsIconBg: string;
    stepsIconText: string;
    servicesBgFrom: string;
    servicesBgTo: string;
    serviceCardHoverText: string;
    serviceLinkText: string;
  }
> = {
  orange: {
    bg: 'bg-orange-50/50',
    border: 'border-orange-100',
    text: 'text-orange-900',
    subtext: 'text-gray-700',
    accent: '-primary',
    dots: 'bg-orange-400',
    stepsBg: 'bg-orange-50/30',
    stepsIconBg: 'bg-orange-100',
    stepsIconText: 'text-orange-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-orange-50/30',
    serviceCardHoverText: 'group-hover:text-orange-700',
    serviceLinkText: 'text-orange-600',
  },
  purple: {
    bg: 'bg-purple-50/50',
    border: 'border-purple-100',
    text: 'text-purple-900',
    subtext: 'text-gray-700',
    accent: '-primary',
    dots: 'bg-purple-400',
    stepsBg: 'bg-purple-50/30',
    stepsIconBg: 'bg-purple-100',
    stepsIconText: 'text-purple-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-purple-50/30',
    serviceCardHoverText: 'group-hover:text-purple-700',
    serviceLinkText: 'text-purple-600',
  },
  blue: {
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    text: 'text-blue-900',
    subtext: 'text-gray-700',
    accent: '-primary',
    dots: 'bg-blue-400',
    stepsBg: 'bg-blue-50/30',
    stepsIconBg: 'bg-blue-100',
    stepsIconText: 'text-blue-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-blue-50/30',
    serviceCardHoverText: 'group-hover:text-blue-700',
    serviceLinkText: 'text-blue-600',
  },
  green: {
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-100',
    text: 'text-emerald-900',
    subtext: 'text-gray-700',
    accent: '-primary',
    dots: 'bg-emerald-400',
    stepsBg: 'bg-emerald-50/30',
    stepsIconBg: 'bg-emerald-100',
    stepsIconText: 'text-emerald-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-emerald-50/30',
    serviceCardHoverText: 'group-hover:text-emerald-700',
    serviceLinkText: 'text-emerald-600',
  },
  pink: {
    bg: 'bg-pink-50/50',
    border: 'border-pink-100',
    text: 'text-pink-900',
    subtext: 'text-gray-700',
    accent: '-primary',
    dots: 'bg-pink-400',
    stepsBg: 'bg-pink-50/30',
    stepsIconBg: 'bg-pink-100',
    stepsIconText: 'text-pink-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-pink-50/30',
    serviceCardHoverText: 'group-hover:text-pink-700',
    serviceLinkText: 'text-pink-600',
  },
  amber: {
    bg: 'bg-amber-50/50',
    border: 'border-amber-100',
    text: 'text-amber-900',
    subtext: 'text-gray-700',
    accent: '-primary',
    dots: 'bg-amber-400',
    stepsBg: 'bg-amber-50/30',
    stepsIconBg: 'bg-amber-100',
    stepsIconText: 'text-amber-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-amber-50/30',
    serviceCardHoverText: 'group-hover:text-amber-700',
    serviceLinkText: 'text-amber-600',
  },
};

export default function PersonalizedServiceTemplate({
  serviceId,
  translationKey,
  seoKeys,
  recommendedServices,
  faqItems,
  showMethodology = true,
  benefits = [],
  methodSteps,
  children,
  childrenTop,
}: PersonalizedServiceTemplateProps) {
  const { t } = useLanguage();
  const serviceData = PERSONALIZED_SERVICES_DATA.find((s) => s.id === serviceId);

  const colorKey = serviceData?.color || 'orange';
  const theme = themeConfig[colorKey] || themeConfig.orange;

  // Fallback methodology steps if none provided but showMethodology is true
  // Try to load from translation keys if methodSteps is empty but showMethodology is true
  const stepsToRender =
    methodSteps && methodSteps.length > 0
      ? methodSteps
      : showMethodology
        ? [1, 2, 3].map((step) => ({
            title: t(`${translationKey}.method.step${step}.title`),
            description: t(`${translationKey}.method.step${step}.desc`),
          }))
        : [];

  // Filter out any steps that look like translation keys (if t returns the key)
  const validSteps = stepsToRender.filter(
    (step) => !step.title.includes(translationKey) && !step.description.includes(translationKey)
  );

  return (
    <>
      <SEOUpdater
        titleKey={seoKeys.title}
        descriptionKey={seoKeys.description}
        keywordsKey={seoKeys.keywords}
      />
      <PageLayout
        hero={{
          title: t(`${translationKey}.hero.title`),
          subtitle: t(`${translationKey}.hero.description`),
          backgroundImage: serviceData?.image,
          themeColor: serviceData?.color || 'orange',
        }}
      >
        <div className="relative z-20 mt-4 mb-16 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" variant="default">
            <Link
              href={`/booking?service=${encodeURIComponent(t(`${translationKey}.hero.title`))}`}
            >
              {t('nav.bookNow')}
              <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-5"  />
            </Link>
          </Button>
          <Link href="/booking">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-200 bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-white"
            >
              {t('common.askQuestions')}
            </Button>
          </Link>
        </div>
        {childrenTop}
        {/* Understanding Section - Bento Box */}
        <section className="bg-background py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="mb-4 text-3xl font-semibold tracking-tighter text-black sm:text-4xl md:text-5xl">
                {t(`${translationKey}.understanding.title`)}
              </h2>
            </div>

            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {/* Description 1 - Large box */}
              <div className="group relative col-span-1 overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 transition-all duration-500 sm:rounded-[2.5rem] sm:p-8 md:col-span-2 md:p-10">
                <div
                  className={`absolute top-0 right-0 h-32 w-32 rounded-bl-full opacity-10 ${theme.bg} transition-colors duration-500`}
                />
                <p className="relative z-10 text-xl leading-tight font-medium text-balance text-gray-800 sm:text-2xl md:text-3xl">
                  {t(`${translationKey}.understanding.description1`)}
                </p>
                <p className="relative z-10 mt-6 max-w-2xl text-base leading-relaxed font-medium text-gray-500 sm:mt-8 sm:text-lg">
                  {t(`${translationKey}.understanding.description2`)}
                </p>
                <div className="relative z-10 mt-6 sm:mt-8">
                  <p className={`font-semibold tracking-tight ${theme.text} text-sm sm:text-base`}>
                    {t(`${translationKey}.understanding.callToAction`)}
                  </p>
                </div>
              </div>

              {/* Benefits Box */}
              {benefits.length > 0 && (
                <div
                  className={`col-span-1 rounded-[2rem] p-6 sm:rounded-[2.5rem] sm:p-8 md:p-10 ${theme.bg} ${theme.border} flex flex-col justify-center border transition-all duration-500`}
                >
                  <h3
                    className={`mb-4 text-xl font-semibold tracking-tight sm:mb-6 sm:text-2xl ${theme.text}`}
                  >
                    {t('common.benefits') ||
                      t(`${translationKey}.benefits.title`) ||
                      'Beneficis clau'}
                  </h3>
                  <ul className="sm:">
                    {benefits.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 sm:gap-4">
                        <div className={`mt-2 h-2 w-2 rounded-full ${theme.dots} shrink-0`} />
                        <span
                          className={`text-base leading-tight font-medium sm:text-lg ${theme.text}`}
                        >
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Methodology Section - Apple Bento layout */}
        {showMethodology && validSteps.length > 0 && (
          <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-center text-3xl font-semibold tracking-tighter text-black sm:mb-16 sm:text-4xl md:text-5xl">
                {t(`${translationKey}.method.title`)}
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
                {validSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`rounded-[2rem] border border-gray-100 p-6 sm:rounded-[2.5rem] sm:p-8 md:p-10 ${theme.stepsBg} group transition-all duration-500`}
                  >
                    <div
                      className={`h-12 w-12 rounded-2xl sm:h-14 sm:w-14 ${theme.stepsIconBg} flex items-center justify-center ${theme.stepsIconText} mb-6 text-xl font-semibold transition-transform duration-500 group-hover:scale-110 sm:mb-8 sm:text-2xl`}
                    >
                      {index + 1}
                    </div>
                    <h3 className="mb-3 text-2xl leading-tight font-semibold tracking-tight text-gray-900 sm:mb-4 sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="text-base leading-relaxed font-medium text-gray-600 sm:text-lg">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recommended Services Section */}
        <section className="bg-background py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="mb-3 text-3xl font-semibold tracking-tighter text-black sm:mb-4 sm:text-4xl md:text-5xl">
                {t(`${translationKey}.services.title`)}
              </h2>
              <p className="mx-auto max-w-2xl text-lg font-medium tracking-tight text-gray-500 sm:text-xl">
                {t(`${translationKey}.services.subtitle`)}
              </p>
            </div>

            <div
              className={`grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] md:gap-8`}
            >
              {recommendedServices.map((service, index) => {
                const details = (
                  <div className="mt-8 flex items-center gap-6 rounded-2xl bg-gray-50 p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                        {t('common.duration') || 'Duration'}
                      </span>
                      <span className="text-xl font-semibold text-gray-900">
                        {service.duration || '60-90 min'}
                      </span>
                    </div>
                  </div>
                );

                return (
                  <ServiceBentoItem
                    key={index}
                    title={t(service.titleKey)}
                    description={t(service.descriptionKey)}
                    details={details}
                    bookUrl={`/booking?service=${encodeURIComponent(t(service.titleKey))}`}
                    bookText={t('nav.bookNow') || 'Book Now'}
                    readMoreUrl={service.href}
                    readMoreText={t('common.moreInfo') || 'More Info'}
                    className="h-full"
                  />
                );
              })}
            </div>
          </div>
        </section>

        {children}

        {faqItems ? <FAQ items={faqItems} /> : <FAQ />}
        <CTASection />
      </PageLayout>
    </>
  );
}
