'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Crown,
  Home,
  Clock,
  Sparkles,
  Check,
  Shield,
  Star,
  Award,
  Zap,
  Globe,
  Diamond,
} from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';

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
    icon: Diamond,
    title: 'vip.mostExclusive',
    description: 'vip.experienceDescription',
  },
  {
    icon: Award,
    title: 'vip.voicesOfExcellence',
    description: 'vip.testimonialsSubtitle',
  },
  {
    icon: Globe,
    title: 'vip.benefits.barcelona',
    description: 'vip.benefits.barcelonaDesc',
  },
  {
    icon: Zap,
    title: 'vip.service.priority.title',
    description: 'vip.service.priority.description',
  },
];

const vipServices = [
  {
    icon: Home,
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
    icon: Clock,
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
    icon: Sparkles,
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
    icon: Shield,
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
    const scheduleNextShine = () => {
      const delay = Math.random() * (45000 - 30000) + 30000; // 30-45s
      const timer = setTimeout(() => {
        setIsShining(true);
        setTimeout(() => {
          setIsShining(false);
          scheduleNextShine();
        }, 3000); // Duration of shine animation
      }, delay);
      return timer;
    };

    const timer = scheduleNextShine();
    return () => clearTimeout(timer);
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
        <Check className="mx-auto h-5 w-5 text-warning" />
      ) : (
        <div className="mx-auto h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
      );
    }
    return <span className="font-medium text-muted-foreground">{val}</span>;
  };

  return (
    <section className="relative border-t border-border bg-muted py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-foreground md:text-4xl">
            <span
              className={`bg-linear-to-r from-warning/90 via-warning/100 to-warning bg-clip-text text-transparent ${isShining ? 'animate-pulse' : ''}`}
            >
              {t('vip.table.title')}
            </span>
          </h2>
        </div>

        <div className="overflow-x-auto rounded-[20px] border border-border bg-card shadow-xl">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="w-1/3 p-6 text-left font-light text-muted-foreground/60"></th>
                <th className="p-6 text-center text-lg font-medium tracking-wider text-warning">
                  BRONZE
                </th>
                <th className="p-6 text-center text-lg font-medium tracking-wider text-muted-foreground">
                  SILVER
                </th>
                <th className="p-6 text-center text-lg font-medium tracking-wider">
                  <span className="font-bold text-warning">GOLD</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr
                  key={feature.key}
                  className="border-b border-border transition-colors hover:bg-muted"
                >
                  <td className="p-6 font-medium text-foreground">{t(feature.label)}</td>
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
    <div className="min-h-screen bg-card font-sans text-foreground selection:bg-warning/20 selection:text-warning">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-br from-muted via-background to-warning/5 pt-32 pb-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,oklch(1 0 0 / 0))] bg-center opacity-30" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-warning/30 bg-card px-4 py-2 shadow-sm">
              <Crown className="h-5 w-5 text-warning" />
              <span className="font-medium tracking-wide text-warning">VIP CLUB</span>
            </div>

            <h1 className="mb-8 font-serif text-6xl tracking-tight text-foreground md:text-8xl">
              <span className="bg-linear-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent">
                {t('vip.hero.title')}
              </span>
            </h1>

            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed font-light text-muted-foreground md:text-2xl">
              {t('vip.hero.subtitle')}
            </p>

            <Link href="#pricing">
              <button className="h-16 rounded-full border-none bg-linear-to-r from-warning to-warning px-10 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:from-warning/90 hover:to-warning/80 hover:shadow-warning/20">
                {t('vip.cta.apply')}
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Luxury Features Grid */}
      <section className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {defaultLuxuryFeatures.map((feature, idx) => {
              const Icon = feature.icon || Diamond;
              return (
                <div
                  key={idx}
                  className="group rounded-[20px] border border-border bg-muted p-8 transition-colors hover:border-warning/20"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[20px] border border-border bg-card shadow-sm transition-transform group-hover:scale-110">
                    <Icon className="h-7 w-7 text-warning" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{t(feature.title)}</h3>
                  <p className="leading-relaxed text-muted-foreground">{t(feature.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="bg-muted py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl">
              {t('vip.services.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-muted-foreground">
              {t('vip.services.subtitle')}
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {vipServices.map((service, idx) => (
              <div
                key={idx}
                className="rounded-apple-xl border border-border bg-card p-10 shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="flex items-start gap-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-warning/10">
                    <service.icon className="h-8 w-8 text-warning" />
                  </div>
                  <div>
                    <h3 className="mb-4 text-2xl font-bold text-foreground">{t(service.title)}</h3>
                    <p className="mb-6 text-lg text-muted-foreground">{t(service.description)}</p>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {service.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-warning" />
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
      <section id="pricing" className="bg-card py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 font-serif text-4xl text-foreground md:text-5xl">
              {t('vip.pricing.title')}
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-muted-foreground">
              {t('vip.pricing.subtitle')}
            </p>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-3">
            {defaultPlans.map((plan) => (
              <div
                key={plan.tier}
                className={`rounded-apple-xl relative border bg-card p-8 ${plan.popular ? 'border-warning shadow-2xl shadow-warning/20' : 'border-border shadow-lg'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-warning px-6 py-2 text-sm font-bold tracking-wide text-white shadow-md">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-8 pt-4 text-center">
                  <h3 className="mb-2 text-2xl font-bold text-foreground">{t(plan.name)}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-serif text-4xl text-foreground">{t(plan.price)}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <p className="mt-4 h-12 text-muted-foreground">{t(plan.description)}</p>
                </div>

                <div className="mb-8 space-y-4">
                  {plan.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
                      <span className="text-sm text-foreground">{t(feature)}</span>
                    </div>
                  ))}
                </div>

                <button
                  className={`h-14 w-full rounded-[20px] border-none text-lg font-bold transition-all ${
                    plan.popular
                      ? 'bg-warning text-white hover:bg-warning'
                      : 'bg-muted text-foreground hover:bg-muted'
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
      <section className="relative overflow-hidden bg-background py-24 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-6 font-serif text-3xl md:text-4xl">{t('vip.testimonials.title')}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((test, i) => (
              <div
                key={i}
                className="rounded-[20px] border border-border/10 bg-white/5 p-8 backdrop-blur-md"
              >
                <div className="mb-6 flex gap-1">
                  {[...Array(test.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="mb-8 leading-relaxed text-muted-foreground/40 italic">"{t(test.comment)}"</p>
                <div>
                  <p className="font-bold text-white">{test.name}</p>
                  <p className="text-sm text-warning/80">{t(test.role)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
