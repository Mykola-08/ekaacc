'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Star, Calendar, TrendingUp, Award, Palette, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { getSubscriptionService } from '@/services/subscription-service';
import { getThemeService } from '@/services/theme-service';
import { useData } from '@/context/unified-data-context';
import type { Subscription, SubscriptionUsage, Theme, SubscriptionTier } from '@/lib/subscription-types';

export default function LoyalMemberPage() {
  const { currentUser } = useData();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [availableThemes, setAvailableThemes] = useState<Theme[]>([]);

  useEffect(() => {
    const loadSubscriptionData = async () => {
      if (!currentUser?.id) return;
      
      setLoading(true);
      try {
        const subscriptionService = await getSubscriptionService();
        const themeService = await getThemeService();
        
        const userSubscriptions = await subscriptionService.getUserSubscriptions(currentUser.id);
        const loyaltySubscription = userSubscriptions.find((s: Subscription) => s.type === 'loyalty' && s.status === 'active');
        
        if (loyaltySubscription) {
          setSubscription(loyaltySubscription);
          
          // Get all tiers and find the one matching our subscription
          const allTiers = await subscriptionService.getSubscriptionTiers();
          const matchingTier = allTiers.find(t => t.type === 'loyalty' && Math.abs(t.monthlyPrice - loyaltySubscription.price) < 0.01);
          if (matchingTier) {
            setTier(matchingTier);
          }
          
          const usageData = await subscriptionService.getSubscriptionUsage(loyaltySubscription.id);
          setUsage(usageData);
          
          const themes = await themeService.getUserAvailableThemes(currentUser.id);
          setAvailableThemes(themes);
        }
      } catch (error) {
        console.error('Failed to load loyalty subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptionData();
  }, [currentUser?.id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </div>
    );
  }

  if (!subscription || !tier) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle>Loyal Membership</CardTitle>
                <CardDescription>Enhanced rewards and exclusive benefits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              You don&apos;t have an active Loyal membership.
            </p>
            <Button className="w-full bg-amber-500 hover:bg-amber-600">
              <Star className="w-4 h-4 mr-2" />
              Become a Loyal Member
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextBillingDate = typeof subscription.currentPeriodEnd === 'string' 
    ? new Date(subscription.currentPeriodEnd)
    : subscription.currentPeriodEnd instanceof Date
    ? subscription.currentPeriodEnd
    : subscription.currentPeriodEnd.toDate();
  const daysUntilRenewal = Math.ceil((nextBillingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-amber-500 rounded-2xl shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl font-bold text-amber-600">Loyal Member</h1>
                  <Badge className="bg-amber-500 text-white border-0">{tier.name}</Badge>
                </div>
                <p className="text-gray-600 mb-3">{tier.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-600">
                    <Calendar className="w-4 h-4" />
                    <span>Renews in {daysUntilRenewal} days</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>{subscription.interval === 'monthly' ? 'Monthly' : 'Yearly'} plan</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="border-amber-300 text-amber-600">
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Points Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">{usage?.loyaltyPointsEarned || 0}</span>
              <span className="text-sm text-gray-500">points</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
              <Zap className="w-3 h-3" />
              <span>2x multiplier active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Discount Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">€{(usage?.loyaltyDiscountUsed || 0).toFixed(2)}</span>
              <span className="text-sm text-gray-500">saved</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
              <Award className="w-3 h-3" />
              <span>10% discount</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Themes Unlocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-600">{availableThemes.length}</span>
              <span className="text-sm text-gray-500">themes</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600 mt-2">
              <Palette className="w-3 h-3" />
              <span>Premium access</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="benefits" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Your Loyal Benefits
              </CardTitle>
              <CardDescription>All the perks included in your {tier.name} membership</CardDescription>
            </CardHeader>
            <CardContent>
              {tier.benefits.map((benefit: string, index: number) => (
                <div key={index} className="p-3 mb-2 bg-amber-50 rounded-lg border border-amber-100">
                  <div className="flex items-start gap-2">
                    <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-amber-500" />
                Premium Themes
              </CardTitle>
              <CardDescription>Customize your experience with exclusive Loyal themes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableThemes.filter((t: Theme) => t.requiredSubscription === 'loyalty').map((theme: Theme) => (
                  <div key={theme.id} className="p-4 border border-amber-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                        <p className="text-sm text-gray-600">{theme.description}</p>
                      </div>
                      <Badge className="bg-amber-500 text-white border-0">Loyal</Badge>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200" style={{ backgroundColor: theme.colors.primary }} title="Primary" />
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200" style={{ backgroundColor: theme.colors.secondary }} title="Secondary" />
                      <div className="w-8 h-8 rounded-full border-2 border-gray-200" style={{ backgroundColor: theme.colors.accent }} title="Accent" />
                    </div>
                  </div>
                ))}
              </div>
              {availableThemes.filter((t: Theme) => t.requiredSubscription === 'loyalty').length === 0 && (
                <p className="text-center text-gray-500 py-8">No Loyal themes available yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-500" />
                Usage Statistics
              </CardTitle>
              <CardDescription>Track how you&apos;re using your Loyal membership</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-700">Points Earned</span>
                  <span className="font-semibold text-amber-600">{usage?.loyaltyPointsEarned || 0} points</span>
                </div>
                <Progress value={((usage?.loyaltyPointsEarned || 0) % 500) / 5} />
                <p className="text-xs text-gray-500 mt-1">{500 - ((usage?.loyaltyPointsEarned || 0) % 500)} points until next reward</p>
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-700">Savings This Month</span>
                  <span className="font-semibold text-amber-600">€{(usage?.loyaltyDiscountUsed || 0).toFixed(2)}</span>
                </div>
                <Progress value={Math.min(((usage?.loyaltyDiscountUsed || 0) / 50) * 100, 100)} />
              </div>

              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-medium text-gray-700">Themes Used</span>
                  <span className="font-semibold text-amber-600">{usage?.themesUsed?.length || 0} / {availableThemes.length}</span>
                </div>
                <Progress value={((usage?.themesUsed?.length || 0) / Math.max(availableThemes.length, 1)) * 100} />
              </div>

              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Membership Benefits</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points Multiplier</span>
                    <span className="font-semibold text-amber-600">{tier.features.loyaltyPointsMultiplier || 2}x</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount Rate</span>
                    <span className="font-semibold text-amber-600">{tier.features.loyaltyDiscountPercentage || 10}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available Themes</span>
                    <span className="font-semibold text-amber-600">{availableThemes.length} themes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Priority Support</span>
                    <span className="font-semibold text-amber-600">{tier.features.prioritySupport ? 'Included' : 'Not included'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}