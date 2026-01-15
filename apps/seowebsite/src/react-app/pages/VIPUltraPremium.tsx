import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  Crown, Home, Clock, Sparkles, Check,
  Shield, Star, Award, Zap, Globe, Diamond
} from 'lucide-react';

import SEOHead from '@/react-app/components/SEOHead';
import { useLanguage } from '@/react-app/contexts/LanguageContext';


import { Button } from 'keep-react';

// --- Constants & Data ---

const defaultPlans = [
  {
    tier: 'bronze',
    name: 'vip.plan.bronze',
    description: 'vip.plan.bronze.description',
    price: 'vip.plan.bronze.price',
    sessions: '2',
    popular: false,
    features: ['vip.service.priority.title', 'vip.benefits.transferable', 'vip.benefits.monthly']
  },
  {
    tier: 'silver',
    name: 'vip.plan.silver',
    description: 'vip.plan.silver.description',
    price: 'vip.plan.silver.price',
    sessions: '4',
    popular: true,
    features: ['vip.plan.bronze', 'vip.service.displacements.title', 'vip.benefits.monthlyDesc']
  },
  {
    tier: 'gold',
    name: 'vip.plan.gold',
    description: 'vip.plan.gold.description',
    price: 'vip.plan.gold.price',
    sessions: '8',
    popular: false,
    features: ['vip.plan.silver', 'vip.stats.concierge', 'vip.service.family.title']
  }
];

const defaultLuxuryFeatures = [
  {
    icon: Diamond,
    title: 'vip.mostExclusive',
    description: 'vip.experienceDescription'
  },
  {
    icon: Award,
    title: 'vip.voicesOfExcellence',
    description: 'vip.testimonialsSubtitle'
  },
  {
    icon: Globe,
    title: 'vip.benefits.barcelona',
    description: 'vip.benefits.barcelonaDesc'
  },
  {
    icon: Zap,
    title: 'vip.service.priority.title',
    description: 'vip.service.priority.description'
  }
];

const vipServices = [
  {
    icon: Home,
    title: 'vip.service.displacements.title',
    description: 'vip.service.displacements.description',
    features: ['vip.benefits.barcelona', 'vip.stats.concierge', 'vip.service.priority.title', 'vip.benefits.transferable']
  },
  {
    icon: Clock,
    title: 'vip.service.health.title',
    description: 'vip.service.health.description',
    features: ['vip.benefits.monthly', 'vip.benefits.monthlyDesc', 'vip.stats.control', 'vip.benefits.sessions']
  },
  {
    icon: Sparkles,
    title: 'vip.service.family.title',
    description: 'vip.service.family.description',
    features: ['vip.stats.family', 'vip.benefits.transferable', 'vip.benefits.transferableDesc', 'vip.service.family.title']
  },
  {
    icon: Shield,
    title: 'vip.service.priority.title',
    description: 'vip.service.priority.description',
    features: ['vip.stats.concierge', 'vip.service.priority.title', 'vip.service.priority.description', 'vip.stats.exclusivity']
  }
];

const testimonials = [
  {
    name: 'Marina Castellví',
    role: 'vip.testimonials.role1',
    rating: 5,
    comment: 'vip.testimonials.comment1',
    tier: 'GOLD'
  },
  {
    name: 'Dr. Albert Vidal',
    role: 'vip.testimonials.role2',
    rating: 5,
    comment: 'vip.testimonials.comment2',
    tier: 'GOLD'
  },
  {
    name: 'Laura Montserrat',
    role: 'vip.testimonials.role3',
    rating: 5,
    comment: 'vip.testimonials.comment3',
    tier: 'SILVER'
  }
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
    { key: 'priority', label: 'vip.service.priority.title', bronze: false, silver: true, gold: true },
    { key: 'home', label: 'vip.service.displacements.title', bronze: false, silver: true, gold: true },
    { key: 'family', label: 'vip.service.family.title', bronze: false, silver: false, gold: true },
    { key: 'concierge', label: 'vip.stats.concierge', bronze: false, silver: false, gold: true },
    { key: 'transferable', label: 'vip.benefits.transferable', bronze: true, silver: true, gold: true },
  ];

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? <Check className="w-5 h-5 text-amber-600 mx-auto" /> : <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-auto" />;
    }
    return <span className="text-muted-foreground font-medium">{val}</span>;
  };

  return (
    <section className="py-24 relative bg-muted/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light mb-4 text-foreground">
            <span className={`text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 ${isShining ? 'animate-pulse' : ''}`}>{t('vip.table.title')}</span>
          </h2>
        </div>
        
        <div className="overflow-x-auto rounded-3xl shadow-xl bg-card border border-gray-100">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-muted/30/50">
                <th className="p-6 text-left text-muted-foreground/80 font-light w-1/3"></th>
                <th className="p-6 text-center text-amber-800 font-medium text-lg tracking-wider">BRONZE</th>
                <th className="p-6 text-center text-muted-foreground font-medium text-lg tracking-wider">SILVER</th>
                <th className="p-6 text-center font-medium text-lg tracking-wider"><span className="text-amber-500 font-bold">GOLD</span></th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.key} className="border-b border-gray-100 hover:bg-muted/30 transition-colors">
                  <td className="p-6 text-foreground/90 font-medium">{t(feature.label)}</td>
                  <td className="p-6 text-center">
                    {renderValue(feature.bronze)}
                  </td>
                  <td className="p-6 text-center">
                    {renderValue(feature.silver)}
                  </td>
                  <td className="p-6 text-center">
                    {renderValue(feature.gold)}
                  </td>
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

export default function VIPUltraPremium() {
  const { t } = useLanguage();
  // Removed unused vars

  // Removed empty useEffect

  return (
    <div className="min-h-screen bg-card text-foreground font-sans selection:bg-amber-100 selection:text-amber-900">
      <SEOHead
        title={t('seo.vip.title')}
        description={t('seo.vip.description')}
        keywords={t('seo.vip.keywords')}
      />

      {/* Hero Section */}
      <div className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-amber-50/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-amber-200 shadow-sm mb-8">
              <Crown className="w-5 h-5 text-amber-500" />
              <span className="text-amber-800 font-medium tracking-wide">VIP CLUB</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-serif text-foreground mb-8 tracking-tight">
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                {t('vip.hero.title')}
               </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              {t('vip.hero.subtitle')}
            </p>

            <Link to="#pricing">
              <Button 
                 className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-none px-10 h-16 rounded-full text-lg font-medium shadow-lg hover:shadow-amber-200/50 transition-all duration-300"
              >
                {t('vip.cta.apply')}
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Luxury Features Grid */}
      <section className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultLuxuryFeatures.map((feature, idx) => {
              const Icon = feature.icon || Diamond;
              return (
                <div key={idx} className="p-8 rounded-3xl bg-muted/30 border border-gray-100 hover:border-amber-100 transition-colors group">
                  <div className="w-14 h-14 rounded-2xl bg-card border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    <Icon className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t(feature.title)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(feature.description)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Detail */}
      <section className="py-24 bg-muted/30">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
               <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">{t('vip.services.title')}</h2>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">{t('vip.services.subtitle')}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
               {vipServices.map((service, idx) => (
                 <div key={idx} className="bg-card rounded-[2rem] p-10 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-8 h-8 text-amber-600" />
                       </div>
                       <div>
                          <h3 className="text-2xl font-bold text-foreground mb-4">{t(service.title)}</h3>
                          <p className="text-muted-foreground mb-6 text-lg">{t(service.description)}</p>
                          <ul className="grid sm:grid-cols-2 gap-3">
                             {service.features.map((feat, i) => (
                               <li key={i} className="flex items-center gap-2 text-foreground/90">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
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
      <section id="pricing" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-20">
             <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">{t('vip.pricing.title')}</h2>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">{t('vip.pricing.subtitle')}</p>
           </div>

           <div className="grid lg:grid-cols-3 gap-8 items-start">
             {defaultPlans.map((plan) => (
               <div 
                 key={plan.tier}
                 className={`relative bg-card rounded-[2.5rem] p-8 border ${plan.popular ? 'border-amber-400 shadow-2xl shadow-amber-100' : 'border-border shadow-lg'}`}
               >
                 {plan.popular && (
                   <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-md">
                     MOST POPULAR
                   </div>
                 )}

                 <div className="text-center mb-8 pt-4">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t(plan.name)}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                       <span className="text-4xl font-serif text-foreground">{t(plan.price)}</span>
                       <span className="text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-muted-foreground mt-4 h-12">{t(plan.description)}</p>
                 </div>

                 <div className="space-y-4 mb-8">
                    {plan.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start gap-3">
                         <Check className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                         <span className="text-foreground/90 text-sm">{t(feature)}</span>
                      </div>
                    ))}
                 </div>

                 <Button 
                   className={`w-full h-14 rounded-2xl text-lg font-bold border-none transition-all ${
                     plan.popular 
                       ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                       : 'bg-muted hover:bg-gray-200 text-foreground'
                   }`}
                 >
                   {t('vip.cta.select')}
                 </Button>
               </div>
             ))}
           </div>
        </div>
      </section>

      <ComparativeTable />

      {/* Testimonials */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-serif mb-6">{t('vip.testimonials.title')}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {testimonials.map((test, i) => (
                  <div key={i} className="bg-card/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
                     <div className="flex gap-1 mb-6">
                        {[...Array(test.rating)].map((_, j) => (
                           <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                     </div>
                     <p className="text-gray-300 mb-8 italic leading-relaxed">"{t(test.comment)}"</p>
                     <div>
                        <p className="text-white font-bold">{test.name}</p>
                        <p className="text-amber-400/80 text-sm">{t(test.role)}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

    </div>
  );
}


