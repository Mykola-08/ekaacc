'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter, Tabs, TabsContent, TabsItem, TabsList } from '@/components/keep';
import { useState, useEffect } from 'react';
;
;
;
;
import { Check, Star, Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/supabase-auth';
// import subscriptionManager, { type SubscriptionPlan } from '@/services/subscription-manager';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Simple SubscriptionPlan type for now
type SubscriptionPlan = {
  id: string;
  name: string;
  type: 'loyal';
  price: number;
  features: string[];
  popular?: boolean;
  tier?: string;
  benefits?: {
    loyaltyPointsMultiplier?: number;
    discountPercentage?: number;
    freeSessionsPerMonth?: number;
    exclusiveThemes?: boolean;
    aiInsights?: boolean;
    customWorkouts?: boolean;
  };
};

export default function LoyalSubscriptionPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subscribing, setSubscribing] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        // Mock subscription plans - replace with real implementation
        const loyalPlans = [
          {
            id: 'loyal-normal',
            name: 'Loyal Normal',
            type: 'loyal' as const,
            price: 29.99,
            features: ['Basic features', 'Email support'],
            popular: false
          },
          {
            id: 'loyal-plus',
            name: 'Loyal Plus',
            type: 'loyal' as const,
            price: 49.99,
            features: ['Advanced features', 'Priority support', 'Extra sessions'],
            popular: true
          }
        ];
        setPlans(loyalPlans);
      } catch (error) {
        console.error('Error loading plans:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading plans',
          description: 'Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [toast]);

  const handleSubscribe = async (planId: string) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setSubscribing(planId);
    try {
      // Mock subscription - replace with real implementation
      toast({
        title: 'Success!',
        description: 'You are now a Loyal member!'
      });
      router.push('/loyal');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Subscription failed',
        description: 'Please try again or contact support.'
      });
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  const getPrice = (plan: any) => {
    return billingCycle === 'monthly' ? plan.price : plan.price * 12 * 0.8; // 20% discount for yearly
  };

  const getSavings = (plan: any) => {
    const monthlyCost = plan.price * 12;
    const yearlyCost = plan.price * 12 * 0.8;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 py-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full">
          <Star className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Loyal Membership
          </span>
        </div>
        
        <h1 className="text-5xl font-bold tracking-tight">
          Earn More, Save More
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Maximize your wellness journey with enhanced loyalty points, exclusive discounts, and premium benefits.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <button
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-amber-200 dark:bg-amber-800 transition-colors"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-amber-600 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm ${billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <Badge className="bg-green-500">Save up to 17%</Badge>
          )}
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const savings = getSavings(plan);
          const isPopular = plan.tier === 'Pro';

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${isPopular ? 'border-2 border-amber-500 shadow-lg' : ''}`}>
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">€{getPrice(plan)}</span>
                    <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600 dark:text-green-400 pt-2">
                      Save €{savings.amount.toFixed(2)} ({savings.percentage}%)
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${
                      isPopular
                        ? 'bg-amber-500 hover:bg-amber-600'
                        : ''
                    }`}
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                  >
                    {subscribing === plan.id ? 'Processing...' : 'Get Started'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl mx-auto pt-12">
        <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
        
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Feature</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-4 px-4">
                        {plan.name.replace('Loyal ', '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Loyalty Points Multiplier</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.benefits?.loyaltyPointsMultiplier || 1}x
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Discount on Sessions</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.benefits?.discountPercentage || 0}%
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Free Sessions/Month</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.benefits?.freeSessionsPerMonth || 0}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">Exclusive Themes</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.benefits?.exclusiveThemes ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4 font-medium">AI Insights</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.benefits?.aiInsights ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : '-'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium">Custom Workouts</td>
                    {plans.map(plan => (
                      <td key={plan.id} className="text-center py-4 px-4">
                        {plan.benefits?.customWorkouts ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto pt-12">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can cancel your subscription at any time. Your benefits will continue until the end of your current billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do loyalty points work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Earn points on every activity and session. Your membership multiplier increases your points automatically. Redeem points for free sessions, products, or services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Absolutely! You can change your plan at any time. Upgrades take effect immediately, while downgrades apply at your next billing cycle.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
