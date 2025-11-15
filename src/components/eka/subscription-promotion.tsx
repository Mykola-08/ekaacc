'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/keep';
import { useEffect, useState } from 'react';
;
;
;
import { Star, Crown, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { motion } from 'framer-motion';
import subscriptionManager from '@/services/subscription-manager';

export function SubscriptionPromotion() {
  const router = useRouter();
  const { appUser: currentUser } = useAuth();
  const [hasLoyal, setHasLoyal] = useState(false);
  const [hasVIP, setHasVIP] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSubscriptions = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const [loyalActive, vipActive] = await Promise.all([
          subscriptionManager.hasActiveSubscription(currentUser.id, 'loyal'),
          subscriptionManager.hasActiveSubscription(currentUser.id, 'vip')
        ]);

        setHasLoyal(loyalActive);
        setHasVIP(vipActive);
      } catch (error) {
        console.error('Error checking subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSubscriptions();
  }, [currentUser?.id]);

  // Don't show if user has both subscriptions
  if (loading || (hasLoyal && hasVIP)) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      {/* Loyal Subscription Promotion */}
      {!hasLoyal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500 rounded-xl shadow-md">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Loyal Membership</CardTitle>
                    <CardDescription>Earn more, save more</CardDescription>
                  </div>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Maximize your rewards with enhanced loyalty points and exclusive benefits.
              </p>
              
              <div className="space-y-2">
                {[
                  'Up to 3x loyalty points on all activities',
                  'Exclusive discounts up to 15%',
                  'Free sessions every month',
                  'AI-powered wellness insights',
                  'Custom workout plans',
                  'Priority customer support'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                  💡 Starting from just €9.99/month
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => router.push('/subscriptions/loyal')}
              >
                Explore Loyal Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {/* VIP Subscription Promotion */}
      {!hasVIP && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950 dark:via-amber-950 dark:to-orange-950 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-md">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">VIP Membership</CardTitle>
                    <CardDescription>Ultimate wellness experience</CardDescription>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-0">
                  Premium
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Get exclusive VIP treatment with premium benefits and priority access.
              </p>
              
              <div className="space-y-2">
                {[
                  'Up to 20 free sessions per month',
                  'Up to 30% discount on all services',
                  'Priority booking & scheduling',
                  '24/7 dedicated support',
                  'Personal wellness coach',
                  'VIP lounge & spa access',
                  'Exclusive events & retreats'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs font-medium text-orange-900 dark:text-orange-100">
                  ✨ Premium experience from €49.99/month
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
                onClick={() => router.push('/subscriptions/vip')}
              >
                Explore VIP Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
