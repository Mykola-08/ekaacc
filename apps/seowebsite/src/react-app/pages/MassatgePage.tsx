import SEOHead from '@/react-app/components/SEOHead';
import Image from 'next/image';
import { Clock, Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from 'keep-react';

export default function MassatgePage() {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();

  const benefits = [
    t('massage.benefits.pain'),
    t('services.massage.subtitle'),
    t('massage.benefits.circulation'),
    t('massage.benefits.wellbeing')
  ];

  const testimonials = [
    {
      name: 'Maria S.',
      text: t('massage.testimonial.1.text'),
      rating: 5
    },
    {
      name: 'Jordi M.',
      text: t('massage.testimonial.2.text'),
      rating: 5
    }
  ];

  const durations = [60, 90, 120];

  return (
    <div className="min-h-screen bg-muted/30 font-sans text-foreground">
      <SEOHead
        title={t('seo.massage.title')}
        description={t('seo.massage.description')}
        keywords={t('seo.massage.keywords')}
      />

      {/* Hero Section */}
      <div className="relative bg-linear-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm border border-orange-100 text-sm text-orange-600 mb-8 shadow-sm">
              <Heart className="w-4 h-4" />
              <span className="font-medium">{t('massage.hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-gray-900 via-orange-800 to-gray-900 mb-6 tracking-tight leading-tight">
              {t('massage.page.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
              {t('massage.page.description')}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => navigateToBooking()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground border-none rounded-2xl px-8 h-14 text-lg"
              >
                {t('common.bookNow')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3">
               <Image
                  src="https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Sessió de massatge terapèutic"
                  fill
                  className="object-cover transform hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
            </div>
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 shadow-xl border border-gray-100 max-w-xs">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('massage.page.availableToday')}</p>
                    <p className="text-xs text-muted-foreground">{t('massage.page.bookSession')}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('massage.page.benefitsTitle')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('massage.page.benefitsSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-6 bg-orange-50/50 rounded-2xl border border-orange-100 hover:border-orange-200 transition-colors">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-orange-600" />
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('massage.page.durationsTitle')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t('massage.page.durationsSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {durations.map((duration) => (
              <div key={duration} className="bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-400 to-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                
                <div className="flex items-center justify-center mb-6 w-16 h-16 rounded-2xl bg-orange-50 mx-auto group-hover:bg-orange-100 transition-colors">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-2 text-center">
                  {duration} {t('common.minutes') || 'min'}
                </h3>
                
                <p className="text-muted-foreground mb-8 text-center min-h-[3rem]">
                  {duration === 60 ? t('massage.page.duration60') :
                    duration === 90 ? t('massage.page.duration90') :
                      t('massage.page.duration120')}
                </p>
                
                <Button
                  onClick={() => navigateToBooking()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 border-none shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
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
             <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t('massage.page.testimonialsTitle')}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-muted/30 rounded-3xl p-10 relative">
                <div className="absolute top-8 left-8 text-6xl text-orange-200 font-serif opacity-50">"</div>
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Heart key={i} className="w-5 h-5 fill-orange-400 text-orange-400" />
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
            onClick={() => navigateToBooking()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground border-none px-10 h-14 rounded-2xl text-lg font-bold"
          >
            {t('common.bookNow')}
          </Button>
        </div>
      </section>
    </div>
  );
}

