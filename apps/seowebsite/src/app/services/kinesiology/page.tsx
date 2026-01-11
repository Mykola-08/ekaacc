'use client';

import SEOHead from '@/react-app/components/SEOHead';
import { Clock, Brain, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from 'keep-react';

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
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <SEOHead
        title={t('seo.kinesiology.title')}
        description={t('seo.kinesiology.description')}
        keywords={t('seo.kinesiology.keywords')}
      />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 text-sm text-blue-600 mb-8 shadow-sm">
              <Brain className="w-4 h-4" />
              <span className="font-medium">{t('kinesiology.hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 mb-6 tracking-tight leading-tight">
              {t('kinesiology.page.title')}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              {t('kinesiology.page.description')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigateToBooking('kinesiology')}
                className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] border-none rounded-2xl px-8 h-14 text-lg"
              >
                {t('common.bookNow')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
               <img
                  src="https://images.pexels.com/photos/5473182/pexels-photo-5473182.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt={t('kinesiology.page.imageAlt') || "Kinesiologia Session"}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 max-w-xs">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t('kinesiology.page.availableToday')}</p>
                    <p className="text-xs text-gray-500">{t('kinesiology.page.bookSession')}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('kinesiology.page.benefitsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('kinesiology.page.benefitsSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg text-gray-700 font-medium pt-2">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Duration & Pricing */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('kinesiology.page.durationsTitle')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t('kinesiology.page.durationsSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {durations.map((duration) => (
              <div key={duration} className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                <div className="flex items-center justify-center mb-6 w-16 h-16 rounded-2xl bg-blue-50 mx-auto group-hover:bg-blue-100 transition-colors">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {duration} {t('common.minutes') || 'min'}
                </h3>
                
                <p className="text-gray-600 mb-8 text-center min-h-[3rem]">
                  {duration === 60 ? t('kinesiology.page.duration60') :
                    t('kinesiology.page.duration90')}
                </p>
                
                <Button
                  onClick={() => navigateToBooking('kinesiology')}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl h-12 border-none"
                >
                  {t('common.bookNow')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('kinesiology.page.testimonialsTitle')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-10 relative">
                 <div className="absolute top-8 left-8 text-6xl text-blue-200 font-serif opacity-50">"</div>
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Zap key={i} className="w-5 h-5 fill-blue-400 text-blue-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed italic relative z-10">
                  {testimonial.text}
                </p>
                <div className="font-bold text-gray-900">
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
            className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] border-none px-10 h-14 rounded-2xl text-lg font-bold"
          >
            {t('common.bookNow')}
          </Button>
        </div>
      </section>
    </div>
  );
}
