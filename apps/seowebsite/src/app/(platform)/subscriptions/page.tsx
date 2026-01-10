"use client";

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Check, Crown, Sparkles } from "lucide-react";
import { PageContainer } from '@/components/platform/eka/page-container';
import { PageHeader } from '@/components/platform/eka/page-header';
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "loyal",
    name: "Loyal",
    price: 9.99,
    description: "Earn more points, get exclusive discounts, and enjoy premium benefits.",
    features: [
      "2x Loyalty Points",
      "5% Discount on Sessions",
      "1 Free Session/Month",
      "Exclusive Themes",
      "AI Insights"
    ],
    badge: <Badge className="bg-amber-500">Best Value</Badge>
  },
  {
    id: "vip1",
    name: "VIP Bronze",
    price: 19.99,
    description: "All Loyal benefits plus priority support and custom workouts.",
    features: [
      "All Loyal Benefits",
      "Priority Support",
      "Custom Workouts"
    ],
    badge: <Badge className="bg-yellow-500">VIP</Badge>
  },
  {
    id: "vip2",
    name: "VIP Silver",
    price: 29.99,
    description: "All Bronze benefits plus exclusive events and 2 free sessions/month.",
    features: [
      "All VIP Bronze Benefits",
      "Exclusive Events",
      "2 Free Sessions/Month"
    ],
    badge: <Badge className="bg-gray-400">VIP</Badge>
  },
  {
    id: "vip3",
    name: "VIP Gold",
    price: 49.99,
    description: "All Silver benefits plus 24/7 support and 4 free sessions/month.",
    features: [
      "All VIP Silver Benefits",
      "24/7 Support",
      "4 Free Sessions/Month"
    ],
    badge: <Badge className="bg-yellow-700">VIP</Badge>
  }
];

export default function SubscriptionsPage() {
  const router = useRouter();
  return (
    <PageContainer>
      <PageHeader
        icon={Crown}
        title="Choose Your Plan"
        description="Unlock premium features and exclusive benefits with our subscription plans"
      />
      <div className="grid md:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                {plan.name}
                {plan.badge}
              </CardTitle>
              <div className="pt-2 text-3xl font-bold">€{plan.price}</div>
              <div className="text-muted-foreground">{plan.description}</div>
            </CardHeader>
            <CardContent className="space-y-2">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  {feature}
                </div>
              ))}
            </CardContent>
            <div className="p-4 flex justify-center">
              <Button className="w-full" onClick={() => router.push(`/subscribe?plan=${plan.id}`)}>
                Get {plan.name}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
