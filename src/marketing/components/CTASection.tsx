'use client';

import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useBooking } from '@/marketing/hooks/useBooking';
import { Button } from '@/marketing/components/ui/button';
import Link from 'next/link';
import ParallaxBackground from '@/marketing/components/ParallaxBackground';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

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
            <h2 className="mx-auto mb-6 max-w-4xl text-[3rem] leading-[1.05] font-semibold tracking-tighter text-white sm:text-[4rem] lg:text-[5rem]">
              {t('common.readyToStart')}
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-[1.2rem] leading-relaxed font-normal text-white/80">
              {t('common.bookConsultation')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                onClick={() => navigateToBooking()}
                size="lg"
                className="h-auto w-full rounded-full bg-white px-10 py-6 text-lg font-medium text-foreground transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 sm:w-auto"
              >
                {t('common.bookNow')}
                <HugeiconsIcon icon={ArrowRight01Icon} className="ml-2 size-5"  />
              </Button>
              <Link href="/booking" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-auto w-full rounded-full border-none bg-white/10 px-10 py-6 text-lg font-medium text-white backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:bg-white/20 sm:w-auto"
                >
                  {t('common.contactUs')}
                </Button>
              </Link>
            </div>
          </div>
        </ParallaxBackground>
      </div>
    </div>
  );
}
