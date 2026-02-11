'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { PERSONALIZED_SERVICES_DATA } from '@/shared/marketing/constants';
import { ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';

import PersonalizedServiceCard from '@/components/marketing/PersonalizedServiceCard';
import PageLayout from './PageLayout';

export default function PersonalizedServicesContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
      hero={{
        badge: t('personalizedServices.title'),
        subtitle: t('personalizedServices.subtitle'),
        title: t('services.therapiesFor'),
        icon: <Star className="h-4 w-4" />,
      }}
    >
      {/* Helper text for title */}
      <div className="animate-fade-in relative z-20 -mt-8 mb-12 text-center">
        <span className="bg-linear-to-r from-info to-accent bg-clip-text text-xl font-medium text-transparent sm:text-2xl">
          {t('services.integralWellbeing')}
        </span>

        <div className="mt-8 flex justify-center">
          <Link href="/book">
            <Button
              size="lg"
              className="btn btn-accent rounded-2xl border-none px-8 py-4 shadow-xl"
            >
              {t('personalizedServices.cta')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Service List - Revised to use Cards */}
      <section className="pb-16 sm:pb-24">
        <div className="section-container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="heading-2 mb-6">{t('personalizedServices.choose.title')}</h2>
            <p className="text-body-lg">{t('personalizedServices.choose.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
            {PERSONALIZED_SERVICES_DATA.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PersonalizedServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}

