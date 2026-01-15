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
  badge: "Best Value",
  cta: "Start Free Trial",
  popular: true
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
  cta: "Subscribe Now",
  popular: false
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
  cta: "Subscribe Now",
  popular: false
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
  badge: "VIP Exclusive",
  cta: "Subscribe Now",
  popular: false
 }
];

export default function PricingPage() {
 return (
  <div className="min-h-screen bg-background">
   {/* Hero Section */}
   <div className="relative py-32 px-6 lg:px-8 text-center overflow-hidden">
    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
    
    <div className="relative z-10">
      <div className="inline-flex items-center px-4 py-1.5 bg-white/60 backdrop-blur-md border border-white/40 rounded-full mb-8 shadow-sm">
       <span className="text-primary font-medium text-sm tracking-wide">Flexible Plans</span>
      </div>
      <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl mb-6 text-foreground">
       Simple, Transparent Pricing
      </h1>
      <p className="text-xl leading-8 text-muted-foreground max-w-2xl mx-auto mb-10 font-light">
       Choose the perfect plan for your wellness journey. No hidden fees. Cancel anytime.
      </p>
    </div>
   </div>

   {/* Pricing Grid */}
   <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
     {plans.map((plan) => (
      <Card 
       key={plan.id} 
       className={`flex flex-col relative overflow-hidden transition-all duration-300 border h-full rounded-[32px] hover:shadow-xl
        ${plan.popular 
          ? 'bg-white/80 backdrop-blur-md border-primary/30 shadow-lg ring-1 ring-primary/20 transform scale-105 z-10' 
          : 'bg-white/40 backdrop-blur-sm border-white/40 hover:bg-white/60 shadow-sm'
        }`}
      >
       {plan.badge && (
        <div className="absolute top-0 inset-x-0 flex justify-center -mt-3">
          <Badge className="bg-primary text-white hover:bg-primary px-4 py-1 rounded-full shadow-md border-none text-xs font-semibold uppercase tracking-wider">
            {plan.badge}
          </Badge>
        </div>
       )}
       
       <CardHeader className="text-center pb-6 pt-10">
        <CardTitle className="text-xl font-bold text-foreground mb-4">{plan.name}</CardTitle>
        <div className="flex items-baseline justify-center gap-1 mb-4">
         <span className="text-4xl font-bold text-foreground">€{plan.price}</span>
         <span className="text-muted-foreground text-sm font-medium">/mo</span>
        </div>
        <CardDescription className="text-muted-foreground leading-relaxed px-2 font-light">
          {plan.description}
        </CardDescription>
       </CardHeader>
       
       <CardContent className="flex-1 px-8">
        <div className="w-full h-px bg-foreground/5 mb-6" />
        <ul className="space-y-4">
         {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3 text-sm">
           <div className={`p-1 rounded-full shrink-0 ${plan.popular ? 'bg-primary/10 text-primary' : 'bg-white/60 text-muted-foreground'}`}>
             <Check className={`w-3 h-3 ${plan.popular ? 'text-primary' : 'text-foreground/60'}`} />
           </div>
           <span className="text-muted-foreground font-medium">{feature}</span>
          </li>
         ))}
        </ul>
       </CardContent>
       
       <CardFooter className="pt-8 pb-8 px-8 mt-auto">
        <Button 
         className={`w-full text-base font-semibold py-6 rounded-2xl shadow-lg transition-all hover:scale-[1.02] border-none
           ${plan.popular 
             ? 'bg-primary hover:bg-primary/90 text-white' 
             : 'bg-white hover:bg-white/90 text-foreground border-white/20'
           }`}
         asChild
        >
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
