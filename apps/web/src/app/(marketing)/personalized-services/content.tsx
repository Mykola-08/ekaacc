'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import { Button } from '@ekaacc/shared-ui';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import PersonalizedServiceCard from '@/app/components/PersonalizedServiceCard';
import { BOOKING_APP_URL } from '@/lib/constants';

interface ContentProps {
 services: any[];
}

export default function PersonalizedServicesContent({ services }: ContentProps) {
 const { t } = useLanguage();

 return (
  <>
   <SEOHead
    title={t('personalizedServices.title')}
    description={t('personalizedServices.subtitle')}
    keywords="personalized services, office workers, athletes, artists, musicians, students"
   />
   
   {/* Unified Gradient Hero */}
   <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
     <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
     >
       <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-blue-100 shadow-sm mb-8">
       <span className="text-sm font-medium bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
        {t('personalizedServices.title')}
       </span>
      </div>

      <h1 className="text-5xl lg:text-7xl font-light text-foreground mb-8 tracking-tight leading-tight">
       {t('services.therapiesFor')}{' '}
       <span className="font-medium bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {t('personalizedServices.title')}
       </span>
      </h1>

      <Link href={BOOKING_APP_URL}>
       <Button 
        size="lg" 
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-xl border-none"
       >
        {t('personalizedServices.cta')}
        <ArrowRight className="ml-2 w-5 h-5" />
       </Button>
      </Link>
     </motion.div>
    </div>
   </section>

   {/* Service List - Revised to use Cards */}
   <section className="py-16 sm:py-24 bg-card">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="text-center mb-24">
      <h2 className="text-4xl font-light text-foreground mb-6">
       {t('personalizedServices.choose.title')}
      </h2>
      <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
       {t('personalizedServices.choose.subtitle')}
      </p>
     </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
       {services.map((service, index) => {
         const meta = service.metadata || {};
         // Construct PersonalizedServiceItem
         const item = {
           id: service.id,
           slug: service.slug,
           titleKey: meta.translationKey || service.name,
           descriptionKey: service.description,
           image: service.image_url,
           href: `/services/${service.slug}`,
           benefitsKeys: meta.benefitsKeys || [`personalizedServices.${service.slug}.benefit1`, `personalizedServices.${service.slug}.benefit2`], // Fallback construction
           resultKey: meta.resultKey || `personalizedServices.${service.slug}.result`,
           price: meta.price,
           duration: meta.duration ? `${meta.duration} h` : undefined // Map number to string if needed
         };

         return (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PersonalizedServiceCard service={item} />
          </motion.div>
         );
       })}
      </div>
    </div>
   </section>
  </>
 );
}
