import AppleHero from '@/react-app/components/AppleHero';
import TestimonialSlider from '@/react-app/components/TestimonialSlider';
import FAQ from '@/react-app/components/FAQ';
import CasosSection from '@/react-app/components/CasosSection';
import Image from 'next/image';

import SEOOptimized from '@/react-app/components/SEOOptimized';
import { Link } from 'react-router';
import { Heart, Brain, Leaf, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { SERVICES_DATA } from '@/shared/constants';
import { Button } from 'keep-react';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Leaf,
  RotateCcw
};

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { number: '1500+', label: t('hero.stats.sessions') },
    { number: '10+', label: t('hero.stats.experience') },
    { number: '96%', label: t('hero.stats.clients') },
    { number: '9', label: t('hero.stats.countries') }
  ];

  return (
    <SEOOptimized
      title={t('seo.home.title')}
      description={t('seo.home.description')}
      keywords={t('seo.home.keywords')}
      url="https://ekabalance.com"
    >

      {/* Hero Section */}
      <AppleHero />

      {/* Stats Section */}
      <section className="py-16 bg-card border-t border-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
                    {stat.number}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elena Introduction Section */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo - Mobile: top, Desktop: left */}
            <div className="order-1 lg:order-1">
              <div className="relative max-w-md mx-auto lg:max-w-none">
                <div className="relative aspect-square w-full rounded-full overflow-hidden">
                  <Image
                    src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
                    alt="Elena, terapeuta corporal d'EKA Balance"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Text Content - Mobile: bottom, Desktop: right */}
            <div className="order-2 lg:order-2 flex flex-col justify-center">
              <div className="text-center lg:text-left space-y-6">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground leading-tight">
                  {t('elena.greeting')}
                </h2>

                <div className="text-lg sm:text-xl text-foreground/90 leading-relaxed space-y-4">
                  <p>
                    {t('elena.description1')}
                  </p>

                  <p>
                    {t('elena.description2')}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Link to="/about-elena">
                    <Button 
                      className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 border-none"
                    >
                      {t('elena.knowMore')}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8">
              <span className="text-blue-700 font-medium text-sm uppercase tracking-wide">{t('services.ourServices')}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
              {t('services.therapiesFor')}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">
                {t('services.integralWellbeing')}
              </span>
            </h2>

            <p className="text-xl text-foreground/90 max-w-3xl mx-auto">
              {t('services.personalizedTreatments')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DATA.map((service) => {
               const Icon = iconMap[service.iconName] || Heart;
               // Get color class (simple mapping for home page summary)
               const colorClass = service.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                  service.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                  service.color === 'green' ? 'bg-green-50 text-green-600' :
                                  service.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                                  'bg-pink-50 text-pink-600';
              
               return (
                <Link key={service.id} to={service.href} className="group cursor-pointer">
                  <div className="bg-card rounded-[2rem] p-8 h-full shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden">
                    <div className="flex items-center mb-6">
                      <div className={`p-3 rounded-2xl ${colorClass} mr-4 transition-transform group-hover:scale-110`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                        {t(service.titleKey)}
                      </h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {t(service.descriptionKey)}
                    </p>
                    
                    <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                      {t('common.readMore')}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
               );
            })}
          </div>
        </div>
      </section>

      {/* Casos d'Èxit Section */}
      <CasosSection />

      {/* Testimonials */}
      <section className="py-24 bg-card overflow-hidden">
         <TestimonialSlider />
      </section>

      {/* FAQ Section */}
      <FAQ />

    </SEOOptimized>
  );
}

