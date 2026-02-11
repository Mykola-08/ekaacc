'use client';

import { Zap, ArrowRight } from 'lucide-react';
import { useBooking } from '@/hooks/marketing/useBooking';
import { useLanguage } from '@/context/marketing/LanguageContext';
import Link from 'next/link';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from '@/components/ui/button';

export default function ForAthletesContent() {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();

  const Hero = (
    <section className="relative overflow-hidden py-16 sm:py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-12 text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full bg-marketing-accent-light text-marketing-accent-dark">
            <Zap className="h-10 w-10" />
          </div>

          <h1 className="heading-1 text-eka-dark mb-6 font-bold">
            {t('personalized.athletes.hero.title')}
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-foreground">
            {t('personalized.athletes.hero.description')}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => navigateToBooking()} size="lg" className="btn bg-primary text-primary-foreground hover:bg-primary/90">
              {t('common.bookNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                className="btn btn-outline border-border bg-card text-foreground hover:bg-muted"
              >
                {t('common.askQuestions')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <PageLayout hero={Hero}>
      {/* Understanding Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <div className="card bg-muted/80 p-8 sm:p-12">
            <h2 className="heading-2 text-eka-dark mb-6 font-bold">
              {t('personalized.athletes.understanding.title')}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-foreground">
              <p>{t('personalized.athletes.understanding.description1')}</p>
              <p>{t('personalized.athletes.understanding.description2')}</p>
              <p className="font-medium text-marketing-accent-dark">
                {t('personalized.athletes.understanding.callToAction')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Services */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-12 text-center">
            <h2 className="heading-2 text-eka-dark mb-4 font-bold">
              {t('personalized.athletes.services.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              {t('personalized.athletes.services.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Sports Massage Card */}
            <div className="card card-interactive group p-8">
              <h3 className="mb-4 text-2xl font-bold text-foreground transition-colors group-hover:text-warning-foreground">
                {t('personalized.athletes.services.sportsMassage.title')}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {t('personalized.athletes.services.sportsMassage.description')}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                <span className="text-sm font-medium text-muted-foreground">60-90 min</span>
                <Link
                  href="/services/massage"
                  className="flex items-center font-medium text-warning hover:text-warning"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Osteobalance Card */}
            <div className="card card-interactive group p-8">
              <h3 className="mb-4 text-2xl font-bold text-foreground transition-colors group-hover:text-warning-foreground">
                {t('personalized.athletes.services.osteobalance.title')}
              </h3>
              <p className="mb-6 text-muted-foreground">
                {t('personalized.athletes.services.osteobalance.description')}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                <span className="text-sm font-medium text-muted-foreground">60-90 min</span>
                <Link
                  href="/services/osteobalance"
                  className="flex items-center font-medium text-warning hover:text-warning"
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
