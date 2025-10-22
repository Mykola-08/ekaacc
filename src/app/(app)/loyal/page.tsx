'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/context/unified-data-context';
import { getSubscriptionService } from '@/services/subscription-service';
import { getThemeService } from '@/services/theme-service';
import { getLoyaltyService } from '@/services/loyalty-service';
import { Subscription, SubscriptionUsage, Theme } from '@/lib/subscription-types';
import { Star, Zap, Gift, Palette, TrendingUp, Calendar, Award, Sparkles } from 'lucide-react';

export default function LoyalMemberPage() {
  const router = useRouter();
  const { currentUser } = useData();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loyaltyProgram, setLoyaltyProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    loadLoyalData();
  }, [currentUser]);

  const loadLoyalData = async () => {
    if (!currentUser) return;

    try {
      const subService = await getSubscriptionService();
      const themeService = await getThemeService();
      const loyaltyService = await getLoyaltyService();

      const [sub, loyaltyThemes, program] = await Promise.all([
        subService.getActiveSubscription(currentUser.id, 'loyalty'),
        themeService.getSubscriptionThemes('loyalty'),
        loyaltyService.getLoyaltyProgram(currentUser.id),
      ]);

      if (!sub) {
        // User doesn't have loyalty subscription, redirect
        router.push('/account/subscriptions');
        return;
      }

      setSubscription(sub);
      setThemes(loyaltyThemes);
      setLoyaltyProgram(program);

      // Get usage data
      const usageData = await subService.getSubscriptionUsage(sub.id);
      setUsage(usageData);
    } catch (error) {
      console.error('Failed to load loyal member data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p className="text-center">Loading your Loyal Member dashboard...</p>
      </div>
    );
  }

  if (!subscription) {
    return null; // Will redirect
  }

  const daysUntilRenewal = Math.ceil(
    (new Date(subscription.endDate as string).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="container max-w-6xl py-8 space-y-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">You're a Loyal {currentUser.loyalTier} Member!</p>
                  <p className="text-sm text-muted-foreground">
                    Enjoying {currentUser.loyalBenefits?.discountPercentage}% discount and {currentUser.loyalBenefits?.sessionCreditsPerMonth} session credits per month
                  </p>
                </div>
              </div>
              <Button variant="outline">Manage Subscription</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {loyalPlans.map((plan) => {
          const isCurrentPlan = currentUser?.loyalTier === plan.tier;
          const price = getDiscountedPrice(plan.pricePerMonthEUR);
          
          return (
            <Card
              key={plan.tier}
              className={cn(
                'relative flex flex-col',
                plan.popular && 'border-2 border-blue-500 shadow-lg scale-105',
                isCurrentPlan && 'border-2 border-green-500'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit">
                  <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit">
                  <Badge className="bg-green-500 text-white">Current Plan</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {plan.tier === 'Normal' && <Zap className="h-5 w-5 text-gray-500" />}
                  {plan.tier === 'Plus' && <Sparkles className="h-5 w-5 text-blue-500" />}
                  {plan.tier === 'Pro' && <TrendingUp className="h-5 w-5 text-purple-500" />}
                  {plan.tier === 'ProMax' && <Star className="h-5 w-5 text-yellow-500" />}
                  {plan.name}
                </CardTitle>
                <CardDescription>
                  {plan.tier === 'Normal' && 'Start your wellness journey'}
                  {plan.tier === 'Plus' && 'Most value for your investment'}
                  {plan.tier === 'Pro' && 'Advanced support & AI features'}
                  {plan.tier === 'ProMax' && 'Ultimate wellness experience'}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">€{price}</span>
                    <span className="text-muted-foreground">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save €{(plan.pricePerMonthEUR * 2).toFixed(0)} per year
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="font-semibold text-sm">Key Benefits:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{plan.sessionCreditsPerMonth} session credit{plan.sessionCreditsPerMonth > 1 ? 's' : ''} per month</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{plan.discountPercentage}% discount on all services</span>
                    </li>
                    {plan.features.slice(2, 5).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.aiFeatures && plan.aiFeatures.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <p className="font-semibold text-sm">AI Features:</p>
                    </div>
                    <ul className="space-y-2">
                      {plan.aiFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-blue-600">
                          <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? 'default' : 'outline'}
                  disabled={isCurrentPlan}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Feature Comparison</CardTitle>
          <CardDescription>See what's included in each Loyal membership tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  {loyalPlans.map((plan) => (
                    <th key={plan.tier} className="text-center p-4">
                      {plan.tier}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4">Session Credits/Month</td>
                  {loyalPlans.map((plan) => (
                    <td key={plan.tier} className="text-center p-4">
                      {plan.sessionCreditsPerMonth}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">Discount on Services</td>
                  {loyalPlans.map((plan) => (
                    <td key={plan.tier} className="text-center p-4">
                      {plan.discountPercentage}%
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">AI Personalization</td>
                  {loyalPlans.map((plan) => (
                    <td key={plan.tier} className="text-center p-4">
                      {plan.aiFeatures && plan.aiFeatures.length > 0 ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">Group Sessions</td>
                  {loyalPlans.map((plan) => (
                    <td key={plan.tier} className="text-center p-4">
                      {plan.features.some(f => f.toLowerCase().includes('group')) ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="p-4">Family Sharing</td>
                  {loyalPlans.map((plan) => (
                    <td key={plan.tier} className="text-center p-4">
                      {plan.features.some(f => f.toLowerCase().includes('family')) ? (
                        plan.tier === 'ProMax' ? '4 members' : '2 members'
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">What are session credits?</h4>
            <p className="text-sm text-muted-foreground">
              Session credits can be used to book therapy sessions. Each credit equals one session, and unused credits roll over for one month (Pro Max only).
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">How does AI personalization work?</h4>
            <p className="text-sm text-muted-foreground">
              Our AI learns from your preferences, goals, and interactions to provide personalized recommendations, track your progress, and offer tailored support that gets better over time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Can I upgrade or downgrade my plan?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! You can change your plan at any time. Upgrades take effect immediately, while downgrades apply at your next billing cycle.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
