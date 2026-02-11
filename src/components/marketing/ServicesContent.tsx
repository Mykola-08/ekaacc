'use client';

import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { SERVICES_DATA } from '@/shared/marketing/constants';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
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
          <Button size="lg" className="rounded-xl px-8 py-6 text-lg shadow-lg transition-all hover:scale-105 active:scale-95">
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
      <section className="border-t border-border bg-card py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mx-auto max-w-2xl rounded-xl border border-border bg-muted p-6 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{t('services.disclaimerPrefix')}:</span>{' '}
            {t('services.disclaimerBody')}
          </p>
        </div>
      </section>
    </PageLayout>
  );
}
