'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { BOOKING_APP_URL } from '@/lib/config';

export default function Adults() {
 const { t } = useLanguage();

 return (
  <>
   <SEOHead
    title={`${t('elena.target.adults.title')} - EKA Balance`}
    description={t('elena.target.adults.desc')}
    url="https://ekabalance.com/services/adults"
   />
   
   {/* Hero Section */}
   <section className="py-12 sm:py-20 bg-linear-to-br from-white via-amber-50/30 to-orange-50/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="order-2 lg:order-1">
       <div className="inline-flex items-center px-4 py-2 bg-amber-100 rounded-full mb-6">
        <span className="text-amber-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
       </div>

       <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
        {t('elena.target.adults.title')}
       </h1>

       <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        {t('elena.target.adults.desc')}
       </p>

       <div className="flex flex-col sm:flex-row gap-4">
        <Link
         href={BOOKING_APP_URL}
         className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full transition-colors duration-200 inline-block text-center"
        >
         {t('common.reserveSession')}
        </Link>
       </div>
      </div>

      <div className="order-1 lg:order-2">
       <div className="relative w-full h-100 sm:h-125">
        <Image
         src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=1920&h=1080&fit=crop"
         alt={t('elena.target.adults.title')}
         fill
         className="object-cover rounded-4xl shadow-2xl"
         sizes="(max-width: 1024px) 100vw, 50vw"
        />
       </div>
      </div>
     </div>
    </div>
   </section>
  </>
 );
}
