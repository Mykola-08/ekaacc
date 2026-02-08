import { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Crown, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useBooking } from '@/hooks/marketing/useBooking';
import { useDiscount } from '@/context/DiscountContext';
import { useAnalytics } from '@/hooks/marketing/useAnalytics';
// import { supabase } from '@/lib/marketing/supabase';

const iconMap = {
  Heart,
  Sparkles,
  Crown,
};

const features = [
  {
    title: 'Sense compromisos',
    description: 'Cancel·la o canvia la teva cita fins 24h abans sense cost',
  },
  {
    title: 'Garantia de satisfacció',
    description: 'Si no estàs satisfet amb la primera sessió, te la reemborsen',
  },
  {
    title: 'Professionals certificats',
    description: 'Tots els nostres terapeutes tenen certificacions oficials',
  },
  {
    title: 'Equip professional',
    description: 'Utilitzem només equip i productes de màxima qualitat',
  },
];

export default function PricingSection() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([
    {
      id: 'basic',
      name: 'Sessió Individual',
      price: 60,
      originalPrice: null,
      description: 'Una sessió completa de 60 minuts',
      features: ['Massatge Terapèutic', 'Kinesiologia', 'Osteopatia Suau'],
      icon: 'Heart',
      popular: false,
    },
    {
      id: 'pack3',
      name: 'Pack Benestar (3)',
      price: 165,
      originalPrice: 180,
      description: 'Pack de 3 sessions per un seguiment continu',
      features: ['Estalvia 15€', 'Vàlid per 3 mesos', 'Transferible'],
      icon: 'Sparkles',
      popular: true,
    },
    {
      id: 'pack5',
      name: 'Pack Transformació (5)',
      price: 275,
      originalPrice: 300,
      description: 'Tractament integral per canvis profunds',
      features: ['Estalvia 25€', 'Vàlid per 6 mesos', 'Prioritat de reserva'],
      icon: 'Crown',
      popular: false,
    },
  ]);
  const { navigateToBooking } = useBooking();
  const { logEvent } = useAnalytics();
  const { calculateDiscountedPrice, selectedDiscount } = useDiscount();

  useEffect(() => {
    /*
    const fetchData = async () => {
      const { data } = await supabase
        .from('content_blocks')
        .select('data')
        .eq('key', 'pricing_plans')
        .single();

      if (data) {
        setPlans(data.data as any[]);
      }
    };
    fetchData();
    */
    const staticPlans = [
      {
        id: 'basic',
        name: 'Sessió Individual',
        price: 60,
        originalPrice: null,
        description: 'Una sessió completa de 60 minuts',
        features: ['Massatge Terapèutic', 'Kinesiologia', 'Osteopatia Suau'],
        icon: 'Heart',
        popular: false,
      },
      {
        id: 'pack3',
        name: 'Pack Benestar (3)',
        price: 165,
        originalPrice: 180,
        description: 'Pack de 3 sessions per un seguiment continu',
        features: ['Estalvia 15€', 'Vàlid per 3 mesos', 'Transferible'],
        icon: 'Sparkles',
        popular: true,
      },
      {
        id: 'pack5',
        name: 'Pack Transformació (5)',
        price: 275,
        originalPrice: 300,
        description: 'Tractament integral per canvis profunds',
        features: ['Estalvia 25€', 'Vàlid per 6 mesos', 'Prioritat de reserva'],
        icon: 'Crown',
        popular: false,
      },
    ];
    // setPlans(staticPlans);
  }, []);

  const formatPrice = (price: number) => `${price}€`;

  const calculateSavings = (price: number, originalPrice: number | null) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <section className="aurora-bg-subtle relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-yellow-100 bg-yellow-50 px-6 py-2">
            <span className="text-sm font-medium tracking-wide text-yellow-700 uppercase">
              Tarifes transparents
            </span>
          </div>

          <h2 className="text-foreground mb-8 text-4xl font-light md:text-5xl">
            Tria el teu <span className="font-medium text-yellow-500">pla de benestar</span>
          </h2>

          <p className="text-muted-foreground mx-auto max-w-3xl text-xl font-light">
            Packs dissenyats per a cada necessitat, amb la flexibilitat i qualitat que et mereixes
          </p>
        </div>

        {/* Aurora Orbs */}
        <div className="aurora-orb aurora-orb-medium absolute top-32 right-10 opacity-40"></div>
        <div className="aurora-orb aurora-orb-small absolute bottom-32 left-10 opacity-50"></div>

        {/* Pricing Cards */}
        <div className="mb-32 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon = iconMap[plan.icon as keyof typeof iconMap] || Heart;
            const discountedPrice = calculateDiscountedPrice(plan.price);
            const originalSavings = calculateSavings(plan.price, plan.originalPrice);
            const additionalSavings = selectedDiscount ? plan.price - discountedPrice : 0;
            const totalSavings =
              originalSavings +
              (additionalSavings > 0 ? Math.round((additionalSavings / plan.price) * 100) : 0);

            return (
              <div
                key={plan.id}
                className={`aurora-glass-card relative cursor-pointer transition-all duration-300 ${
                  plan.popular
                    ? 'scale-105 transform ring-2 ring-yellow-400/50'
                    : selectedPlan === plan.id
                      ? 'ring-2 ring-yellow-400/50'
                      : ''
                }`}
                onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 transform">
                    <div className="text-foreground rounded-full bg-yellow-400 px-4 py-1.5 text-sm font-medium shadow-sm">
                      Més popular
                    </div>
                  </div>
                )}

                {/* Savings Badge */}
                {(originalSavings > 0 || selectedDiscount) && (
                  <div className="absolute top-6 right-6 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Estalvia {totalSavings}%
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Title */}
                  <div className="mb-8 text-center">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] bg-yellow-100">
                      <Icon className="h-8 w-8 text-yellow-600" />
                    </div>

                    <h3 className="text-foreground mb-2 text-2xl font-medium">{plan.name}</h3>

                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8 text-center">
                    <div className="mb-2">
                      <span className="text-foreground text-4xl font-light">
                        {formatPrice(Math.round(discountedPrice))}
                      </span>
                      {(plan.originalPrice || selectedDiscount) && (
                        <span className="text-muted-foreground/80 ml-2 text-lg line-through">
                          {formatPrice(plan.originalPrice || plan.price)}
                        </span>
                      )}
                    </div>
                    {selectedDiscount && (
                      <div className="mb-2 text-sm font-medium text-green-600">
                        {selectedDiscount.name} aplicat (-{selectedDiscount.percentage}%)
                      </div>
                    )}
                    <div className="text-muted-foreground text-sm">
                      {plan.sessions} sessió{plan.sessions > 1 ? 's' : ''} · Validesa{' '}
                      {plan.validityMonths} mes{plan.validityMonths > 1 ? 'os' : ''}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="mt-0.5 mr-3 h-5 w-5 shrink-0 text-green-500" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      logEvent('select_pricing_plan', {
                        plan_id: plan.id,
                        plan_name: plan.name,
                        price: plan.price,
                      });
                      navigateToBooking(plan.name);
                    }}
                    className={`w-full rounded-[20px] py-4 text-center font-medium transition-all duration-200 ${
                      plan.popular
                        ? 'text-foreground bg-yellow-400 shadow-sm hover:bg-yellow-500 hover:shadow-md'
                        : 'bg-muted text-foreground hover:bg-gray-200'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="bg-muted/30 rounded-[20px] p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[20px] bg-yellow-100">
                <CheckCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <h4 className="text-foreground mb-2 font-medium">{feature.title}</h4>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-muted/30 rounded-[20px] p-8">
            <h3 className="text-foreground mb-4 text-2xl font-medium">
              No estàs segur quin pla triar?
            </h3>
            <p className="text-muted-foreground mb-6">
              Fes la nostra avaluació gratuïta i descobreix quin tractament s'adapta millor a les
              teves necessitats
            </p>
            <Link
              to="/services"
              className="group inline-flex items-center font-medium text-yellow-600 transition-colors hover:text-yellow-700"
            >
              Descobrir els nostres serveis
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
