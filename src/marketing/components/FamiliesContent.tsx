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

export default function FamiliesContent() {
  const { t } = useLanguage();

  const kinesiologyBase = SERVICES_DATA.find(s => s.id === 'kinesiologia');
  const familyKinesiology: ServiceItem = {
      ...kinesiologyBase!,
      id: 'kinesiology-family',
      subtitleKey: 'families.kinesiology.badge',
      descriptionKey: 'services.kinesiology.shortDesc',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop'
  };

  const nutritionBase = SERVICES_DATA.find(s => s.id === 'nutritio');
  const familyNutrition: ServiceItem = {
      ...nutritionBase!,
      id: 'nutrition-family',
      subtitleKey: 'families.nutrition.badge',
      descriptionKey: 'services.nutrition.shortDesc',
      image: 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?q=80&w=2070&auto=format&fit=crop'
  };

  const Hero = (
      <section className="py-12 sm:py-20 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
                <span className="text-green-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-eka-dark mb-6 leading-tight">
                {t('elena.target.families.title')}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
                {t('elena.target.families.desc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/booking">
                   <Button size="xl" variant="default" className="px-8 py-4 normal-case">
                      {t('common.reserveSession')}
                   </Button>
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative w-full h-[400px] sm:h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=1920&h=1080&fit=crop"
                  alt={t('elena.target.families.title')}
                  fill
                  className="object-cover rounded-apple-xl  rotate-1 hover:rotate-0 transition-transform duration-500"
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
        titleKey="seo.families.title"
        descriptionKey="seo.families.description"
        keywordsKey="seo.families.keywords"
      />
      <PageLayout>
      {Hero}
      
      {/* Recommended Services - Added for better UX */}
      <section className="py-24 bg-[#fbfbfd]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold mb-4 text-gray-900 tracking-tighter">
                {t('families.recommended')}
              </h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium tracking-tight">
                {t('families.recommended.desc')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-[1200px] mx-auto">
               <ServiceBentoItem 
                  title={t(familyKinesiology.titleKey)} 
                  description={t(familyKinesiology.descriptionKey)} 
                  image={familyKinesiology.image} 
               />
               <ServiceBentoItem 
                  title={t(familyNutrition.titleKey)} 
                  description={t(familyNutrition.descriptionKey)} 
                  image={familyNutrition.image} 
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
