'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function Children() {
 const { t } = useLanguage();

 return (
  <>
   <SEOHead
    title={`${t('elena.target.children.title')} - EKA Balance`}
    description={t('elena.target.children.desc')}
    url="https://ekabalance.com/services/children"
   />
   
   {/* Hero Section */}
   <section className="py-12 sm:py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-8">
     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div className="order-2 lg:order-1">
       <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
        <span className="text-blue-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
       </div>

       <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
        {t('elena.target.children.title')}
       </h1>

       <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
        {t('elena.target.children.desc')}
       </p>

       <div className="flex flex-col sm:flex-row gap-4">
        <Link
         href="/booking"
         className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-8 py-4 rounded-full transition-colors duration-200 inline-block text-center"
        >
         {t('common.reserveSession')}
        </Link>
       </div>
      </div>

      <div className="order-1 lg:order-2">
       <div className="relative w-full h-[400px] sm:h-[500px]">
        <Image
         src="https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1920&h=1080&fit=crop"
         alt={t('elena.target.children.title')}
         fill
         className="object-cover rounded-[32px] shadow-2xl"
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
