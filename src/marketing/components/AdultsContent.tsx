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

  const kinesiologyBase = SERVICES_DATA.find(s => s.id === 'kinesiologia');
  const customKinesiology: ServiceItem = {
      ...kinesiologyBase!,
      id: 'kinesiology-adult',
      subtitleKey: 'adult.kinesiology.badge',
      descriptionKey: 'services.kinesiology.shortDesc',
      image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop'
  };

  const nutritionBase = SERVICES_DATA.find(s => s.id === 'nutritio');
  const customNutrition: ServiceItem = {
      ...nutritionBase!,
      id: 'nutrition-adult',
      subtitleKey: 'adult.nutrition.badge',
      descriptionKey: 'services.nutrition.shortDesc', // Fallback or check if exists
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop'
  };

  const HeroCustom = (
      <section className="py-20 sm:py-28 bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-center text-center">
            <h1 className="heading-1 mb-6 max-w-4xl">
              {t('elena.target.adults.title')}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mb-12 font-light leading-relaxed">
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
      
      <section className="py-24 bg-[#fbfbfd] relative z-10 -mt-10 rounded-t-[3rem] ">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900 tracking-tighter">
                {t('adult.recommended')}
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium tracking-tight">
                {t('adult.recommended.desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-[1200px] mx-auto">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="heading-2 mb-6 font-bold">{t('adult.cta.title')}</h2>
            <p className="text-xl text-gray-600 mb-8 font-light">
                {t('adult.cta.desc')}
            </p>
            <Link href="/booking">
                <Button size="xl" variant="default">
                    {t('common.bookNow')}
                </Button>
            </Link>
        </div>
      </section>
    </PageLayout>
    </>
  );
}
