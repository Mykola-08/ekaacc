'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Star, Globe, Users, Clock } from 'lucide-react';

import AppleHero from '@/components/marketing/AppleHero';

const CasosSection = dynamic(() => import('@/components/marketing/CasosSection'), { 
  loading: () => <div className="h-96 w-full animate-pulse bg-muted/20" />
});
const FAQ = dynamic(() => import('@/components/marketing/FAQ'), {
  loading: () => <div className="h-96 w-full animate-pulse bg-muted/20" />
});

import { useLanguage } from '@/context/marketing/LanguageContext';
import { SERVICES_DATA } from '@/shared/marketing/constants';
import ServiceCard from '@/components/marketing/ServiceCard';

import AnimatedCounter from '@/components/marketing/AnimatedCounter';

export default function HomeContent() {
  const { t } = useLanguage();

  const stats = [
    { value: 1500, suffix: '+', label: t('hero.stats.sessions'), icon: Users },
    { value: 10, suffix: '+', label: t('hero.stats.experience'), icon: Clock },
    { value: 96, suffix: '%', label: t('hero.stats.clients'), icon: Star },
    { value: 9, suffix: '', label: t('hero.stats.countries'), icon: Globe },
  ];

  return (
    <>
      {/* Hero Section */}
      <AppleHero />

      {/* Stats Section */}
      <section className="relative z-20 mb-10 mt-10 px-4 lg:-mt-10 lg:mb-20">
        <div className="mx-auto max-w-7xl">
          <div
            className="glass-panel grid grid-cols-2 gap-12 rounded-3xl bg-white/50 p-10 shadow-sm backdrop-blur-xl lg:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div key={index} className="group flex flex-col items-center space-y-4 text-center">
                <div className="bg-blue-50/80 text-primary border-blue-100/50 rounded-2xl border p-4 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/20">
                  <stat.icon size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-foreground mb-1 flex justify-center text-4xl font-bold tracking-tight lg:text-5xl">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} duration={2500} />
                  </div>
                  <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elena Introduction Section */}
      <section className="relative overflow-hidden bg-white py-24 lg:py-32">
        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
            {/* Image Column (5 cols) */}
            <div
              className="relative order-first flex justify-center lg:col-span-5"
            >
              <div className="group relative h-64 w-64 sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-purple-200 to-blue-300 opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-80" />
                <div className="relative aspect-square h-full w-full overflow-hidden rounded-full shadow-2xl ring-4 ring-white/50">
                  <Image
                    src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
                    alt={t('home.elenaAlt')}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                  />
                </div>
              </div>
            </div>

            {/* Content Column (7 cols) */}
            <div
              className="space-y-8 text-center lg:col-span-7 lg:text-left"
            >
              <div className="space-y-4">
                <h2 className="text-foreground text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  {t('elena.greeting')}
                </h2>
              </div>

              <div className="space-y-6 text-lg leading-relaxed font-light text-muted-foreground">
                <p>{t('elena.bio')}</p>
                <p>{t('elena.approach')}</p>
              </div>

              <Link href="/about-elena" className="inline-block">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl"
                >
                  {t('common.readMore')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-linear-to-b from-gray-50/50 via-blue-50/30 to-white py-24 relative overflow-hidden">
        {/* Background Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-blue-100/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-96 w-96 rounded-full bg-purple-100/30 blur-3xl" />
        
        <div className="section-container relative z-10">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="text-foreground mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t('services.featuredTitle')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t('services.featuredSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES_DATA.slice(0, 3).map((service, index) => (
              <div
                key={service.id}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/services">
              <Button size="lg" className="rounded-xl px-10">
                {t('services.viewAll')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Casos Section */}
      <CasosSection />

      {/* FAQ Section */}
      <FAQ />
    </>
  );
}
