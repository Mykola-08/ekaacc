 
import { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Crown, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useBooking } from '@/react-app/hooks/useBooking';
import { useDiscount } from '@/react-app/contexts/DiscountContext';
import { useAnalytics } from '@/react-app/hooks/useAnalytics';
// import { supabase } from '@/react-app/lib/supabase';

const iconMap = {
  Heart,
  Sparkles,
  Crown
};

const features = [
  {
    title: 'Sense compromisos',
    description: 'Cancel·la o canvia la teva cita fins 24h abans sense cost'
  },
  {
    title: 'Garantia de satisfacció',
    description: 'Si no estàs satisfet amb la primera sessió, te la reemborsen'
  },
  {
    title: 'Professionals certificats',
    description: 'Tots els nostres terapeutes tenen certificacions oficials'
  },
  {
    title: 'Equip professional',
    description: 'Utilitzem només equip i productes de màxima qualitat'
  }
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
        popular: false
      },
      {
        id: 'pack3',
        name: 'Pack Benestar (3)',
        price: 165,
        originalPrice: 180,
        description: 'Pack de 3 sessions per un seguiment continu',
        features: ['Estalvia 15€', 'Vàlid per 3 mesos', 'Transferible'],
        icon: 'Sparkles',
        popular: true
      },
      {
        id: 'pack5',
        name: 'Pack Transformació (5)',
        price: 275,
        originalPrice: 300,
        description: 'Tractament integral per canvis profunds',
        features: ['Estalvia 25€', 'Vàlid per 6 mesos', 'Prioritat de reserva'],
        icon: 'Crown',
        popular: false
      }
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
        popular: false
      },
      {
        id: 'pack3',
        name: 'Pack Benestar (3)',
        price: 165,
        originalPrice: 180,
        description: 'Pack de 3 sessions per un seguiment continu',
        features: ['Estalvia 15€', 'Vàlid per 3 mesos', 'Transferible'],
        icon: 'Sparkles',
        popular: true
      },
      {
        id: 'pack5',
        name: 'Pack Transformació (5)',
        price: 275,
        originalPrice: 300,
        description: 'Tractament integral per canvis profunds',
        features: ['Estalvia 25€', 'Vàlid per 6 mesos', 'Prioritat de reserva'],
        icon: 'Crown',
        popular: false
      }
    ];
    // setPlans(staticPlans);
  }, []);

  const formatPrice = (price: number) => `${price}€`;

  const calculateSavings = (price: number, originalPrice: number | null) => {
    if (!originalPrice) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <section className="py-24 aurora-bg-subtle relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-2 bg-yellow-50 border border-yellow-100 rounded-full mb-8">
            <span className="text-yellow-700 font-medium text-sm uppercase tracking-wide">Tarifes transparents</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-8">
            Tria el teu{' '}
            <span className="text-yellow-500 font-medium">
              pla de benestar
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Packs dissenyats per a cada necessitat, amb la flexibilitat i qualitat que et mereixes
          </p>
        </div>

        {/* Aurora Orbs */}
        <div className="aurora-orb aurora-orb-medium absolute top-32 right-10 opacity-40"></div>
        <div className="aurora-orb aurora-orb-small absolute bottom-32 left-10 opacity-50"></div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {plans.map((plan) => {
            const Icon = iconMap[plan.icon as keyof typeof iconMap] || Heart;
            const discountedPrice = calculateDiscountedPrice(plan.price);
            const originalSavings = calculateSavings(plan.price, plan.originalPrice);
            const additionalSavings = selectedDiscount ? plan.price - discountedPrice : 0;
            const totalSavings = originalSavings + (additionalSavings > 0 ? Math.round((additionalSavings / plan.price) * 100) : 0);

            return (
              <div
                key={plan.id}
                className={`aurora-glass-card relative cursor-pointer transition-all duration-300 ${plan.popular
                    ? 'ring-2 ring-yellow-400/50 transform scale-105'
                    : selectedPlan === plan.id
                      ? 'ring-2 ring-yellow-400/50'
                      : ''
                  }`}
                onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                      Més popular
                    </div>
                  </div>
                )}

                {/* Savings Badge */}
                {(originalSavings > 0 || selectedDiscount) && (
                  <div className="absolute top-6 right-6 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    Estalvia {totalSavings}%
                  </div>
                )}

                <div className="p-8">
                  {/* Icon & Title */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-yellow-600" />
                    </div>

                    <h3 className="text-2xl font-medium text-gray-900 mb-2">
                      {plan.name}
                    </h3>

                    <p className="text-gray-600 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-8">
                    <div className="mb-2">
                      <span className="text-4xl font-light text-gray-900">
                        {formatPrice(Math.round(discountedPrice))}
                      </span>
                      {(plan.originalPrice || selectedDiscount) && (
                        <span className="text-lg text-gray-400 line-through ml-2">
                          {formatPrice(plan.originalPrice || plan.price)}
                        </span>
                      )}
                    </div>
                    {selectedDiscount && (
                      <div className="text-sm text-green-600 font-medium mb-2">
                        {selectedDiscount.name} aplicat (-{selectedDiscount.percentage}%)
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {plan.sessions} sessió{plan.sessions > 1 ? 's' : ''} · Validesa {plan.validityMonths} mes{plan.validityMonths > 1 ? 'os' : ''}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => {
                      logEvent('select_pricing_plan', { 
                          plan_id: plan.id, 
                          plan_name: plan.name,
                          price: plan.price
                      });
                      navigateToBooking(plan.name);
                    }}
                    className={`w-full py-4 rounded-2xl font-medium transition-all duration-200 text-center ${plan.popular
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 shadow-sm hover:shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-gray-50 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">
                {feature.title}
              </h4>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-medium text-gray-900 mb-4">
              No estàs segur quin pla triar?
            </h3>
            <p className="text-gray-600 mb-6">
              Fes la nostra avaluació gratuïta i descobreix quin tractament s'adapta millor a les teves necessitats
            </p>
            <Link
              to="/services"
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition-colors group"
            >
              Descobrir els nostres serveis
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

