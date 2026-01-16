'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, CheckCircle } from 'lucide-react';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function ParentsPersonalized() {
 const { navigateToBooking } = useBooking();
 const { t } = useLanguage();

 const recommendedServices = [
  {
   id: 'emotional-kinesiology',
   title: t('personalized.parents.services.emotionalKinesiology.title'),
   description: t('personalized.parents.services.emotionalKinesiology.description'),
   duration: '60-90 min',
   link: '/services/kinesiology'
  },
  {
   id: 'relaxing-massage',
   title: t('personalized.parents.services.relaxingMassage.title'),
   description: t('personalized.parents.services.relaxingMassage.description'),
   duration: '60-90 min',
   link: '/services/massage'
  }
 ];

 return (
  <>
   <SEOHead
    title={t('seo.parents.title')}
    description={t('seo.parents.description')}
    keywords={t('seo.parents.keywords')}
    url="https://ekabalance.com/for-parents"
   />
    {/* Hero Section */}
    <section className="py-12 sm:py-20 bg-linear-to-br from-white via-pink-50/30 to-rose-50/50">
     <div className="max-w-7xl mx-auto px-4 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
       <div className="order-2 lg:order-1">
        <div className="inline-flex items-center px-4 py-2 bg-pink-100 rounded-full mb-6">
         <span className="text-pink-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
         {t('personalized.parents.hero.title')}
        </h1>

        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
         {t('personalized.parents.hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
         <button
          onClick={() => navigateToBooking()}
          className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-8 py-4 rounded-full transition-colors duration-200 inline-block text-center"
         >
          {t('common.bookNow')}
         </button>
          <Link
          href="/contact"
          className="inline-flex items-center justify-center text-pink-600 font-semibold px-8 py-4 rounded-full border-2 border-pink-100 hover:border-pink-200 hover:bg-pink-50 transition-all duration-300"
         >
          {t('common.askQuestions')}
         </Link>
        </div>
       </div>

       <div className="order-1 lg:order-2">
        <div className="relative">
         <Image
          src="https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1920&h=1080&fit=crop"
          alt={t('personalized.parents.hero.title')}
          className="w-full h-[400px] sm:h-[500px] object-cover rounded-[32px] shadow-2xl"
          width={1920}
          height={1080}
         />
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* Understanding Section */}
    <section className="py-16 bg-card">
     <div className="max-w-4xl mx-auto px-4 sm:px-8">
      <div className="bg-pink-50 rounded-[32px] p-8 sm:p-12">
       <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-6">
        {t('personalized.parents.understanding.title')}
       </h2>
       <div className="space-y-4 text-foreground/90 leading-relaxed">
        <p>{t('personalized.parents.understanding.description1')}</p>
        <p>{t('personalized.parents.understanding.description2')}</p>
        <p className="font-medium text-pink-900">
         {t('personalized.parents.understanding.callToAction')}
        </p>
       </div>
      </div>
     </div>
    </section>

    {/* Recommended Services */}
    <section className="py-16 bg-muted/30">
     <div className="max-w-6xl mx-auto px-4 sm:px-8">
      <div className="text-center mb-12">
       <h2 className="text-3xl font-light text-foreground mb-4">
        {t('personalized.parents.services.title')}
       </h2>
       <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t('personalized.parents.services.subtitle')}
       </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       {recommendedServices.map((service, index) => (
        <div key={service.id} className="bg-card rounded-[32px] p-8 border-none ">
         <div className="flex items-start justify-between mb-6">
          <div>
           <h3 className="text-xl font-semibold text-foreground mb-2">
            {service.title}
           </h3>
           <div className="flex items-center text-muted-foreground mb-4">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{service.duration}</span>
           </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 text-sm font-medium rounded-full">
           #{index + 1} {t('common.recommended')}
          </span>
         </div>
         
         <p className="text-foreground/90 leading-relaxed mb-6">
          {service.description}
         </p>
         
         <div className="flex gap-4">
          <Link
           href={service.link}
           className="flex-1 bg-muted hover:bg-gray-200 text-foreground/90 font-semibold px-6 py-3 rounded-full transition-colors duration-200 text-center"
          >
           {t('common.learnMore')}
          </Link>
          <button
           onClick={() => navigateToBooking()}
           className="flex-1 bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-6 py-3 rounded-full transition-colors duration-200"
          >
           {t('common.bookNow')}
          </button>
         </div>
        </div>
       ))}
      </div>
     </div>
    </section>

    {/* Success Story */}
    <section className="py-16 bg-card">
     <div className="max-w-4xl mx-auto px-4 sm:px-8">
      <div className="bg-linear-to-r from-pink-50 to-rose-50 rounded-[32px] p-8 sm:p-12">
       <div className="flex items-start space-x-4">
        <div className="shrink-0">
         <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-pink-600" />
         </div>
        </div>
        <div>
         <h3 className="text-xl font-semibold text-foreground mb-4">
          {t('personalized.parents.testimonial.title')}
         </h3>
         <blockquote className="text-foreground/90 italic leading-relaxed mb-4">
          "{t('personalized.parents.testimonial.quote')}"
         </blockquote>
         <cite className="text-sm text-muted-foreground not-italic">
          {t('personalized.parents.testimonial.author')}
         </cite>
        </div>
       </div>
      </div>
     </div>
    </section>

    {/* Disclaimer */}
    <section className="py-12 bg-muted/30">
     <div className="max-w-4xl mx-auto px-4 sm:px-8">
      <div className="text-center">
       <p className="text-sm text-muted-foreground leading-relaxed">
        {t('common.disclaimer')}
       </p>
      </div>
     </div>
    </section>
  </>
 );
}
