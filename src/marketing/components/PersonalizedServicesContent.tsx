'use client';

import Link from 'next/link';
import { Button } from '@/marketing/components/ui/button';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { PERSONALIZED_SERVICES_DATA } from '@/marketing/shared/constants';
import { motion } from 'framer-motion';

import PersonalizedServiceCard from '@/marketing/components/PersonalizedServiceCard';
import PageLayout from './PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon, StarIcon } from '@hugeicons/core-free-icons';

export default function PersonalizedServicesContent() {
  const { t } = useLanguage();

  return (
    <>
      <SEOUpdater
        titleKey="seo.personalized.title"
        descriptionKey="seo.personalized.description"
        keywordsKey="seo.personalized.keywords"
      />
      <PageLayout
        hero={{
          title: t('personalizedServices.title'),
          subtitle: t('personalizedServices.subtitle'),
          badge: t('services.therapiesFor'),
          icon: <HugeiconsIcon icon={StarIcon} className="size-4" />,
        }}
        className="bg-white"
      >
        {/* Intro / CTA Section */}
        <div className="animate-fade-in relative z-20 -mt-8 mb-16 px-6 text-center">
          <div className="mt-8 flex justify-center">
            <Link href="/booking">
              <Button size="lg" variant="default" className="px-8 py-4">
                {t('personalizedServices.cta')}
                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Service List - Gray Background for Cards */}
        <section className="bg-secondary py-16 sm:py-24">
          <div className="section-container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="heading-2 mb-4 text-black">
                {t('personalizedServices.choose.title')}
              </h2>
              <p className="text-body-lg text-gray-500">
                {t('personalizedServices.choose.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              {PERSONALIZED_SERVICES_DATA.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={
                    index === PERSONALIZED_SERVICES_DATA.length - 1 &&
                    PERSONALIZED_SERVICES_DATA.length % 2 !== 0
                      ? 'mx-auto w-full max-w-2xl lg:col-span-2'
                      : ''
                  }
                >
                  <PersonalizedServiceCard service={service} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
