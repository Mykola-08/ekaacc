'use client';

import { useLanguage } from '@/context/marketing/LanguageContext';
import { useBooking } from '@/hooks/marketing/useBooking';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ParallaxBackground from '@/components/marketing/ParallaxBackground';

export default function CTASection() {
  const { t } = useLanguage();
  const { navigateToBooking } = useBooking();

  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-4 mb-4">
      <div className="rounded-3xl overflow-hidden">
        <ParallaxBackground
          src="https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1920"
          className="py-32 sm:py-40"
          overlayOpacity={0.65}
        >
          <div className="section-container relative z-10 text-center px-4">
            <h2 className="text-5xl sm:text-6xl mb-6 font-semibold text-white tracking-tight text-balance font-serif">
              {t('common.readyToStart') || 'Ready to start your journey?'}
            </h2>
            <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              {t('common.bookConsultation') || 'Book a consultation today and take the first step towards better health and wellbeing.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigateToBooking()}
                size="lg"
                className="w-full sm:w-auto px-10 py-7 text-lg rounded-full h-auto bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
              >
                {t('common.bookNow')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Link href="/reservar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-10 py-7 text-lg rounded-full h-auto text-white border-white/30 backdrop-blur hover:bg-white/10 hover:border-white transition-all duration-300"
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
