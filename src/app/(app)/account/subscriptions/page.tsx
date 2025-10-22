'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/context/unified-data-context';
import { getSubscriptionService } from '@/services/subscription-service';
import { SubscriptionTier, UserSubscriptionSummary } from '@/lib/subscription-types';
import { Crown, Star, Check, Sparkles, Zap, Shield, X } from 'lucide-react';

export default function SubscriptionsPage() {
  const router = useRouter();
  const { currentUser } = useData();
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [summary, setSummary] = useState<UserSubscriptionSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    loadSubscriptionData();
  }, [currentUser]);

  const loadSubscriptionData = async () => {
    if (!currentUser) return;
    
    try {
      const service = await getSubscriptionService();
      const [tiersData, summaryData] = await Promise.all([
        service.getSubscriptionTiers(),
        service.getUserSubscriptionSummary(currentUser.id),
      ]);
      
      setTiers(tiersData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (tierId: string, interval: 'monthly' | 'yearly') => {
    // In production, this would create a Stripe Checkout session
    console.log(`Subscribing to ${tierId} - ${interval}`);
    // For now, just redirect to a coming soon page
    alert('Stripe integration coming soon! This will redirect to secure payment.');
  };

  const handleManageSubscription = (type: 'loyalty' | 'vip') => {
    router.push(`/account/subscriptions/${type}`);
  };

  if (!currentUser) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Please log in to view subscriptions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <p className="text-center">Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock premium features and enhance your mental wellness journey with our subscription plans
        </p>
      </div>

      {/* Current Subscriptions Banner */}
      {(summary?.hasLoyalty || summary?.hasVIP) && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {summary.hasLoyalty && summary.loyaltySubscription && (
              <div className="flex items-center gap-4 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg flex-1 min-w-[300px]">
                <Star className="h-8 w-8 text-amber-500" />
                <div className="flex-1">
                  <h3 className="font-semibold">Loyal Member</h3>
                  <p className="text-sm text-muted-foreground">
                    Active until {new Date(summary.loyaltySubscription.endDate as string).toLocaleDateString()}
                  </p>
                </div>
                <Button onClick={() => handleManageSubscription('loyalty')} variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            )}
            
            {summary.hasVIP && summary.vipSubscription && (
              <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg flex-1 min-w-[300px]">
                <Crown className="h-8 w-8 text-purple-500" />
                <div className="flex-1">
                  <h3 className="font-semibold">VIP Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Active until {new Date(summary.vipSubscription.endDate as string).toLocaleDateString()}
                  </p>
                </div>
                <Button onClick={() => handleManageSubscription('vip')} variant="outline" size="sm">
                  Manage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subscription Tiers */}
      <div className="grid md:grid-cols-2 gap-6">
        {tiers.map((tier) => {
          const hasThisSubscription = tier.type === 'loyalty' ? summary?.hasLoyalty : summary?.hasVIP;
          const IconComponent = tier.type === 'loyalty' ? Star : Crown;
          
          return (
            <Card key={tier.id} className={`relative ${tier.popularBadge ? 'border-primary shadow-lg' : ''}`}>
              {tier.popularBadge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-6 w-6" style={{ color: tier.color }} />
                    <CardTitle>{tier.displayName}</CardTitle>
                  </div>
                  {hasThisSubscription && (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </div>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Pricing */}
                <Tabs defaultValue="monthly" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="monthly" className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold">
                        €{tier.monthlyPrice}
                        <span className="text-lg font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                    {!hasThisSubscription && (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => handleSubscribe(tier.id, 'monthly')}
                      >
                        Subscribe Monthly
                      </Button>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="yearly" className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold">
                        €{tier.yearlyPrice}
                        <span className="text-lg font-normal text-muted-foreground">/year</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        Save €{(tier.monthlyPrice * 12 - tier.yearlyPrice).toFixed(2)} per year
                      </p>
                    </div>
                    {!hasThisSubscription && (
                      <Button 
                        className="w-full" 
                        size="lg"
                        onClick={() => handleSubscribe(tier.id, 'yearly')}
                      >
                        Subscribe Yearly
                      </Button>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground">What's included</h4>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Features */}
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="font-semibold text-sm uppercase text-muted-foreground">Key Features</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {tier.features.loyaltyPointsMultiplier && (
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-amber-500" />
                        <span>{tier.features.loyaltyPointsMultiplier}x Points</span>
                      </div>
                    )}
                    {tier.features.prioritySupport && (
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>Priority Support</span>
                      </div>
                    )}
                    {tier.features.unlimitedSessions && (
                      <div className="flex items-center gap-1">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>Unlimited Sessions</span>
                      </div>
                    )}
                    {tier.features.customThemes && (
                      <div className="flex items-center gap-1">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        <span>Custom Themes</span>
                      </div>
                    )}
                  </div>
                </div>

                {hasThisSubscription && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleManageSubscription(tier.type)}
                  >
                    Manage Subscription
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Can I have both subscriptions?</h4>
            <p className="text-sm text-muted-foreground">
              Yes! You can subscribe to both Loyal Member and VIP Premium simultaneously. 
              Benefits from both subscriptions will be combined to give you the maximum rewards and features.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Can I cancel anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. You'll continue to have access 
              until the end of your current billing period.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">
              We accept all major credit and debit cards through Stripe, our secure payment processor.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">What happens to my themes if I cancel?</h4>
            <p className="text-sm text-muted-foreground">
              If you cancel a subscription, you'll lose access to the premium themes associated with 
              that subscription. Your theme will automatically revert to the default theme.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
