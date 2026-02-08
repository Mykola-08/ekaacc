'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'keep-react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
import AnimateIn from './AnimateIn';

const heroImages = [
  'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=1920', // Barcelona Skyline
  'https://images.pexels.com/photos/10521232/pexels-photo-10521232.jpeg?auto=compress&cs=tinysrgb&w=1920', // Wellness Bed / Spa Room
  'https://images.pexels.com/photos/6628817/pexels-photo-6628817.jpeg?auto=compress&cs=tinysrgb&w=1920', // Women talking in massage room (Candid)
  'https://images.pexels.com/photos/7176059/pexels-photo-7176059.jpeg?auto=compress&cs=tinysrgb&w=1920', // Consultation with notes (Candid)
];

export default function AppleHero() {
  const { t } = useLanguage();
  const { logEvent } = useAnalytics();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-section-full relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image with smooth transitions */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Overlay for text readability */}
      <div className="bg-overlay-dark" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center text-white">
        {/* Badge - Glassy Style */}
        <AnimateIn delay={0.2} from="top">
          <div className="animate-fade-in mb-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-sm font-medium tracking-wide text-white/90 md:text-base">
              {t('hero.badge')}
            </span>
          </div>
        </AnimateIn>

        {/* Main Title */}
        <AnimateIn delay={0.4} duration={0.8}>
          <h1 className="mb-8 text-6xl font-bold tracking-tight text-white drop-shadow-2xl md:text-8xl lg:text-9xl">
            {t('hero.title')}
          </h1>
        </AnimateIn>

        {/* Subtitle */}
        <AnimateIn delay={0.6}>
          <p className="apple-subtitle mx-auto mb-12 max-w-3xl text-balance text-white/90">
            {t('hero.subtitle')}
          </p>
        </AnimateIn>

        {/* CTA Buttons */}
        <AnimateIn delay={0.8}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/first-time"
              className="group"
              onClick={() => logEvent('hero_first_time_click')}
            >
              <Button
                size="xl"
                className="btn btn-primary rounded-apple px-8 py-4 normal-case shadow-xl"
              >
                {t('hero.firstTime')}
              </Button>
            </Link>

            <Link
              href="/services"
              className="group"
              onClick={() => logEvent('hero_services_click')}
            >
              <Button
                size="xl"
                className="btn btn-accent rounded-apple px-8 py-4 font-semibold normal-case shadow-xl"
              >
                {t('hero.discoverServices')}
                <ArrowRight className="ease-out-quart ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
