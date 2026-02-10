'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Crown, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

const plans = [
  {
    id: 'loyal',
    name: 'Loyal',
    price: 9.99,
    description: 'Earn more points, get exclusive discounts, and enjoy premium benefits.',
    features: [
      '2x Loyalty Points',
      '5% Discount on Sessions',
      '1 Free Session/Month',
      'Exclusive Themes',
      'AI Insights',
    ],
    badge: <Badge className="bg-amber-500">Best Value</Badge>,
  },
  {
    id: 'vip1',
    name: 'VIP Bronze',
    price: 19.99,
    description: 'All Loyal benefits plus priority support and custom workouts.',
    features: ['All Loyal Benefits', 'Priority Support', 'Custom Workouts'],
    badge: <Badge className="bg-yellow-500">VIP</Badge>,
  },
  {
    id: 'vip2',
    name: 'VIP Silver',
    price: 29.99,
    description: 'All Bronze benefits plus exclusive events and 2 free sessions/month.',
    features: ['All VIP Bronze Benefits', 'Exclusive Events', '2 Free Sessions/Month'],
    badge: <Badge className="bg-muted-foreground">VIP</Badge>,
  },
  {
    id: 'vip3',
    name: 'VIP Gold',
    price: 49.99,
    description: 'All Silver benefits plus 24/7 support and 4 free sessions/month.',
    features: ['All VIP Silver Benefits', '24/7 Support', '4 Free Sessions/Month'],
    badge: <Badge className="bg-yellow-700">VIP</Badge>,
  },
];

export default function SubscriptionsPage() {
  const router = useRouter();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8 px-4 py-8 duration-700 md:px-8">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Choose Your Plan</h2>
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Unlock premium features and exclusive benefits with our subscription plans
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative rounded-2xl border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                {plan.name}
                {plan.badge}
              </CardTitle>
              <div className="pt-2 text-3xl font-bold">€{plan.price}</div>
              <div className="text-muted-foreground">{plan.description}</div>
            </CardHeader>
            <CardContent className="space-y-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  {feature}
                </div>
              ))}
            </CardContent>
            <div className="flex justify-center p-4">
              <Button className="w-full rounded-xl font-semibold" onClick={() => router.push(`/subscribe?plan=${plan.id}`)}>
                Get {plan.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
