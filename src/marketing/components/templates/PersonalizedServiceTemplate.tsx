'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PageLayout from '@/marketing/components/PageLayout';
import { Button } from '@/marketing/components/ui/button';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import FAQ from '@/marketing/components/FAQ';
import CTASection from '@/marketing/components/CTASection';
import { PERSONALIZED_SERVICES_DATA } from '@/marketing/shared/constants';

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
  Icon: React.ElementType;
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

const themeConfig: Record<string, {
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
}> = {
  orange: {
    bg: 'bg-orange-50/50',
    border: 'border-orange-100',
    text: 'text-orange-900',
    subtext: 'text-gray-700',
    accent: 'text-eka-dark',
    dots: 'bg-orange-400',
    stepsBg: 'bg-orange-50/30',
    stepsIconBg: 'bg-orange-100',
    stepsIconText: 'text-orange-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-orange-50/30',
    serviceCardHoverText: 'group-hover:text-orange-700',
    serviceLinkText: 'text-orange-600'
  },
  purple: {
    bg: 'bg-purple-50/50',
    border: 'border-purple-100',
    text: 'text-purple-900',
    subtext: 'text-gray-700',
    accent: 'text-eka-dark',
    dots: 'bg-purple-400',
    stepsBg: 'bg-purple-50/30',
    stepsIconBg: 'bg-purple-100',
    stepsIconText: 'text-purple-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-purple-50/30',
    serviceCardHoverText: 'group-hover:text-purple-700',
    serviceLinkText: 'text-purple-600'
  },
  blue: {
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    text: 'text-blue-900',
    subtext: 'text-gray-700',
    accent: 'text-eka-dark',
    dots: 'bg-blue-400',
    stepsBg: 'bg-blue-50/30',
    stepsIconBg: 'bg-blue-100',
    stepsIconText: 'text-blue-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-blue-50/30',
    serviceCardHoverText: 'group-hover:text-blue-700',
    serviceLinkText: 'text-blue-600'
  },
  green: {
    bg: 'bg-emerald-50/50',
    border: 'border-emerald-100',
    text: 'text-emerald-900',
    subtext: 'text-gray-700',
    accent: 'text-eka-dark',
    dots: 'bg-emerald-400',
    stepsBg: 'bg-emerald-50/30',
    stepsIconBg: 'bg-emerald-100',
    stepsIconText: 'text-emerald-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-emerald-50/30',
    serviceCardHoverText: 'group-hover:text-emerald-700',
    serviceLinkText: 'text-emerald-600'
  },
  pink: {
    bg: 'bg-pink-50/50',
    border: 'border-pink-100',
    text: 'text-pink-900',
    subtext: 'text-gray-700',
    accent: 'text-eka-dark',
    dots: 'bg-pink-400',
    stepsBg: 'bg-pink-50/30',
    stepsIconBg: 'bg-pink-100',
    stepsIconText: 'text-pink-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-pink-50/30',
    serviceCardHoverText: 'group-hover:text-pink-700',
    serviceLinkText: 'text-pink-600'
  },
  amber: {
    bg: 'bg-amber-50/50',
    border: 'border-amber-100',
    text: 'text-amber-900',
    subtext: 'text-gray-700',
    accent: 'text-eka-dark',
    dots: 'bg-amber-400',
    stepsBg: 'bg-amber-50/30',
    stepsIconBg: 'bg-amber-100',
    stepsIconText: 'text-amber-600',
    servicesBgFrom: 'from-transparent',
    servicesBgTo: 'to-amber-50/30',
    serviceCardHoverText: 'group-hover:text-amber-700',
    serviceLinkText: 'text-amber-600'
  }
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
  childrenTop
}: PersonalizedServiceTemplateProps) {
  const { t } = useLanguage();
  const serviceData = PERSONALIZED_SERVICES_DATA.find(s => s.id === serviceId);

  const colorKey = serviceData?.color || 'orange';
  const theme = themeConfig[colorKey] || themeConfig.orange;

  // Fallback methodology steps if none provided but showMethodology is true
  // Try to load from translation keys if methodSteps is empty but showMethodology is true
  const stepsToRender = (methodSteps && methodSteps.length > 0) ? methodSteps : (showMethodology ? [1, 2, 3].map(step => ({
    title: t(`${translationKey}.method.step${step}.title`),
    description: t(`${translationKey}.method.step${step}.desc`)
  })) : []);

  // Filter out any steps that look like translation keys (if t returns the key)
  const validSteps = stepsToRender.filter(step =>
    !step.title.includes(translationKey) && !step.description.includes(translationKey)
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
          themeColor: serviceData?.color || 'orange'
        }}
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 mb-16 relative z-20">
          <Button
            asChild
            size="xl"
            variant="default"
            
          >
            <Link href={`/booking?service=${encodeURIComponent(t(`${translationKey}.hero.title`))}`}>
              {t('nav.bookNow')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Link href="/booking">
            <Button
              size="xl"
              variant="outline"
              className="bg-white/90 backdrop-blur-sm text-gray-800 border-gray-200 hover:bg-white"
            >
              {t('common.askQuestions')}
            </Button>
          </Link>
        </div>
        {childrenTop}
        {/* Understanding Section - Bento Box */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#fbfbfd]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-black">
                {t(`${translationKey}.understanding.title`)}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-[1400px] mx-auto">
              {/* Description 1 - Large box */}
              <div className="col-span-1 md:col-span-2 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-gray-100   transition-all duration-500 relative overflow-hidden group">
                 <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full ${theme.bg} transition-colors duration-500`} />
                 <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 font-medium leading-tight relative z-10 text-balance">
                    {t(`${translationKey}.understanding.description1`)}
                 </p>
                 <p className="mt-6 sm:mt-8 text-base sm:text-lg text-gray-500 leading-relaxed max-w-2xl font-medium relative z-10">
                    {t(`${translationKey}.understanding.description2`)}
                 </p>
                 <div className="mt-6 sm:mt-8 relative z-10">
                    <p className={`font-semibold tracking-tight ${theme.text} text-sm sm:text-base`}>
                      {t(`${translationKey}.understanding.callToAction`)}
                    </p>
                 </div>
              </div>

              {/* Benefits Box */}
              {benefits.length > 0 && (
                <div className={`col-span-1 p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] ${theme.bg} ${theme.border} border  transition-all duration-500 flex flex-col justify-center`}>
                  <h3 className={`font-semibold text-xl sm:text-2xl mb-4 sm:mb-6 tracking-tight ${theme.text}`}>
                    {t('common.benefits') || t(`${translationKey}.benefits.title`) || 'Beneficis clau'}
                  </h3>
                  <ul className="space-y-3 sm:space-y-4">
                    {benefits.map((benefit: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 sm:gap-4">
                        <div className={`mt-2 w-2 h-2 rounded-full ${theme.dots} shrink-0`} />
                        <span className={`text-base sm:text-lg font-medium leading-tight ${theme.text}`}>{benefit}</span>
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
          <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-12 sm:mb-16 text-center text-black">
                {t(`${translationKey}.method.title`)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
                {validSteps.map((step, index) => (
                    <div key={index} className={`rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-gray-100 ${theme.stepsBg}  group  transition-all duration-500`}>
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${theme.stepsIconBg} flex items-center justify-center ${theme.stepsIconText} text-xl sm:text-2xl font-semibold mb-6 sm:mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      {index + 1}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-gray-900 tracking-tight leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recommended Services Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-[#fbfbfd]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter mb-3 sm:mb-4 text-black">
                {t(`${translationKey}.services.title`)}
              </h2>
              <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto tracking-tight font-medium">
                {t(`${translationKey}.services.subtitle`)}
              </p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5 sm:gap-6 md:gap-8`}>
              {recommendedServices.map((service, index) => {
                const details = (
                  <div className="flex items-center gap-6 mt-8 p-6 bg-gray-50 rounded-2xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t('common.duration') || 'Duration'}</span>
                      <span className="text-xl font-semibold text-gray-900">{service.duration || '60-90 min'}</span>
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





