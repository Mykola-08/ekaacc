'use client';

import Link from 'next/link';
import { Heart, Brain, Leaf, RotateCcw, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { SERVICES_DATA } from '@/shared/constants';
import { motion } from 'framer-motion';
import { Button } from 'keep-react';
import LazyImage from '@/react-app/components/LazyImage';
import ServiceCard from '@/app/components/ServiceCard';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Leaf,
  RotateCcw
};

export default function Services() {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full mb-8 shadow-sm">
              <Heart className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">{t('services.integralWellbeingFor')}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
              {t('services.ourServices')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium">
                {t('services.ourServices2') || 'Therapies'}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              {t('services.wellnessPath')}
            </p>

            <div className="flex justify-center">
              <Link
                href="/booking"
              >
                 <Button 
                  size="xl" 
                  className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-xl border-none"
                >
                  {t('common.bookNow')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid (Revised to use Cards) */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
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
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            <span className="font-semibold">{t('services.disclaimerPrefix')}:</span> {t('services.disclaimerBody')}
          </p>
        </div>
      </section>
    </>
  );
}
