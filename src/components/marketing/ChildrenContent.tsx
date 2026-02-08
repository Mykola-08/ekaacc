'use client';

import { ArrowRight, Brain, HeartPulse } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import Link from 'next/link';
import Image from 'next/image';
import PageLayout from '@/components/marketing/PageLayout';
import { Button } from 'keep-react';

export default function ChildrenContent() {
  const { t } = useLanguage();

  const Hero = (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 py-12 sm:py-20">
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
              {t('elena.target.children.title')}
            </h1>

            <p className="mb-8 text-xl leading-relaxed font-light text-gray-600">
              {t('elena.target.children.desc')}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/book">
                <Button size="xl" className="btn btn-accent px-8 py-4 normal-case">
                  {t('common.reserveSession')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative h-[400px] w-full sm:h-[500px]">
              <Image
                src="https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1920&h=1080&fit=crop"
                alt={t('elena.target.children.title')}
                fill
                className="rounded-apple-xl -rotate-1 object-cover shadow-2xl transition-transform duration-500 hover:rotate-0"
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

      {/* Recommended Services */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-16 text-center">
            <h2 className="heading-2 mb-4 text-gray-900">Servicios Recomendados</h2>
            <p className="mx-auto max-w-2xl text-lg font-light text-gray-600">
              Cuidado especializado para el desarrollo y bienestar infantil.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:gap-12">
            {/* Kinesiology - Focusing on emotions/learning */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=2072&auto=format&fit=crop"
                  alt="Kinesiología Infantil"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center gap-3 text-blue-600">
                  <div className="rounded-full bg-blue-50 p-2">
                    <Brain className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Aprendizaje y Emociones</span>
                </div>
                <h3 className="mb-3 text-2xl font-light text-gray-900 transition-colors group-hover:text-blue-700">
                  {t('services.kinesiology.title')}
                </h3>
                <p className="mb-8 line-clamp-3 font-light text-gray-600">
                  Apoyo en dificultades de aprendizaje, gestión emocional y coordinación motora.
                </p>
                <Link
                  href="/services/kinesiology"
                  className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Kinesiology - General checkup/Health - using same service link but focused content card */}
            <div className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-xl">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop"
                  alt="Salud Física"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-8">
                <div className="mb-4 flex items-center gap-3 text-blue-600">
                  <div className="rounded-full bg-blue-50 p-2">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Salud Física</span>
                </div>
                <h3 className="mb-3 text-2xl font-light text-gray-900 transition-colors group-hover:text-blue-700">
                  Equilibrio Corporal
                </h3>
                <p className="mb-8 line-clamp-3 font-light text-gray-600">
                  Tratamiento holístico para alergias, intolerancias y desarrollo físico saludable.
                </p>
                <Link
                  href="/services/kinesiology"
                  className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700"
                >
                  {t('common.moreInfo')} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
