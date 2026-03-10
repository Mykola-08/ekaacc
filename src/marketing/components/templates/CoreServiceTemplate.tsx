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
  seoKeys
}: CoreServiceTemplateProps) {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();
  const serviceData = SERVICES_DATA.find(s => s.id === serviceId);
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
          themeColor: theme
        }}
      >
      {/* Bento Grid Section */}
      {bentoGrid && (
        <section className="py-16 sm:py-20 lg:py-24 bg-white relative z-10">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-6 text-balance text-black">
                {t(bentoGrid.titleKey)}
              </h2>
              {bentoGrid.subtitleKey && (
                <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto tracking-tight font-medium">
                  {t(bentoGrid.subtitleKey)}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-[1400px] mx-auto">
              {bentoGrid.items.map((item, index) => {
                 let spanClass = "col-span-1";
                 if (item.colSpan === 2) spanClass = "md:col-span-2";
                 if (item.colSpan === 3) spanClass = "md:col-span-2 lg:col-span-3";
                 
                 const title = t(item.titleKey) !== item.titleKey ? t(item.titleKey) : item.titleKey;
                 const desc = t(item.descriptionKey) !== item.descriptionKey ? t(item.descriptionKey) : item.descriptionKey;
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
      <section className="py-16 sm:py-20 lg:py-24 bg-[#fbfbfd]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-black">
              {t(features.titleKey)}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto tracking-tight font-medium">
              {t(features.subtitleKey)}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-[1400px] mx-auto">
            {features.benefits.map((benefit, index) => {
              const title = t(benefit) !== benefit ? t(benefit) : benefit;    
                return (
                  <div
                    key={index}
                    className="p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-gray-100   transition-all duration-500 relative overflow-hidden group flex flex-col justify-start min-h-[180px]"
                  >
                    <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500 transform group-hover:scale-110">
                      <CheckCircle2 className="w-40 h-40" />
                    </div>
                      <div className={`w-12 h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 relative z-10 bg-gray-50 ${iconStyle}  group-hover:scale-110 transition-transform duration-500 shrink-0`}>
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight leading-[1.2] relative z-10 w-[95%]">
                      {title}
                    </h3>
                  </div>
                );
            })}
          </div>
        </div>
      </section>

      {/* Pricing / Duration Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tighter mb-4 text-black">
              {t(pricing.titleKey)}
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto tracking-tight font-medium">
              {t(pricing.subtitleKey)}
            </p>
          </div>

          <div className={`grid gap-6 md:gap-8 max-w-[1200px] mx-auto ${pricing.options.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
            {pricing.options.map((option, index) => (
                <div key={index} className="bg-[#fbfbfd] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 border border-gray-100 hover:border-gray-200   transition-all duration-500 group text-center flex flex-col items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-bl-full z-0 opacity-50 group-hover:bg-blue-50 transition-colors duration-500" />
                
                <div className={`flex items-center justify-center mb-8 w-16 h-16 rounded-[1.25rem] bg-white  mx-auto group-hover:scale-110 transition-transform duration-500 relative z-10 ${iconStyle}`}>
                  <Clock className="w-7 h-7" />
                </div>

                {option.nameKey && (
                    <h3 className="text-lg font-medium text-gray-500 tracking-tight mb-2 relative z-10">
                         {t(option.nameKey) !== option.nameKey ? t(option.nameKey) : option.nameKey}
                    </h3>
                )}

                <h3 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tighter mb-4 relative z-10">
                  {typeof option.duration === 'number' ? `${option.duration}'` : option.duration}
                </h3>

                {option.descriptionKey && (
                    <p className="text-gray-500 mb-8 font-medium leading-relaxed text-sm max-w-[250px] relative z-10">
                        {t(option.descriptionKey)}
                    </p>
                )}

                {option.price && (
                   <div className="mb-8 relative z-10">
                      <span className="text-4xl font-semibold tracking-tighter text-gray-900">{option.price}€</span>
                   </div>
                )}

                <div className="mt-auto w-full pt-4 relative z-10">
                    <Button
                        onClick={() => navigateToBooking()}
                        variant="default"
                        size="xl"
                        className="w-full rounded-full bg-[#1d1d1f] hover:bg-[#000000] text-white   transition-all font-medium text-lg"
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
          <section className="py-16 sm:py-20 lg:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="heading-2 text-center mb-16">{t(testimonials.titleKey)}</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {testimonials.items.map((testimonial, i) => (
                        <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 h-full flex flex-col hover:bg-white  transition duration-300">
                             <div className="flex gap-1 mb-4 text-yellow-400">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                             </div>
                             <p className="text-lg text-gray-600 mb-6 italic flex-grow">&ldquo;{testimonial.text}&rdquo;</p>
                             <div className="font-semibold text-gray-900 mt-auto">{testimonial.name}</div>
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




