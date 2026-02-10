'use client';

import { Monitor, ArrowRight } from 'lucide-react';
import { useBooking } from '@/hooks/marketing/useBooking';
import { useLanguage } from '@/context/marketing/LanguageContext';
import Link from 'next/link';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from '@/components/ui/button';

export default function ForOfficeWorkersContent() {
  const { navigateToBooking } = useBooking();
  const { t } = useLanguage();

  const Hero = (
    <section className="relative overflow-hidden py-16 sm:py-24">
      {/* Grid background handled by PageLayout */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8">
        <div className="mb-12 text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
            <Monitor className="h-10 w-10 text-gray-600" />
          </div>

          <h1 className="heading-1 text-eka-dark mb-6 font-bold">
            {t('personalized.officeWorkers.hero.title')}
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-gray-700">
            {t('personalized.officeWorkers.hero.description')}
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button onClick={() => navigateToBooking()} size="lg" className="btn bg-primary text-white hover:bg-primary/90">
              {t('common.bookNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Link href="/contact">
              <Button
                size="lg"
                className="btn btn-outline border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
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
          <div className="card bg-gray-50 p-8 sm:p-12">
            <h2 className="heading-2 text-eka-dark mb-6 font-bold">
              {t('personalized.officeWorkers.understanding.title')}
            </h2>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              <p>{t('personalized.officeWorkers.understanding.description1')}</p>
              <p>{t('personalized.officeWorkers.understanding.description2')}</p>
              <p className="font-medium text-gray-900">
                {t('personalized.officeWorkers.understanding.callToAction')}
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
              {t('personalized.officeWorkers.services.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              {t('personalized.officeWorkers.services.subtitle')}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Massage Card */}
            <div className="card card-interactive group p-8">
              <h3 className="mb-4 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-700">
                {t('personalized.officeWorkers.services.therapeuticMassage.title')}
              </h3>
              <p className="mb-6 text-gray-600">
                {t('personalized.officeWorkers.services.therapeuticMassage.description')}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                <span className="text-sm font-medium text-gray-500">60-90 min</span>
                <Link
                  href="/services/massage"
                  className="flex items-center font-medium text-blue-600 hover:text-blue-800"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Feldenkrais Card */}
            <div className="card card-interactive group p-8">
              <h3 className="mb-4 text-2xl font-light text-gray-900 transition-colors group-hover:text-blue-700">
                {t('personalized.officeWorkers.services.feldenkrais.title')}
              </h3>
              <p className="mb-6 font-light text-gray-600">
                {t('personalized.officeWorkers.services.feldenkrais.description')}
              </p>
              <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                <span className="text-sm font-medium text-gray-500">60 min</span>
                <Link
                  href="/services/feldenkrais"
                  className="flex items-center font-medium text-blue-600 hover:text-blue-800"
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
