'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { SERVICES_DATA } from '@/shared/marketing/constants';
import { motion } from 'framer-motion';
import { Button } from 'keep-react';
import ServiceCard from '@/components/marketing/ServiceCard';
import PageLayout from './PageLayout';

export default function ServicesContent() {
  const { t } = useLanguage();

  return (
    <PageLayout
      hero={{
        badge: t('services.integralWellbeingFor'),
        title: t('services.ourServices'),
        subtitle: t('services.wellnessPath'),
        icon: <Heart className="h-4 w-4" />,
      }}
    >
      {/* Quick CTA */}
      <div className="relative z-20 -mt-8 mb-16 flex justify-center">
        <Link href="/book">
          <Button size="xl" className="btn btn-accent rounded-xl border-none px-8 py-4 normal-case">
            {t('common.bookNow')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Services Grid (Revised to use Cards) */}
      <section className="pb-16 sm:pb-24">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
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
      <section className="border-t border-gray-100 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mx-auto max-w-2xl rounded-xl border border-gray-100 bg-gray-50 p-6 text-sm text-gray-500">
            <span className="font-semibold text-gray-700">{t('services.disclaimerPrefix')}:</span>{' '}
            {t('services.disclaimerBody')}
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
