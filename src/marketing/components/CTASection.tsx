'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useBooking } from '@/marketing/hooks/useBooking';
import { Button } from '@/marketing/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ParallaxBackground from '@/marketing/components/ParallaxBackground';

export default function CTASection() {
  const { t } = useLanguage();
  const { navigateToBooking } = useBooking();

  return (
    <div className="mb-4 px-4 pb-4 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[2.5rem]">
        <ParallaxBackground
          src="https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="py-32 sm:py-40"
          overlayOpacity={0.65}
        >
          <div className="section-container relative z-10 px-4 text-center">
            <h2 className="mb-6 font-serif text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
              {t('common.readyToStart') || 'Ready to start your journey?'}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed font-light text-white/90 sm:text-2xl">
              {t('common.bookConsultation') ||
                'Book a consultation today and take the first step towards better health and wellbeing.'}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={() => navigateToBooking()}
                size="lg"
                className="h-auto w-full rounded-full bg-white px-10 py-7 text-lg text-black shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-100 sm:w-auto"
              >
                {t('common.bookNow')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link href="/booking" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto w-full rounded-full border-white/30 px-10 py-7 text-lg text-white backdrop-blur transition-all duration-300 hover:border-white hover:bg-white/10 sm:w-auto"
                >
                  {t('common.contactUs') || 'Contact Us'}
                </Button>
              </Link>
            </div>
          </div>
        </ParallaxBackground>
      </div>
    </div>
  );
}
