'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@ekaacc/shared-ui';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Globe, Users, Clock } from 'lucide-react';

import AppleHero from '@/components/AppleHero';
import CasosSection from '@/components/CasosSection';
import TestimonialSlider from '@/components/TestimonialSlider';
import FAQ from '@/components/FAQ';

import { useLanguage } from '@/contexts/LanguageContext';
import { SERVICES_DATA } from '@/shared/constants';
import ServiceCard from '@/components/ServiceCard';
import { servicesService } from '@/lib/platform/services/services-service';
import { useState, useEffect } from 'react';
import { ServiceItem } from '@/shared/types';

export default function Home() {
  const { t } = useLanguage();
  const [coreServices, setCoreServices] = useState<ServiceItem[]>(SERVICES_DATA);

  useEffect(() => {
    async function fetchServices() {
      const { core } = await servicesService.getServicesWithPricing();
      if (core && core.length > 0) {
        setCoreServices(core);
      }
    }
    fetchServices();
  }, []);

  const stats = [
    { number: '1500+', label: t('hero.stats.sessions'), icon: Users },
    { number: '10+', label: t('hero.stats.experience'), icon: Clock },
    { number: '96%', label: t('hero.stats.clients'), icon: Star },
    { number: '9', label: t('hero.stats.countries'), icon: Globe }
  ];

  return (
    <>
      {/* Hero Section */}
      <AppleHero />

      {/* Stats Section with floating effect */}
      <section className="relative z-20 -mt-10 mb-10 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[32px] shadow-sm border border-black/[0.03] p-8 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-2">
                <div className="p-3 bg-black/5 rounded-full text-primary mb-1">
                  <stat.icon size={24} />
                </div>
                <span className="text-3xl font-light text-foreground tracking-tight">
                  {stat.number}
                </span>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Elena Introduction Section - UNIFIED DESIGN */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

        <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-tr from-blue-200 to-emerald-200 rounded-full blur-3xl opacity-30" />
              <div className="relative w-full max-w-md mx-auto aspect-square">
                <Image
                  src="https://5tghbndjb61dnqaj.public.blob.vercel-storage.com/therapist_photo.jpg"
                  alt="Elena, terapeuta corporal d'EKA Balance"
                  fill
                  className="rounded-full object-cover shadow-2xl border-8 border-white"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute bottom-10 right-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 hidden md:block">
                <p className="text-sm font-medium text-foreground">Elena Kucherova</p>
                <p className="text-xs text-muted-foreground">Founder & CEO</p>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8 text-center lg:text-left"
            >
              <h2 className="text-4xl sm:text-5xl font-semibold text-foreground leading-tight">
                {t('elena.greeting')}
              </h2>

              <div className="text-lg text-muted-foreground leading-relaxed space-y-6 font-light">
                <p>
                  {t('elena.description1')}
                </p>
                <p>
                  {t('elena.description2')}
                </p>
              </div>

              <div className="pt-4 flex justify-center lg:justify-start">
                <Link href="/about-elena">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/95 text-white font-semibold px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all border-none"
                  >
                    {t('elena.knowMore')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-card relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-blue-600 font-medium tracking-widest text-sm uppercase">
              {t('services.ourServices')}
            </span>

            <h2 className="text-4xl sm:text-5xl font-light text-foreground leading-tight">
              {t('services.therapies For')}{' '}
              <span className="block mt-2 text-primary font-medium">
                {t('services.integralWellbeing')}
              </span>
            </h2>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              {t('services.personalizedTreatments')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.slice(0, 3).map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/services">
              <Button variant="outline" className="border-black/5 text-muted-foreground hover:text-primary hover:bg-black/5 px-8 py-3 rounded-full bg-white shadow-sm">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Casos d'Èxit Section */}
      <CasosSection />

      {/* Testimonials */}
      <section className="py-24 bg-muted/30 overflow-hidden">
        <TestimonialSlider />
      </section>

      {/* FAQ Section */}
      <FAQ />

    </>
  );
}
