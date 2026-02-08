'use client';

import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/context/marketing/LanguageContext';
import Link from 'next/link';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from 'keep-react';

export default function ArtistsContent() {
  const { t } = useLanguage();

  const Hero = (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 px-4 py-2">
              <span className="text-sm font-medium text-blue-700">
                {t('nav.personalizedServices')}
              </span>
            </div>

            <h1 className="text-eka-dark mb-6 text-4xl leading-tight font-bold sm:text-5xl lg:text-6xl">
              {t('nav.artists')}
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-gray-600">
              {t('artists.hero.subtitle')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/book">
                <Button size="xl" className="btn btn-accent">
                  {t('common.reserveSession')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="rounded-apple-xl relative h-[400px] w-full overflow-hidden shadow-2xl sm:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1599447421405-0c325d26d77e?w=1920&h=1080&fit=crop"
                alt={t('nav.artists')}
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
    <PageLayout>
      {Hero}

      {/* Problems & Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            {/* Problems */}
            <div>
              <h2 className="text-eka-dark mb-8 text-3xl font-bold">
                {t('artists.challenges.title')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start rounded-[20px] bg-red-50 p-6">
                  <AlertCircle className="mt-1 mr-4 h-6 w-6 flex-shrink-0 text-red-500" />
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {t('artists.challenge1.title')}
                    </h3>
                    <p className="text-gray-600">{t('artists.challenge1.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start rounded-[20px] bg-red-50 p-6">
                  <AlertCircle className="mt-1 mr-4 h-6 w-6 flex-shrink-0 text-red-500" />
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {t('artists.challenge2.title')}
                    </h3>
                    <p className="text-gray-600">{t('artists.challenge2.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start rounded-[20px] bg-red-50 p-6">
                  <AlertCircle className="mt-1 mr-4 h-6 w-6 flex-shrink-0 text-red-500" />
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {t('artists.challenge3.title')}
                    </h3>
                    <p className="text-gray-600">{t('artists.challenge3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-eka-dark mb-8 text-3xl font-bold">{t('artists.help.title')}</h2>
              <div className="space-y-6">
                <div className="flex items-start rounded-[20px] bg-green-50 p-6">
                  <CheckCircle2 className="mt-1 mr-4 h-6 w-6 flex-shrink-0 text-green-500" />
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">{t('artists.help1.title')}</h3>
                    <p className="font-light text-gray-600">{t('artists.help1.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start rounded-[20px] bg-green-50 p-6">
                  <CheckCircle2 className="mt-1 mr-4 h-6 w-6 flex-shrink-0 text-green-500" />
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">{t('artists.help2.title')}</h3>
                    <p className="font-light text-gray-600">{t('artists.help2.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start rounded-[20px] bg-green-50 p-6">
                  <CheckCircle2 className="mt-1 mr-4 h-6 w-6 flex-shrink-0 text-green-500" />
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">{t('artists.help3.title')}</h3>
                    <p className="font-light text-gray-600">{t('artists.help3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-yellow-50 py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-8">
          <div className="rounded-apple-xl bg-white p-12 shadow-xl">
            <h2 className="mb-6 text-3xl font-light text-yellow-600">
              {t('artists.result.title')}
            </h2>
            <p className="mb-8 text-xl font-light text-gray-600">{t('artists.result.desc')}</p>

            <div className="mt-12 grid grid-cols-1 gap-8 border-t border-gray-100 pt-12 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-light text-yellow-600">88%</div>
                <div className="text-gray-600">{t('artists.stats.confidence')}</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-light text-yellow-600">82%</div>
                <div className="text-gray-600">{t('artists.stats.tension')}</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-light text-yellow-600">76%</div>
                <div className="text-gray-600">{t('artists.stats.anxiety')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Card */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="rounded-apple-xl grid grid-cols-1 items-center gap-12 overflow-hidden border border-gray-100 bg-gray-50 p-4 lg:grid-cols-2 lg:p-8">
            <div className="rounded-apple-xl relative h-64 overflow-hidden lg:h-96">
              <Image
                src="https://images.unsplash.com/photo-1544367563-121542f85488?w=800&auto=format&fit=crop"
                alt="Sessió de teràpia per a artistes"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="p-4 lg:p-8">
              <h3 className="mb-6 text-3xl font-light text-gray-900">
                {t('artists.session.title')}
              </h3>

              <div className="mb-8 space-y-4">
                <div className="flex items-center">
                  <Clock className="mr-3 h-5 w-5 text-gray-500" />
                  <span className="text-lg text-gray-700">1 {t('common.hour')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-4xl font-light text-gray-900">70€</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/book">
                  <Button
                    size="xl"
                    className="btn btn-primary w-full bg-[#FFB405] text-[#000035] hover:bg-[#e8a204] sm:w-auto"
                  >
                    {t('artists.session.cta')}
                  </Button>
                </Link>
                <Link href="/services">
                  <Button
                    size="xl"
                    className="btn btn-outline w-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50 sm:w-auto"
                  >
                    {t('artists.session.other')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
