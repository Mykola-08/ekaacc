'use client';

import SEOHead from '@/components/marketing/SEOHead';
import { Clock, Brain, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import Image from 'next/image';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@ekaacc/shared-ui';

export default function KinesiologiaPage() {
 const { navigateToBooking } = useBooking();
 const { t } = useLanguage();

 const benefits = [
  t('services.kinesiology.subtitle'),
  t('kinesiology.benefits.posture'),
  t('kinesiology.benefits.stress'),
  t('kinesiology.benefits.energy')
 ];

 const testimonials = [
  {
   name: 'Anna Puig',
   text: t('kinesiology.testimonial.1.text'),
   rating: 5
  },
  {
   name: 'Marc Rivera',
   text: t('kinesiology.testimonial.2.text'),
   rating: 5
  }
 ];

 const durations = [60, 90];

 return (
  <div className="min-h-screen bg-muted/30 font-sans text-foreground">
   <SEOHead
    title={t('seo.kinesiology.title')}
    description={t('seo.kinesiology.description')}
    keywords={t('seo.kinesiology.keywords')}
   />

   {/* Hero Section */}
   <div className="relative bg-linear-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-6 overflow-hidden">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    
    <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
     <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-blue-100 text-sm text-blue-600 mb-8 shadow-sm">
       <Brain className="w-4 h-4" />
       <span className="font-medium">{t('kinesiology.hero.badge')}</span>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-blue-800 to-gray-900 mb-6 tracking-tight leading-tight">
       {t('kinesiology.page.title')}
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
       {t('kinesiology.page.description')}
      </p>

      <div className="flex flex-wrap gap-4">
       <Button 
        onClick={() => navigateToBooking('kinesiology')}
        className="bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-2xl px-8 h-14 text-lg"
       >
        {t('common.bookNow')}
        <ArrowRight className="ml-2 w-5 h-5" />
       </Button>
      </div>
     </div>

     <div className="relative">
      <div className="relative rounded-4xl overflow-hidden shadow-2xl border-none border-white aspect-4/3">
        <Image
         src="https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=1200"
         alt={t('kinesiology.page.imageAlt') || "Kinesiologia Session"}
         fill
         className="object-cover transform hover:scale-105 transition-transform duration-700"
         sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {/* Floating Card */}
      <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-xl border border-gray-100 max-w-xs">
        <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Zap className="w-5 h-5 text-blue-600" />
         </div>
         <div>
          <p className="text-sm font-medium text-foreground">{t('kinesiology.page.availableToday')}</p>
          <p className="text-xs text-muted-foreground">{t('kinesiology.page.bookSession')}</p>
         </div>
        </div>
      </div>
     </div>
    </div>
   </div>

   {/* Benefits Section */}
   <section className="py-24 bg-card">
    <div className="max-w-6xl mx-auto px-6">
     <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('kinesiology.page.benefitsTitle')}</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('kinesiology.page.benefitsSubtitle')}</p>
     </div>

     <div className="grid md:grid-cols-2 gap-8">
      {benefits.map((benefit, index) => (
       <div key={index} className="flex gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-colors">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
         <CheckCircle2 className="w-5 h-5 text-blue-600" />
        </div>
        <span className="text-lg text-foreground/90 font-medium pt-2">{benefit}</span>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Duration & Pricing */}
   <section className="py-24 bg-muted/30">
    <div className="max-w-7xl mx-auto px-6">
     <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('kinesiology.page.durationsTitle')}</h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('kinesiology.page.durationsSubtitle')}</p>
     </div>

     <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {durations.map((duration) => (
       <div key={duration} className="bg-card rounded-4xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-none relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-400 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        
        <div className="flex items-center justify-center mb-6 w-16 h-16 rounded-2xl bg-blue-50 mx-auto group-hover:bg-blue-100 transition-colors">
         <Clock className="w-8 h-8 text-blue-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
         {duration} {t('common.minutes') || 'min'}
        </h3>
        
        <p className="text-muted-foreground mb-8 text-center min-h-12">
         {duration === 60 ? t('kinesiology.page.duration60') :
          t('kinesiology.page.duration90')}
        </p>
        
        <Button
         onClick={() => navigateToBooking('kinesiology')}
         className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 border-none"
        >
         {t('common.bookNow')}
        </Button>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* Testimonials */}
   <section className="py-24 bg-card overflow-hidden">
    <div className="max-w-6xl mx-auto px-6">
     <div className="text-center mb-16">
       <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('kinesiology.page.testimonialsTitle')}</h2>
     </div>

     <div className="grid md:grid-cols-2 gap-8">
      {testimonials.map((testimonial, index) => (
       <div key={index} className="bg-muted/30 rounded-4xl p-10 relative">
         <div className="absolute top-8 left-8 text-6xl text-blue-200 font-serif opacity-50">"</div>
        <div className="flex gap-1 mb-6 relative z-10">
         {[...Array(testimonial.rating)].map((_, i) => (
          <Zap key={i} className="w-5 h-5 fill-blue-400 text-blue-400" />
         ))}
        </div>
        <p className="text-foreground/90 text-lg mb-6 leading-relaxed italic relative z-10">
         {testimonial.text}
        </p>
        <div className="font-bold text-foreground">
         {testimonial.name}
        </div>
       </div>
      ))}
     </div>
    </div>
   </section>

   {/* CTA Section */}
   <section className="py-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-gray-900" />
    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
    
    <div className="relative max-w-4xl mx-auto px-6 text-center">
     <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
      {t('services.readyToStart')}
     </h2>
     <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
      {t('services.contactUsToBook')}
     </p>
     <Button
      onClick={() => navigateToBooking('kinesiology')}
      className="bg-primary hover:bg-primary/90 text-primary-foreground border-none px-10 h-14 rounded-2xl text-lg font-bold"
     >
      {t('common.bookNow')}
     </Button>
    </div>
   </section>
  </div>
 );
}
