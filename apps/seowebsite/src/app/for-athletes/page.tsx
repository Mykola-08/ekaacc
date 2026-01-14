'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import { Zap, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function AthletesPersonalized() {
 const { navigateToBooking } = useBooking();
 const { t } = useLanguage();

 const recommendedServices = [
  {
   id: 'sports-massage',
   title: t('personalized.athletes.services.sportsMassage.title'),
   description: t('personalized.athletes.services.sportsMassage.description'),
   duration: '60-90 min',
   link: '/services/massage'
  },
  {
   id: 'osteobalance',
   title: t('personalized.athletes.services.osteobalance.title'),
   description: t('personalized.athletes.services.osteobalance.description'),
   duration: '60-90 min',
   link: '/services/osteobalance'
  }
 ];

 return (
  <>
   <SEOHead
    title={t('seo.athletes.title')}
    description={t('seo.athletes.description')}
    keywords={t('seo.athletes.keywords')}
    url="https://ekabalance.com/for-athletes"
   />
    {/* Hero Section */}
    <section className="py-16 sm:py-24 bg-gradient-to-br from-orange-50 to-red-50">
     <div className="max-w-6xl mx-auto px-4 sm:px-8">
      <div className="text-center mb-12">
       <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-8">
        <Zap className="w-10 h-10 text-orange-600" />
       </div>
       
       <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
        {t('personalized.athletes.hero.title')}
       </h1>
       
       <p className="text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
        {t('personalized.athletes.hero.description')}
       </p>
       
       <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
         onClick={() => navigateToBooking()}
         className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-8 py-4 rounded-full transition-colors duration-200 inline-flex items-center"
        >
         {t('common.bookNow')}
         <ArrowRight className="w-5 h-5 ml-2" />
        </button>
        <Link
         href="/contact"
         className="bg-card hover:bg-muted/30 text-foreground/90 font-semibold px-8 py-4 rounded-full border-2 border-gray-200 transition-colors duration-200 flex items-center justify-center"
        >
         {t('common.askQuestions')}
        </Link>
       </div>
      </div>
     </div>
    </section>

    {/* Understanding Section */}
    <section className="py-16 bg-card">
     <div className="max-w-4xl mx-auto px-4 sm:px-8">
      <div className="bg-orange-50 rounded-[32px] p-8 sm:p-12">
       <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-6">
        {t('personalized.athletes.understanding.title')}
       </h2>
       <div className="space-y-4 text-foreground/90 leading-relaxed">
        <p>{t('personalized.athletes.understanding.description1')}</p>
        <p>{t('personalized.athletes.understanding.description2')}</p>
        <p className="font-medium text-orange-900">
         {t('personalized.athletes.understanding.callToAction')}
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
        {t('personalized.athletes.services.title')}
       </h2>
       <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t('personalized.athletes.services.subtitle')}
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
          <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
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
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-[32px] p-8 sm:p-12">
       <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
         <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-orange-600" />
         </div>
        </div>
        <div>
         <h3 className="text-xl font-semibold text-foreground mb-4">
          {t('personalized.athletes.testimonial.title')}
         </h3>
         <blockquote className="text-foreground/90 italic leading-relaxed mb-4">
          "{t('personalized.athletes.testimonial.quote')}"
         </blockquote>
         <cite className="text-sm text-muted-foreground not-italic">
          {t('personalized.athletes.testimonial.author')}
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
