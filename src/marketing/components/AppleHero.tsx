'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/marketing/components/ui/button';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useAnalytics } from '@/marketing/hooks/useAnalytics';
import AnimateIn from './AnimateIn';
import { Sparkles } from 'lucide-react';

// Verified massage therapy in beautiful spa environments — all URLs confirmed on Pexels
const heroImages = [
  'https://images.pexels.com/photos/3760262/pexels-photo-3760262.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman getting a back massage at a spa
  'https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman lying on bed getting massage, serene spa scene
  'https://images.pexels.com/photos/5240678/pexels-photo-5240678.jpeg?auto=compress&cs=tinysrgb&w=2000', // Back massage in spa salon
  'https://images.pexels.com/photos/3865803/pexels-photo-3865803.jpeg?auto=compress&cs=tinysrgb&w=2000', // Masseuse massaging shoulder and back of client
  'https://images.pexels.com/photos/3760270/pexels-photo-3760270.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman getting a head massage, serene spa
  'https://images.pexels.com/photos/3757657/pexels-photo-3757657.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman in white towel lying on bed getting massage
  'https://images.pexels.com/photos/6628613/pexels-photo-6628613.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman having a massage on comfortable couch in spa
  'https://images.pexels.com/photos/6628614/pexels-photo-6628614.jpeg?auto=compress&cs=tinysrgb&w=2000', // Soothing massage with calming palo santo aroma
  'https://images.pexels.com/photos/5793981/pexels-photo-5793981.jpeg?auto=compress&cs=tinysrgb&w=2000', // Massage therapist working in tranquil indoor setting
  'https://images.pexels.com/photos/3865523/pexels-photo-3865523.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman eyes closed, relaxing during massage therapy
  'https://images.pexels.com/photos/3865496/pexels-photo-3865496.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman lying down having head massage by therapist
  'https://images.pexels.com/photos/5240802/pexels-photo-5240802.jpeg?auto=compress&cs=tinysrgb&w=2000', // Woman getting calming head massage at spa
];

export default function AppleHero() {
  const { t } = useLanguage();
  const { logEvent } = useAnalytics();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-[90vh] bg-[#fdfdfd] flex flex-col items-center justify-start pt-32 pb-16 overflow-hidden">
      
      {/* Subtle background glows for depth */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-[10%] right-[-5%] w-[30%] h-[30%] bg-purple-100/40 rounded-full blur-[80px] mix-blend-multiply" />
      </div>

      {/* Content Layer - Centered Text */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 text-center mb-12 sm:mb-16">
        <AnimateIn delay={0.1} duration={0.8} from="bottom">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/60 border border-gray-200/60  backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-800 tracking-wide">EKA Balance Method</span>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2} duration={0.8} from="bottom">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] mb-6 text-gray-900 ">
            {t('hero.title')}
          </h1>
        </AnimateIn>

        <AnimateIn delay={0.3} duration={0.8} from="bottom">
          <p className="text-xl md:text-2xl font-medium text-gray-500 max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </AnimateIn>

        <AnimateIn delay={0.4} duration={0.8} from="bottom">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary Button */}
            <Button
              asChild
              variant="default"
              size="xl"
              className="px-8 py-6 text-lg h-auto rounded-full w-full sm:w-auto   transition-all duration-300"
              onClick={() => logEvent('hero_first_time_click')}
            >
              <Link href="/first-time">
                {t('hero.firstTime')}
              </Link>
            </Button>

            {/* Secondary Button */}
            <Button
              asChild
              variant="outline"
              size="xl"
              className="px-8 py-6 text-lg h-auto rounded-full w-full sm:w-auto backdrop-blur-md bg-white/50 border-gray-300 hover:bg-white/80 transition-all duration-300"
              onClick={() => logEvent('hero_services_click')}
            >
              <Link href="/services">
                {t('hero.discoverServices')}
              </Link>
            </Button>
          </div>
        </AnimateIn>
      </div>

      {/* Image Container - Rounded Apple Style */}
      <div className="relative w-full max-w-[90%] md:max-w-6xl aspect-video md:aspect-[21/9] rounded-[32px] md:rounded-[48px] overflow-hidden _20px_40px_rgba(0,0,0,0.08)] mx-auto group">
        {/* Only render current, previous and next images to avoid loading all 12 */}
        {heroImages.map((image, index) => {
          const prev = (currentImageIndex - 1 + heroImages.length) % heroImages.length;
          const next = (currentImageIndex + 1) % heroImages.length;
          const isVisible = index === currentImageIndex || index === prev || index === next;
          if (!isVisible) return null;
          return (
            <div
              key={image}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image
                src={image}
                alt={`Wellness atmosphere ${index + 1}`}
                fill
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`object-cover transition-transform duration-[7500ms] ease-out ${
                  index === currentImageIndex ? 'scale-105' : 'scale-100'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
              />
              {/* Subtle Gradient Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent pointer-events-none" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
