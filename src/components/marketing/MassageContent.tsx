'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle2, Clock, Heart } from 'lucide-react';
import { useBooking } from '@/hooks/marketing/useBooking';
import { useLanguage } from '@/context/marketing/LanguageContext';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from '@/components/ui/button';

export default function MassageContent() {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();

  const benefits = [
    t('massage.benefits.pain'),
    t('services.massage.subtitle'),
    t('massage.benefits.circulation'),
    t('massage.benefits.wellbeing'),
  ];

  const testimonials = [
    {
      name: 'Maria S.',
      text: t('massage.testimonial.1.text'),
      rating: 5,
    },
    {
      name: 'Jordi M.',
      text: t('massage.testimonial.2.text'),
      rating: 5,
    },
  ];

  const durations = [60, 90, 120];

  const Hero = (
    <section className="relative overflow-hidden bg-linear-to-br from-info/10 via-background to-accent/10 px-6 pt-32 pb-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,oklch(1 0 0 / 0))] bg-center" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-sm text-primary shadow-sm backdrop-blur-sm">
            <Heart className="h-4 w-4" />
            <span className="font-medium">{t('massage.hero.badge')}</span>
          </div>

          <h1 className="heading-1 mb-6 bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            {t('massage.page.title')}
          </h1>

          <p className="mb-8 max-w-lg text-xl leading-relaxed font-light text-muted-foreground">
            {t('massage.page.description')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigateToBooking()}
              className="h-14 rounded-2xl border-none bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            >
              {t('common.bookNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-video overflow-hidden rounded-2xl border-4 border-background shadow-2xl">
            <Image
              src="https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Sessió de massatge terapèutic"
              fill
              className="transform object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-6 max-w-xs rounded-2xl border border-border bg-card p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-marketing-accent-light text-marketing-accent-dark">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {t('massage.page.availableToday')}
                </p>
                <p className="text-xs text-muted-foreground">{t('massage.page.bookSession')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <PageLayout>
      {Hero}

      {/* Benefits Section */}
      <section className="bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4">{t('massage.page.benefitsTitle')}</h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-muted-foreground">
              {t('massage.page.benefitsSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-2xl border border-border bg-muted/50 p-6 transition-colors hover:border-marketing-accent-light"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-marketing-accent-light text-marketing-accent-dark">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="pt-2 text-lg font-medium text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Duration & Pricing */}
      <section className="bg-muted py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4">{t('massage.page.durationsTitle')}</h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-muted-foreground">
              {t('massage.page.durationsSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {durations.map((duration) => (
              <div
                key={duration}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="absolute top-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-linear-to-r from-marketing-accent to-marketing-accent-dark transition-transform duration-300 group-hover:scale-x-100" />

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-marketing-accent-light transition-colors group-hover:bg-marketing-accent/20">
                  <Clock className="h-8 w-8 text-marketing-accent-dark" />
                </div>

                <h3 className="mb-2 text-center text-2xl font-bold text-foreground">
                  {duration} {t('common.minutes') || 'min'}
                </h3>

                <p className="mb-8 min-h-12 text-center text-muted-foreground">
                  {duration === 60
                    ? t('massage.page.duration60')
                    : duration === 90
                      ? t('massage.page.duration90')
                      : t('massage.page.duration120')}
                </p>

                <Button
                  onClick={() => navigateToBooking()}
                  className="h-12 w-full rounded-xl border-none bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t('common.bookNow')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden bg-card py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4">{t('massage.page.testimonialsTitle')}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative rounded-2xl bg-muted p-10">
                <div className="absolute top-8 left-8 font-serif text-6xl text-marketing-accent opacity-30">
                  "
                </div>
                <div className="relative z-10 mb-6 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Heart key={i} className="h-5 w-5 fill-marketing-accent text-marketing-accent" />
                  ))}
                </div>
                <p className="relative z-10 mb-6 text-lg leading-relaxed text-foreground italic">
                  {testimonial.text}
                </p>
                <div className="font-bold text-foreground">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-background py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            {t('services.readyToStart')}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl font-light text-muted-foreground/40">
            {t('services.contactUsToBook')}
          </p>
          <Button
            onClick={() => navigateToBooking()}
            className="h-14 rounded-2xl border-none bg-accent px-10 text-lg font-bold text-eka-dark hover:bg-accent/90"
          >
            {t('common.bookNow')}
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}

