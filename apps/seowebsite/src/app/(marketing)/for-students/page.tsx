'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import { Brain, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function StudentsPersonalized() {
 const { navigateToBooking } = useBooking();
 const { t } = useLanguage();

 const recommendedServices = [
  {
   id: 'kinesiology-stress',
   title: t('personalized.students.services.kinesiologyStress.title'),
   description: t('personalized.students.services.kinesiologyStress.description'),
   duration: '60 min',
   link: '/services/kinesiology'
  },
  {
   id: 'relaxing-massage',
   title: t('personalized.students.services.relaxingMassage.title'),
   description: t('personalized.students.services.relaxingMassage.description'),
   duration: '60-90 min',
   link: '/services/massage'
  }
 ];

 return (
  <>
   <SEOHead
    title={t('seo.students.title')}
    description={t('seo.students.description')}
    keywords={t('seo.students.keywords')}
    url="https://ekabalance.com/for-students"
   />
    {/* Hero Section */}
    <section className="py-16 sm:py-24 bg-linear-to-br from-blue-50 to-indigo-100">
     <div className="max-w-6xl mx-auto px-4 sm:px-8">
      <div className="text-center mb-12">
       <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-8">
        <Brain className="w-10 h-10 text-blue-600" />
       </div>
       
       <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
        {t('personalized.students.hero.title')}
       </h1>
       
       <p className="text-xl text-foreground/90 max-w-3xl mx-auto leading-relaxed mb-8">
        {t('personalized.students.hero.description')}
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
         className="bg-card hover:bg-muted/30 text-foreground/90 font-semibold px-8 py-4 rounded-full border-2 border-border transition-colors duration-200 flex items-center justify-center"
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
      <div className="bg-blue-50 rounded-[32px] p-8 sm:p-12">
       <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-6">
        {t('personalized.students.understanding.title')}
       </h2>
       <div className="space-y-4 text-foreground/90 leading-relaxed">
        <p>{t('personalized.students.understanding.description1')}</p>
        <p>{t('personalized.students.understanding.description2')}</p>
        <p className="font-medium text-blue-900">
         {t('personalized.students.understanding.callToAction')}
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
        {t('personalized.students.services.title')}
       </h2>
       <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t('personalized.students.services.subtitle')}
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
          <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
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
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-[32px] p-8 sm:p-12">
       <div className="flex items-start space-x-4">
        <div className="shrink-0">
         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-blue-600" />
         </div>
        </div>
        <div>
         <h3 className="text-xl font-semibold text-foreground mb-4">
          {t('personalized.students.testimonial.title')}
         </h3>
         <blockquote className="text-foreground/90 italic leading-relaxed mb-4">
          "{t('personalized.students.testimonial.quote')}"
         </blockquote>
         <cite className="text-sm text-muted-foreground not-italic">
          {t('personalized.students.testimonial.author')}
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
