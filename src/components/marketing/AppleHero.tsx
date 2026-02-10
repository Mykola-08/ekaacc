'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
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
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('hasSeenIntro');
      if (seen) {
        setHasSeenIntro(true);
      } else {
        sessionStorage.setItem('hasSeenIntro', 'true');
      }
    }

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
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={image}
              alt="EKA Balance Atmosphere"
              fill
              priority={index === 0}
              quality={65}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Overlay for text readability with refined gradient */}
      <div className="absolute inset-0 bg-blue-950/20 mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 py-32 text-center text-white">
        {/* Badge - Glassy Style with Apple standard radius */}
        <AnimateIn delay={0.2} from="top" disabled={hasSeenIntro}>
          <div className="animate-fade-in mb-8 inline-flex items-center rounded-full border border-blue-200/30 bg-blue-500/20 px-6 py-2 backdrop-blur-md transition-colors hover:bg-blue-500/30">
            <span className="text-sm font-medium tracking-wide text-blue-50 drop-shadow-sm md:text-base">
              {t('hero.badge')}
            </span>
          </div>
        </AnimateIn>

        {/* Main Title - Apple-like typography with accessibility */}
        <AnimateIn delay={0.4} duration={0.8} disabled={hasSeenIntro}>
          <h1 className="font-display mb-8 text-5xl font-medium tracking-tight text-white! drop-shadow-xl md:text-7xl lg:text-8xl leading-[1.1]">
            {t('hero.title')}
          </h1>
        </AnimateIn>

        {/* Subtitle - Improved spacing */}
        <AnimateIn delay={0.6} disabled={hasSeenIntro}>
          <p className="mx-auto mb-12 max-w-2xl text-balance text-lg font-light leading-relaxed text-white/90! drop-shadow-md md:text-xl lg:text-2xl">
            {t('hero.subtitle')}
          </p>
        </AnimateIn>

        {/* CTA Buttons - Consistent Apple style */}
        <AnimateIn delay={0.8} disabled={hasSeenIntro}>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link
              href="/first-time"
              className="group"
              onClick={() => logEvent('hero_first_time_click')}
            >
              <Button
                size="lg"
                className="h-14 min-w-50 rounded-full border border-white bg-white px-8 text-base font-semibold text-primary transition-all duration-300 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.95]"
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
                size="lg"
                variant="outline"
                className="h-14 min-w-50 rounded-full border border-white/40 bg-white/20 px-8 text-base font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/30 hover:scale-[1.02] active:scale-[0.95]"
              >
                {t('hero.discoverServices')}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
