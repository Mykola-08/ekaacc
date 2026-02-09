'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-states';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { Check, Star, Sparkles, TrendingUp, Zap, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/platform/supabase/auth';
// import subscriptionManager, { type SubscriptionPlan } from '@/lib/platform/services/subscription-manager';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/platform/ui/use-toast';

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
            popular: false,
          },
          {
            id: 'loyal-plus',
            name: 'Loyal Plus',
            type: 'loyal' as const,
            price: 49.99,
            features: ['Advanced features', 'Priority support', 'Extra sessions'],
            popular: true,
          },
        ];
        setPlans(loyalPlans);
      } catch (error) {
        console.error('Error loading plans:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading plans',
          description: 'Please try again later.',
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
        description: 'You are now a Loyal member!',
      });
      router.push('/loyal');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Subscription failed',
        description: 'Please try again or contact support.',
      });
    } finally {
      setSubscribing(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <LoadingSpinner size="lg" />
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
    <div className="container mx-auto space-y-8 p-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 py-12 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 dark:bg-amber-900/30">
          <Star className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
            Loyal Membership
          </span>
        </div>

        <h1 className="text-5xl font-bold tracking-tight">Earn More, Save More</h1>

        <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
          Maximize your wellness journey with enhanced loyalty points, exclusive discounts, and
          premium benefits.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 pt-8">
          <span
            className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}`}
          >
            Monthly
          </span>
          <Switch
            checked={billingCycle === 'yearly'}
            onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
          />
          <span
            className={`text-sm ${billingCycle === 'yearly' ? 'font-semibold' : 'text-muted-foreground'}`}
          >
            Yearly
          </span>
          {billingCycle === 'yearly' && <Badge className="bg-green-500">Save up to 17%</Badge>}
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
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
              <Card
                className={`relative h-full ${isPopular ? 'border-2 border-amber-500 shadow-lg' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-8 text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="pt-4">
                    <span className="text-4xl font-bold">€{getPrice(plan)}</span>
                    <span className="text-muted-foreground">
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="pt-2 text-sm text-green-600 dark:text-green-400">
                      Save €{savings.amount.toFixed(2)} ({savings.percentage}%)
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${isPopular ? 'bg-amber-500 hover:bg-amber-600' : ''}`}
                    variant={isPopular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing === plan.id}
                  >
                    {subscribing === plan.id ? 'Processing...' : 'Get Started'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className="mx-auto max-w-6xl pt-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Compare Plans</h2>

        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="px-4 py-4 text-left">Feature</TableHead>
                    {plans.map((plan) => (
                      <TableHead key={plan.id} className="px-4 py-4 text-center">
                        {plan.name.replace('Loyal ', '')}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b">
                    <TableCell className="px-4 py-4 font-medium">
                      Loyalty Points Multiplier
                    </TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan.id} className="px-4 py-4 text-center">
                        {plan.benefits?.loyaltyPointsMultiplier || 1}x
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-b">
                    <TableCell className="px-4 py-4 font-medium">Discount on Sessions</TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan.id} className="px-4 py-4 text-center">
                        {plan.benefits?.discountPercentage || 0}%
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-b">
                    <TableCell className="px-4 py-4 font-medium">Free Sessions/Month</TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan.id} className="px-4 py-4 text-center">
                        {plan.benefits?.freeSessionsPerMonth || 0}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-b">
                    <TableCell className="px-4 py-4 font-medium">Exclusive Themes</TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan.id} className="px-4 py-4 text-center">
                        {plan.benefits?.exclusiveThemes ? (
                          <Check className="mx-auto h-5 w-5 text-green-600" />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-b">
                    <TableCell className="px-4 py-4 font-medium">AI Insights</TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan.id} className="px-4 py-4 text-center">
                        {plan.benefits?.aiInsights ? (
                          <Check className="mx-auto h-5 w-5 text-green-600" />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="px-4 py-4 font-medium">Custom Workouts</TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan.id} className="px-4 py-4 text-center">
                        {plan.benefits?.customWorkouts ? (
                          <Check className="mx-auto h-5 w-5 text-green-600" />
                        ) : (
                          '-'
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <div className="mx-auto max-w-3xl pt-12">
        <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can cancel your subscription at any time. Your benefits will continue until
                the end of your current billing period.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do loyalty points work?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Earn points on every activity and session. Your membership multiplier increases your
                points automatically. Redeem points for free sessions, products, or services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Absolutely! You can change your plan at any time. Upgrades take effect immediately,
                while downgrades apply at your next billing cycle.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
