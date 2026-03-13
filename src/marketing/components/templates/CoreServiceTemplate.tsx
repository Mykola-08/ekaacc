'use client';

import React from 'react';
import { CheckCircle2, Star, Clock } from 'lucide-react';
import { useBooking } from '@/marketing/hooks/useBooking';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import PageLayout from '@/marketing/components/PageLayout';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';
import { Button } from '@/marketing/components/ui/button';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import FAQ from '@/marketing/components/FAQ';
import CTASection from '@/marketing/components/CTASection';
import { SERVICES_DATA } from '@/marketing/shared/constants';

interface PricingOption {
  duration: number | string;
  price?: number;
  descriptionKey?: string;
  nameKey?: string;
}

interface Testimonial {
  name: string;
  text: string;
  rating: number;
}

interface CoreServiceTemplateProps {
  serviceId: string;
  hero: {
    titleKey: string;
    subtitleKey: string;
    badgeKey: string;
    icon?: React.ElementType;
  };
  bentoGrid?: {
    titleKey: string;
    subtitleKey?: string;
    items: Array<{
      titleKey: string;
      descriptionKey: string;
      detailsKey?: string;
      image?: string;
      colSpan?: number;
    }>;
  };
  features: {
    titleKey: string;
    subtitleKey: string;
    benefits: string[]; // translation keys or direct text
  };
  pricing: {
    titleKey: string;
    subtitleKey: string;
    options: PricingOption[];
  };
  testimonials?: {
    titleKey: string;
    items: Testimonial[];
  };
  faqItems?: Array<{ id: string; question: string; answer: string }>;
  seoKeys: {
    title: string;
    description: string;
    keywords: string;
  };
}

const iconColorMap: Record<string, string> = {
  orange: 'text-orange-600 bg-orange-100',
  blue: 'text-blue-600 bg-blue-100',
  green: 'text-green-600 bg-green-100',
  purple: 'text-purple-600 bg-purple-100',
  pink: 'text-pink-600 bg-pink-100',
  amber: 'text-amber-600 bg-amber-100',
};

export default function CoreServiceTemplate({
  serviceId,
  hero,
  bentoGrid,
  features,
  pricing,
  testimonials,
  faqItems,
  seoKeys,
}: CoreServiceTemplateProps) {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();
  const serviceData = SERVICES_DATA.find((s) => s.id === serviceId);
  const theme = serviceData?.color || 'blue';

  // Styles based on theme
  const iconStyle = iconColorMap[theme] || iconColorMap.blue;

  return (
    <>
      <SEOUpdater
        titleKey={seoKeys.title}
        descriptionKey={seoKeys.description}
        keywordsKey={seoKeys.keywords}
      />
      <PageLayout
        hero={{
          title: t(hero.titleKey),
          subtitle: t(hero.subtitleKey),

          backgroundImage: serviceData?.image,
          themeColor: theme,
        }}
      >
        {/* Bento Grid Section */}
        {bentoGrid && (
          <section className="relative z-10 bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
              <div className="mb-16 text-center">
                <h2 className="mb-6 text-4xl font-semibold tracking-tighter text-balance text-black md:text-6xl">
                  {t(bentoGrid.titleKey)}
                </h2>
                {bentoGrid.subtitleKey && (
                  <p className="mx-auto max-w-3xl text-xl font-medium tracking-tight text-gray-500 md:text-2xl">
                    {t(bentoGrid.subtitleKey)}
                  </p>
                )}
              </div>
              <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
                {bentoGrid.items.map((item, index) => {
                  let spanClass = 'col-span-1';
                  if (item.colSpan === 2) spanClass = 'md:col-span-2';
                  if (item.colSpan === 3) spanClass = 'md:col-span-2 lg:col-span-3';

                  const title =
                    t(item.titleKey) !== item.titleKey ? t(item.titleKey) : item.titleKey;
                  const desc =
                    t(item.descriptionKey) !== item.descriptionKey
                      ? t(item.descriptionKey)
                      : item.descriptionKey;
                  const detailsKey = item.detailsKey || item.descriptionKey;
                  const details = t(detailsKey) !== detailsKey ? t(detailsKey) : detailsKey;

                  return (
                    <div key={index} className={spanClass}>
                      <ServiceBentoItem
                        title={title}
                        description={desc}
                        image={item.image}
                        details={<p>{details}</p>}
                        delay={0.1 * index}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section - Apple Bento Layout */}
        <section className="bg-[#fbfbfd] py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-semibold tracking-tighter text-black md:text-5xl">
                {t(features.titleKey)}
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-medium tracking-tight text-gray-500">
                {t(features.subtitleKey)}
              </p>
            </div>

            <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
              {features.benefits.map((benefit, index) => {
                const title = t(benefit) !== benefit ? t(benefit) : benefit;
                return (
                  <div
                    key={index}
                    className="group relative flex min-h-[180px] flex-col justify-start overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-6 transition-all duration-500 sm:rounded-[2.5rem] sm:p-8 md:p-10"
                  >
                    <div className="absolute -top-4 -right-4 transform p-8 opacity-[0.03] transition-opacity duration-500 group-hover:scale-110 group-hover:opacity-[0.05]">
                      <CheckCircle2 className="h-40 w-40" />
                    </div>
                    <div
                      className={`relative z-10 mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 sm:rounded-2xl ${iconStyle} shrink-0 transition-transform duration-500 group-hover:scale-110`}
                    >
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="relative z-10 w-[95%] text-xl leading-[1.2] font-semibold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                      {title}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing / Duration Section */}
        <section className="relative bg-white py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-semibold tracking-tighter text-black md:text-5xl">
                {t(pricing.titleKey)}
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-medium tracking-tight text-gray-500">
                {t(pricing.subtitleKey)}
              </p>
            </div>

            <div
              className={`mx-auto grid max-w-[1200px] gap-6 md:gap-8 ${pricing.options.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}
            >
              {pricing.options.map((option, index) => (
                <div
                  key={index}
                  className="group relative flex flex-col items-center overflow-hidden rounded-[2rem] border border-gray-100 bg-[#fbfbfd] p-6 text-center transition-all duration-500 hover:border-gray-200 sm:rounded-[2.5rem] sm:p-8 md:p-10"
                >
                  <div className="absolute top-0 right-0 z-0 h-32 w-32 rounded-bl-full bg-gray-100 opacity-50 transition-colors duration-500 group-hover:bg-blue-50" />

                  <div
                    className={`relative z-10 mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-white transition-transform duration-500 group-hover:scale-110 ${iconStyle}`}
                  >
                    <Clock className="h-7 w-7" />
                  </div>

                  {option.nameKey && (
                    <h3 className="relative z-10 mb-2 text-lg font-medium tracking-tight text-gray-500">
                      {t(option.nameKey) !== option.nameKey ? t(option.nameKey) : option.nameKey}
                    </h3>
                  )}

                  <h3 className="relative z-10 mb-4 text-4xl font-semibold tracking-tighter text-gray-900 md:text-5xl">
                    {typeof option.duration === 'number' ? `${option.duration}'` : option.duration}
                  </h3>

                  {option.descriptionKey && (
                    <p className="relative z-10 mb-8 max-w-[250px] text-sm leading-relaxed font-medium text-gray-500">
                      {t(option.descriptionKey)}
                    </p>
                  )}

                  {option.price && (
                    <div className="relative z-10 mb-8">
                      <span className="text-4xl font-semibold tracking-tighter text-gray-900">
                        {option.price}€
                      </span>
                    </div>
                  )}

                  <div className="relative z-10 mt-auto w-full pt-4">
                    <Button
                      onClick={() => navigateToBooking()}
                      variant="default"
                      size="lg"
                      className="w-full rounded-full bg-[#1d1d1f] text-lg font-medium text-white transition-all hover:bg-[#000000]"
                    >
                      {t('common.bookNow')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials (Optional) */}
        {testimonials && testimonials.items.length > 0 && (
          <section className="bg-white py-16 sm:py-20 lg:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="heading-2 mb-16 text-center">{t(testimonials.titleKey)}</h2>
              <div className="grid gap-8 md:grid-cols-2">
                {testimonials.items.map((testimonial, i) => (
                  <div
                    key={i}
                    className="flex h-full flex-col rounded-3xl border border-gray-100 bg-gray-50 p-8 transition duration-300 hover:bg-white"
                  >
                    <div className="mb-4 flex gap-1 text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="mb-6 flex-grow text-lg text-gray-600 italic">
                      &ldquo;{testimonial.text}&rdquo;
                    </p>
                    <div className="mt-auto font-semibold text-gray-900">{testimonial.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {faqItems ? <FAQ items={faqItems} /> : <FAQ />}
        <CTASection />
      </PageLayout>
    </>
  );
}
