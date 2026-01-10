'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import { Button } from 'keep-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { PERSONALIZED_SERVICES_DATA } from '@/shared/constants';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import PersonalizedServiceCard from '@/app/components/PersonalizedServiceCard';

export default function PersonalizedServices() {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead
        title={t('personalizedServices.title')}
        description={t('personalizedServices.subtitle')}
        keywords="personalized services, office workers, athletes, artists, musicians, students"
      />
      
      {/* Unified Gradient Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
             <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm mb-8">
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                {t('personalizedServices.title')}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-tight">
              {t('services.therapiesFor')}{' '}
              <span className="font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('services.integralWellbeing')}
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              {t('personalizedServices.subtitle')}
            </p>

            <Link href="/booking">
              <Button 
                size="xl" 
                className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-xl border-none"
              >
                {t('personalizedServices.cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service List - Revised to use Cards */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
           <div className="text-center mb-24">
            <h2 className="text-4xl font-light text-gray-900 mb-6">
              {t('personalizedServices.choose.title')}
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              {t('personalizedServices.choose.subtitle')}
            </p>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
    </>
  );
}
