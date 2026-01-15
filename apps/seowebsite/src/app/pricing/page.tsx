'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/platform/ui/card';
import { Check } from 'lucide-react';

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
  badge: <Badge className="bg-amber-500">Best Value</Badge>,
  cta: "Start Free Trial"
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
  badge: <Badge className="bg-yellow-500">VIP</Badge>,
  cta: "Subscribe Now"
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
  badge: <Badge className="bg-gray-400">VIP</Badge>,
  cta: "Subscribe Now"
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
  badge: <Badge className="bg-yellow-700">VIP</Badge>,
  cta: "Subscribe Now"
 }
];

export default function PricingPage() {
 return (
  <div className="min-h-screen bg-background">
   {/* Hero Section */}
   <div className="relative py-24 px-6 lg:px-8 text-center">
    <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
     Simple, Transparent Pricing
    </h1>
    <p className="text-lg leading-8 text-muted-foreground max-w-2xl mx-auto mb-10">
     Choose the perfect plan for your wellness journey. No hidden fees. Cancel anytime.
    </p>
   </div>

   {/* Pricing Grid */}
   <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
     {plans.map((plan) => (
      <Card key={plan.id} className="flex flex-col relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
       <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-2">
         {plan.badge}
        </div>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <div className="pt-4 pb-2">
         <span className="text-4xl font-bold">€{plan.price}</span>
         <span className="text-muted-foreground">/mo</span>
        </div>
        <CardDescription>{plan.description}</CardDescription>
       </CardHeader>
       <CardContent className="flex-1">
        <ul className="space-y-3 pt-4">
         {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
           <Check className="w-4 h-4 text-green-500 mt-1 shrink-0" />
           <span className="text-muted-foreground">{feature}</span>
          </li>
         ))}
        </ul>
       </CardContent>
       <CardFooter className="pt-4">
        <Button className="w-full" size="lg" asChild>
         <Link href={`/signup?plan=${plan.id}`}>
          {plan.cta}
         </Link>
        </Button>
       </CardFooter>
      </Card>
     ))}
    </div>
   </div>
  </div>
 );
}
