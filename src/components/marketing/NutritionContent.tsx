'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle2, Clock, Leaf, Sprout } from 'lucide-react';
import { useBooking } from '@/hooks/marketing/useBooking';
import { useLanguage } from '@/context/marketing/LanguageContext';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from 'keep-react';

export default function NutritionContent() {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();

  const benefits = [
    t('nutrition.benefits.habits'),
    t('services.nutrition.subtitle'),
    t('nutrition.benefits.weight'),
    t('nutrition.benefits.prevention'),
  ];

  const testimonials = [
    {
      name: 'Carla Ferrer',
      text: t('nutrition.testimonial.1.text'),
      rating: 5,
    },
    {
      name: 'Pere Castell',
      text: t('nutrition.testimonial.2.text'),
      rating: 5,
    },
  ];

  const sessionTypes = [
    {
      name: t('nutrition.session.first.name'),
      duration: '60 min',
      description: t('nutrition.session.first.description'),
    },
    {
      name: t('nutrition.session.followup.name'),
      duration: '45 min',
      description: t('nutrition.session.followup.description'),
    },
  ];

  const Hero = (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 px-6 pt-32 pb-20">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-100 bg-white/80 px-3 py-1 text-sm text-green-600 shadow-sm backdrop-blur-sm">
            <Leaf className="h-4 w-4" />
            <span className="font-medium">{t('nutrition.hero.badge')}</span>
          </div>

          <h1 className="heading-1 mb-6 bg-gradient-to-r from-gray-900 via-green-800 to-gray-900 bg-clip-text text-transparent">
            {t('nutrition.page.title')}
          </h1>

          <p className="mb-8 max-w-lg text-xl leading-relaxed font-light text-gray-600">
            {t('services.nutrition.description')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => navigateToBooking()}
              className="h-14 rounded-2xl border-none bg-[#FFB405] px-8 text-lg font-semibold text-[#000035] shadow-lg shadow-amber-200/50 hover:bg-[#e8a204]"
            >
              {t('common.bookNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-video overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
            <Image
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Nutrició i dietètica"
              fill
              className="transform object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Floating Card */}
          <div className="absolute -bottom-6 -left-6 max-w-xs rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Sprout className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {t('nutrition.page.availableToday')}
                </p>
                <p className="text-xs text-gray-500">{t('nutrition.page.bookSession')}</p>
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
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4">{t('nutrition.page.benefitsTitle')}</h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-gray-600">
              {t('nutrition.page.benefitsSubtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-2xl border border-green-100 bg-green-50/50 p-6 transition-colors hover:border-green-200"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <span className="pt-2 text-lg font-medium text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Duration & Pricing */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4">{t('nutrition.page.durationsTitle')}</h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-gray-600">
              {t('nutrition.page.durationsSubtitle')}
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {sessionTypes.map((session, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl"
              >
                <div className="absolute top-0 left-0 h-1 w-full origin-left scale-x-0 transform bg-gradient-to-r from-green-400 to-emerald-500 transition-transform duration-300 group-hover:scale-x-100" />

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 transition-colors group-hover:bg-green-100">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>

                <h3 className="mb-2 text-center text-2xl font-bold text-gray-900">
                  {session.name}
                </h3>

                <p className="mb-4 text-center font-semibold text-green-600">{session.duration}</p>

                <p className="mb-8 min-h-[3rem] text-center text-gray-600">{session.description}</p>

                <Button
                  onClick={() => navigateToBooking()}
                  className="h-12 w-full rounded-xl border-none bg-gray-900 text-white hover:bg-gray-800"
                >
                  {t('common.bookNow')}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="overflow-hidden bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4">{t('nutrition.page.testimonialsTitle')}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative rounded-3xl bg-gray-50 p-10">
                <div className="absolute top-8 left-8 font-serif text-6xl text-green-200 opacity-50">
                  "
                </div>
                <div className="relative z-10 mb-6 flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Sprout key={i} className="h-5 w-5 fill-green-400 text-green-400" />
                  ))}
                </div>
                <p className="relative z-10 mb-6 text-lg leading-relaxed text-gray-700 italic">
                  {testimonial.text}
                </p>
                <div className="font-bold text-gray-900">{testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gray-900 py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            {t('services.readyToStart')}
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-xl font-light text-gray-300">
            {t('services.contactUsToBook')}
          </p>
          <Button
            onClick={() => navigateToBooking()}
            className="h-14 rounded-2xl border-none bg-[#FFB405] px-10 text-lg font-bold text-[#000035] hover:bg-[#e8a204]"
          >
            {t('common.bookNow')}
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
