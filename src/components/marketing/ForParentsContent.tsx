'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useBooking } from '@/hooks/marketing/useBooking';
import { useLanguage } from '@/context/marketing/LanguageContext';
import Link from 'next/link';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from '@/components/ui/button';

export default function ForParentsContent() {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();

  const Hero = (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center rounded-full bg-accent/20 px-4 py-2">
              <span className="text-sm font-medium text-accent-foreground">
                {t('nav.personalizedServices')}
              </span>
            </div>

            <h1 className="text-eka-dark mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
              {t('personalized.parents.hero.title')}
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
              {t('personalized.parents.hero.description')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button onClick={() => navigateToBooking()} size="lg" className="btn bg-primary text-primary-foreground hover:bg-primary/90">
                {t('common.bookNow')}
              </Button>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="btn btn-outline border-accent/20 text-accent-foreground hover:border-accent/30 hover:bg-accent/10"
                >
                  {t('common.askQuestions')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-apple-xl relative h-100 w-full overflow-hidden shadow-2xl sm:h-125">
              <Image
                src="https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=1920&h=1080&fit=crop"
                alt={t('personalized.parents.hero.title')}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <PageLayout hero={Hero}>
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <div className="card border-accent/20 bg-accent/10 p-8 sm:p-12">
            <h2 className="heading-2 text-eka-dark mb-6 font-bold">
              {t('personalized.parents.understanding.title')}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-foreground">
              <p>{t('personalized.parents.understanding.description1')}</p>
              <p>{t('personalized.parents.understanding.description2')}</p>
              <p className="font-medium text-accent-foreground">
                {t('personalized.parents.understanding.callToAction')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-12 text-center">
            <h2 className="heading-2 mb-4">
              {t('personalized.parents.services.title') || 'Recommended Services'}
            </h2>
            <p className="mx-auto max-w-2xl text-lg font-light text-muted-foreground">
              {t('personalized.parents.services.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="card card-interactive group p-8">
              <h3 className="mb-4 text-2xl font-light text-foreground transition-colors group-hover:text-accent-foreground">
                {t('personalized.parents.services.emotionalKinesiology.title')}
              </h3>
              <p className="mb-6 font-light text-muted-foreground">
                {t('personalized.parents.services.emotionalKinesiology.description')}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                <span className="text-sm font-medium text-muted-foreground">60-90 min</span>
                <Link
                  href="/services/kinesiology"
                  className="flex items-center font-medium text-accent-foreground hover:text-accent-foreground"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="card card-interactive group p-8">
              <h3 className="mb-4 text-2xl font-light text-foreground transition-colors group-hover:text-accent-foreground">
                {t('personalized.parents.services.relaxingMassage.title')}
              </h3>
              <p className="mb-6 font-light text-muted-foreground">
                {t('personalized.parents.services.relaxingMassage.description')}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                <span className="text-sm font-medium text-muted-foreground">60-90 min</span>
                <Link
                  href="/services/massage"
                  className="flex items-center font-medium text-accent-foreground hover:text-accent-foreground"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
