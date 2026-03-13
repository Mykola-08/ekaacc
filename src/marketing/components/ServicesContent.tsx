'use client';

import { Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { SERVICES_DATA } from '@/marketing/shared/constants';
import { motion } from 'framer-motion';
import { Button } from '@/marketing/components/ui/button';
import ServiceCard from '@/marketing/components/ServiceCard';
import PageLayout from './PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import CTASection from '@/marketing/components/CTASection';

export default function ServicesContent() {
  const { t } = useLanguage();

  return (
    <>
      <SEOUpdater
        titleKey="seo.services.title"
        descriptionKey="seo.services.description"
        keywordsKey="seo.services.keywords"
      />
      <PageLayout
        hero={{
          badge: t('services.integralWellbeingFor'),
          title: `${t('services.ourServices')} ${t('services.ourServices2')}`.trim(),
          subtitle: t('services.wellnessPath'),
          icon: <Heart className="h-4 w-4" />,
        }}
        className="bg-[#fbfbfd]"
        mainClassName="bg-transparent"
      >
        {/* Services Grid (Core) - Transparent Background */}
        <section className="py-16">
          <div className="section-container">
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                {t('services.coreTitle') ||
                  t('services.exploreOurServices') ||
                  'Integral Therapies'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-normal text-gray-500">
                {t('services.coreDesc') ||
                  t('services.descriptionPrefix') ||
                  'From relaxing massages to specialized kinesiology therapies.'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {SERVICES_DATA.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-transparent py-16">
          <div className="section-container">
            <div className="mx-auto max-w-4xl text-center">
              <div className="rounded-3xl border border-gray-200/50 bg-white p-8">
                <p className="text-sm leading-relaxed font-medium text-gray-500">
                  <span className="mb-2 block text-base font-semibold text-gray-900">
                    {t('services.disclaimerPrefix')}:
                  </span>
                  {t('services.disclaimerBody')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </PageLayout>
    </>
  );
}
