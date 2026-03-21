'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import CTASection from '@/marketing/components/CTASection';
import { HugeiconsIcon } from '@hugeicons/react';
import { CrownIcon, Home01Icon, Clock01Icon, SparklesIcon, Tick02Icon, ShieldIcon, StarIcon, ZapIcon, GlobeIcon, Award01Icon, Diamond01Icon } from '@hugeicons/core-free-icons';

// --- Constants & Data ---

const defaultPlans = [
  {
    tier: 'bronze',
    name: 'vip.plan.bronze',
    description: 'vip.plan.bronze.description',
    price: 'vip.plan.bronze.price',
    sessions: '2',
    popular: false,
    features: ['vip.service.priority.title', 'vip.benefits.transferable', 'vip.benefits.monthly'],
  },
  {
    tier: 'silver',
    name: 'vip.plan.silver',
    description: 'vip.plan.silver.description',
    price: 'vip.plan.silver.price',
    sessions: '4',
    popular: true,
    features: ['vip.plan.bronze', 'vip.service.displacements.title', 'vip.benefits.monthlyDesc'],
  },
  {
    tier: 'gold',
    name: 'vip.plan.gold',
    description: 'vip.plan.gold.description',
    price: 'vip.plan.gold.price',
    sessions: '8',
    popular: false,
    features: ['vip.plan.silver', 'vip.stats.concierge', 'vip.service.family.title'],
  },
];

const defaultLuxuryFeatures = [
  {
    icon: Diamond01Icon,
    title: 'vip.mostExclusive',
    description: 'vip.experienceDescription',
  },
  {
    icon: Award01Icon,
    title: 'vip.voicesOfExcellence',
    description: 'vip.testimonialsSubtitle',
  },
  {
    icon: GlobeIcon,
    title: 'vip.benefits.barcelona',
    description: 'vip.benefits.barcelonaDesc',
  },
  {
    icon: ZapIcon,
    title: 'vip.service.priority.title',
    description: 'vip.service.priority.description',
  },
];

const vipServices = [
  {
    icon: Home01Icon,
    title: 'vip.service.displacements.title',
    description: 'vip.service.displacements.description',
    features: [
      'vip.benefits.barcelona',
      'vip.stats.concierge',
      'vip.service.priority.title',
      'vip.benefits.transferable',
    ],
  },
  {
    icon: Clock01Icon,
    title: 'vip.service.health.title',
    description: 'vip.service.health.description',
    features: [
      'vip.benefits.monthly',
      'vip.benefits.monthlyDesc',
      'vip.stats.control',
      'vip.benefits.sessions',
    ],
  },
  {
    icon: SparklesIcon,
    title: 'vip.service.family.title',
    description: 'vip.service.family.description',
    features: [
      'vip.stats.family',
      'vip.benefits.transferable',
      'vip.benefits.transferableDesc',
      'vip.service.family.title',
    ],
  },
  {
    icon: ShieldIcon,
    title: 'vip.service.priority.title',
    description: 'vip.service.priority.description',
    features: [
      'vip.stats.concierge',
      'vip.service.priority.title',
      'vip.service.priority.description',
      'vip.stats.exclusivity',
    ],
  },
];

const testimonials = [
  {
    name: 'Marina Castellví',
    role: 'vip.testimonials.role1',
    rating: 5,
    comment: 'vip.testimonials.comment1',
    tier: 'GOLD',
  },
  {
    name: 'Dr. Albert Vidal',
    role: 'vip.testimonials.role2',
    rating: 5,
    comment: 'vip.testimonials.comment2',
    tier: 'GOLD',
  },
  {
    name: 'Laura Montserrat',
    role: 'vip.testimonials.role3',
    rating: 5,
    comment: 'vip.testimonials.comment3',
    tier: 'SILVER',
  },
];

const useRandomShine = () => {
  const [isShining, setIsShining] = useState(false);

  useEffect(() => {
    let outerTimer: ReturnType<typeof setTimeout>;
    let innerTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const scheduleNextShine = () => {
      if (cancelled) return;
      const delay = Math.random() * (45000 - 30000) + 30000; // 30-45s
      outerTimer = setTimeout(() => {
        if (cancelled) return;
        setIsShining(true);
        innerTimer = setTimeout(() => {
          if (cancelled) return;
          setIsShining(false);
          scheduleNextShine();
        }, 3000);
      }, delay);
    };

    scheduleNextShine();
    return () => {
      cancelled = true;
      clearTimeout(outerTimer);
      clearTimeout(innerTimer);
    };
  }, []);

  return isShining;
};

const ComparativeTable = () => {
  const { t } = useLanguage();
  const isShining = useRandomShine();

  const features = [
    { key: 'sessions', label: 'vip.table.sessions', bronze: '2', silver: '4', gold: '8' },
    {
      key: 'priority',
      label: 'vip.service.priority.title',
      bronze: false,
      silver: true,
      gold: true,
    },
    {
      key: 'home',
      label: 'vip.service.displacements.title',
      bronze: false,
      silver: true,
      gold: true,
    },
    { key: 'family', label: 'vip.service.family.title', bronze: false, silver: false, gold: true },
    { key: 'concierge', label: 'vip.stats.concierge', bronze: false, silver: false, gold: true },
    {
      key: 'transferable',
      label: 'vip.benefits.transferable',
      bronze: true,
      silver: true,
      gold: true,
    },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <HugeiconsIcon icon={Tick02Icon} className="mx-auto size-5 text-amber-600"  />
      ) : (
        <div className="mx-auto h-1.5 w-1.5 rounded-full bg-gray-300" />
      );
    }
    return <span className="font-medium text-gray-600">{val}</span>;
  };

  return (
    <section className="relative border-t border-gray-200 bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-gray-900 md:text-4xl">
            <span
              className={`bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 bg-clip-text text-transparent ${isShining ? 'animate-pulse' : ''}`}
            >
              {t('vip.table.title')}
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto rounded-[var(--radius)] border border-gray-100 bg-white">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="w-1/3 p-6 text-left font-light text-gray-400"></th>
                <th className="p-6 text-center text-lg font-medium tracking-wider text-amber-800">
                  BRONZE
                </th>
                <th className="p-6 text-center text-lg font-medium tracking-wider text-gray-600">
                  SILVER
                </th>
                <th className="p-6 text-center text-lg font-medium tracking-wider">
                  <span className="font-bold text-amber-500">GOLD</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr
                  key={feature.key}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  <td className="p-6 font-medium text-gray-700">{t(feature.label)}</td>
                  <td className="p-6 text-center">{renderValue(feature.bronze)}</td>
                  <td className="p-6 text-center">{renderValue(feature.silver)}</td>
                  <td className="p-6 text-center">{renderValue(feature.gold)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// --- Components ---

export default function VIPContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-amber-100 selection:text-amber-900">
      <SEOUpdater
        titleKey="seo.vip.title"
        descriptionKey="seo.vip.description"
        keywordsKey="seo.vip.keywords"
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-amber-50/30 pt-32 pb-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-30" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-4 py-2">
              <span className="font-medium tracking-wide text-amber-800">VIP CLUB</span>
            </div>

            <h1 className="mb-8 font-sans text-6xl tracking-tight text-gray-900 md:text-8xl">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                {t('vip.hero.title')}
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed font-light text-gray-600 md:text-2xl">
              {t('vip.hero.subtitle')}
            </p>

            <Link href="#pricing">
              <button className="h-16 rounded-full border-none bg-gradient-to-r from-amber-500 to-amber-600 px-10 text-lg font-medium text-white transition duration-300 hover:from-amber-600 hover:to-amber-700">
                {t('vip.cta.apply')}
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Luxury Features Grid */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {defaultLuxuryFeatures.map((feature, idx) => {
              const Icon = feature.icon || Diamond01Icon;
              return (
                <div
                  key={idx}
                  className="group rounded-[var(--radius)] border border-gray-100 bg-gray-50 p-8 transition-colors hover:border-amber-100"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[var(--radius)] border border-gray-100 bg-white transition-colors">
                    <HugeiconsIcon icon={Icon} className="size-7 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900">{t(feature.title)}</h3>
                  <p className="leading-relaxed text-gray-600">{t(feature.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-sans text-4xl text-gray-900 md:text-5xl">
              {t('vip.services.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-gray-600">
              {t('vip.services.subtitle')}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {vipServices.map((service, idx) => (
              <div
                key={idx}
                className="rounded-apple-xl border border-gray-100 bg-white p-10 transition-shadow duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[var(--radius)] bg-amber-50">
                    <HugeiconsIcon icon={service.icon} className="h-8 w-8 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="mb-4 text-2xl font-bold text-gray-900">{t(service.title)}</h3>
                    <p className="mb-6 text-lg text-gray-600">{t(service.description)}</p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span className="text-sm font-medium">{t(feat)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section id="pricing" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-serif text-4xl text-gray-900 md:text-5xl">
              {t('vip.pricing.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-gray-600">
              {t('vip.pricing.subtitle')}
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-3">
            {defaultPlans.map((plan) => (
              <div
                key={plan.tier}
                className={`rounded-apple-xl relative border bg-white p-8 ${plan.popular ? 'border-amber-400' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-6 py-2 text-sm font-bold tracking-wide text-white">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-8 pt-4 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-gray-900">{t(plan.name)}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-serif text-4xl text-gray-900">{t(plan.price)}</span>
                    <span className="text-gray-500">/mo</span>
                  </div>
                  <p className="mt-4 h-12 text-gray-500">{t(plan.description)}</p>
                </div>

                <div className="mb-8">
                  {plan.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <HugeiconsIcon icon={Tick02Icon} className="mt-0.5 size-5 flex-shrink-0 text-amber-500"  />
                      <span className="text-sm text-gray-700">{t(feature)}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`h-14 w-full rounded-[var(--radius)] border-none text-lg font-bold transition ${
                    plan.popular
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {t('vip.cta.select')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ComparativeTable />

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-gray-900 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 font-serif text-3xl md:text-4xl">{t('vip.testimonials.title')}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="rounded-[var(--radius)] border border-white/10 bg-white/5 p-8 backdrop-blur-md"
              >
                <div className="mb-6 flex gap-1">
                  {[...Array(test.rating)].map((_, j) => (
                    <HugeiconsIcon icon={StarIcon} key={j} className="size-4 fill-amber-400 text-amber-400"  />
                  ))}
                </div>
                <p className="mb-8 leading-relaxed text-gray-300 italic">"{t(test.comment)}"</p>
                <div>
                  <p className="font-bold text-white">{test.name}</p>
                  <p className="text-sm text-amber-400/80">{t(test.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
