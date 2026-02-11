'use client';

import { ArrowRight, HeartPulse, Salad } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from '@/components/ui/button';

export default function AdultsContent() {
  const { t } = useLanguage();

  const HeroCustom = (
    <section className="relative overflow-hidden bg-linear-to-br from-background via-muted/50 to-white py-20 sm:py-28">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,oklch(1 0 0 / 0))] bg-center" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-8">
        <h1 className="heading-1 mb-6 max-w-4xl">{t('elena.target.adults.title')}</h1>
        <p className="mb-12 max-w-2xl text-xl leading-relaxed font-light text-muted-foreground sm:text-2xl">
          {t('elena.target.adults.desc')}
        </p>
      </div>
    </section>
  );

  return (
    <PageLayout>
      {HeroCustom}

      <section className="relative z-10 -mt-10 rounded-t-[3rem] bg-card py-16 shadow-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4 font-bold text-foreground">{t('adult.recommended')}</h2>
            <p className="mx-auto max-w-2xl text-lg font-light text-muted-foreground">
              {t('adult.recommended.desc')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {/* Kinesiology */}
            <div className="group relative overflow-hidden rounded-[20px] border border-border bg-card shadow-sm transition-all duration-300 hover:border-marketing-accent hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2070&auto=format&fit=crop"
                  alt="Kinesiología"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center gap-3 text-marketing-accent-dark">
                  <div className="rounded-full bg-marketing-accent-light p-2">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Equilibrio Integral</span>
                </div>
                <h3 className="mb-3 text-2xl font-light text-foreground transition-colors group-hover:text-marketing-accent">
                  {t('services.kinesiology.title')}
                </h3>
                <p className="mb-8 line-clamp-3 font-light text-muted-foreground">
                  {t('services.kinesiology.shortDesc')}
                </p>
                <Link
                  href="/services/kinesiology"
                  className="inline-flex items-center font-medium text-marketing-accent-dark transition-colors hover:text-marketing-accent"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Nutrition */}
            <div className="group relative overflow-hidden rounded-[20px] border border-border bg-card shadow-sm transition-all duration-300 hover:border-success hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop"
                  alt="Nutrición"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center gap-3 text-success">
                  <div className="rounded-full bg-success p-2">
                    <Salad className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Salud Digestiva</span>
                </div>
                <h3 className="mb-3 text-2xl font-light text-foreground transition-colors group-hover:text-success-foreground">
                  {t('services.nutrition.title')}
                </h3>
                <p className="mb-8 line-clamp-3 font-light text-muted-foreground">
                  {t('services.nutrition.shortDesc')}
                </p>
                <Link
                  href="/services/nutrition"
                  className="inline-flex items-center font-medium text-success transition-colors hover:text-success-foreground"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="heading-2 mb-6 font-bold">{t('adult.cta.title')}</h2>
          <p className="mb-8 text-xl font-light text-muted-foreground">{t('adult.cta.desc')}</p>
          <Link href="/book">
            <Button size="lg" className="btn btn-accent">
              {t('common.bookNow')}
            </Button>
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}
