import React from 'react';
import { Metadata } from 'next';
import { Crown, Shield, Users, TrendingUp, Award, Clock, Heart, Zap, Sparkles, Target } from 'lucide-react';
import { ShimmerButton } from '@/components/platform/ui/shimmer-button';
import { Button } from '@/components/platform/ui/button';
import { AnimatedGradientText } from '@/components/platform/ui/animated-gradient-text';
import { NumberTicker } from '@/components/platform/ui/number-ticker';
import { BlurIn } from '@/components/platform/ui/blur-in';

export const metadata: Metadata = {
 title: 'VIP Gold Tier - Premium Therapy Experience',
 description: 'Experience premium therapy with unlimited sessions, personal therapist, and exclusive Gold benefits.',
};

const benefits = [
 {
  icon: Crown,
  title: 'Unlimited Sessions',
  description: 'Enjoy unlimited therapy sessions with our certified professionals - no limits, just healing',
  color: 'text-yellow-500',
 },
 {
  icon: Shield,
  title: 'Personal Therapist',
  description: 'Get matched with a dedicated personal therapist who understands your unique journey',
  color: 'text-blue-500',
 },
 {
  icon: Users,
  title: 'Group Sessions',
  description: 'Access exclusive group therapy sessions and community support groups',
  color: 'text-purple-500',
 },
 {
  icon: TrendingUp,
  title: 'Advanced AI Insights',
  description: 'Receive advanced AI-powered insights and comprehensive progress reports',
  color: 'text-green-500',
 },
 {
  icon: Award,
  title: 'All Themes Unlocked',
  description: 'Access our complete library of premium and custom themes for personalization',
  color: 'text-pink-500',
 },
 {
  icon: Sparkles,
  title: 'Exclusive Events',
  description: 'Get invitations to VIP-only events, workshops, and expert-led sessions',
  color: 'text-indigo-500',
 },
 {
  icon: Target,
  title: 'Custom Branding',
  description: 'Personalize your experience with custom branding and white-label options',
  color: 'text-red-500',
 },
 {
  icon: Clock,
  title: 'Priority Everything',
  description: 'Get priority booking, priority support, and priority access to new features',
  color: 'text-orange-500',
 },
];

const testimonials = [
 {
  name: "Michael K.",
  role: "VIP Gold Member",
  content: "Having my own personal therapist has transformed my mental health journey. The unlimited sessions give me the flexibility I need.",
  rating: 5,
 },
 {
  name: "Jennifer T.",
  role: "VIP Gold Member",
  content: "The advanced AI insights have helped me understand my patterns and progress in ways I never thought possible.",
  rating: 5,
 },
 {
  name: "Robert H.",
  role: "VIP Gold Member",
  content: "The exclusive events and community access make me feel truly valued as a member. Worth every penny!",
  rating: 5,
 },
];

export default function VIPGoldPage() {
 return (
  <div className="min-h-screen bg-linear-to-br from-yellow-50 via-orange-50 to-red-50">
   {/* Hero Section */}
   <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-linear-to-br from-yellow-100 via-orange-100 to-red-100 opacity-50"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
     <div className="text-center">
      <BlurIn>
       <div className="inline-flex items-center px-6 py-3 bg-linear-to-r from-yellow-400 to-orange-500 rounded-full text-white text-lg font-semibold mb-6 shadow-lg">
        <Crown className="w-5 h-5 mr-2" />
        VIP Gold Tier
       </div>
      </BlurIn>
      <BlurIn>
       <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
        Premium Therapy
        <span className="block text-transparent bg-clip-text bg-linear-to-r from-yellow-500 to-orange-600">
         Excellence
        </span>
       </h1>
      </BlurIn>
      <BlurIn>
       <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Experience the pinnacle of therapy with unlimited sessions, personal therapist, 
        advanced AI insights, and exclusive Gold-tier benefits designed for your success.
       </p>
      </BlurIn>
      <BlurIn>
       <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <ShimmerButton className="px-8 py-4 text-lg bg-linear-to-r from-yellow-400 to-orange-500">
         Upgrade to Gold - €79.99/month
        </ShimmerButton>
        <Button variant="outline" className="px-8 py-4 text-lg border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50">
         Compare All Tiers
        </Button>
       </div>
      </BlurIn>
     </div>
    </div>
   </section>

   {/* Key Benefits */}
   <section className="py-16 bg-card">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       Gold Tier Excellence
      </AnimatedGradientText>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
       Unmatched therapy experience with unlimited access, personal care, and premium features
      </p>
     </div>
     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {benefits.map((benefit, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="bg-linear-to-br from-white to-yellow-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-yellow-100 h-full">
         <div className={`${benefit.color} mb-4`}>
          <benefit.icon className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-semibold text-foreground mb-3">
          {benefit.title}
         </h3>
         <p className="text-muted-foreground text-sm">
          {benefit.description}
         </p>
        </div>
       </BlurIn>
      ))}
     </div>
    </div>
   </section>

   {/* Stats Section */}
   <section className="py-16 bg-linear-to-r from-yellow-500 via-orange-500 to-red-500">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="grid md:grid-cols-4 gap-8 text-center text-white">
      <div>
       <NumberTicker value={999} className="text-4xl font-bold mb-2" />
       <p className="text-yellow-100">Unlimited Sessions</p>
      </div>
      <div>
       <NumberTicker value={100} className="text-4xl font-bold mb-2" />
       <p className="text-yellow-100">Premium Themes</p>
      </div>
      <div>
       <NumberTicker value={2} className="text-4xl font-bold mb-2" />
       <p className="text-yellow-100">Loyalty Multiplier</p>
      </div>
      <div>
       <NumberTicker value={10} className="text-4xl font-bold mb-2" />
       <p className="text-yellow-100">Group Sessions/Month</p>
      </div>
     </div>
    </div>
   </section>

   {/* Testimonials */}
   <section className="py-16 bg-linear-to-br from-yellow-50 to-orange-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       Gold Member Experiences
      </AnimatedGradientText>
     </div>
     <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="bg-card p-6 rounded-2xl shadow-lg border border-yellow-100">
         <div className="flex mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
           <Crown key={i} className="w-5 h-5 text-yellow-400 fill-current" />
          ))}
         </div>
         <p className="text-muted-foreground mb-4 italic">
          "{testimonial.content}"
         </p>
         <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
         </div>
        </div>
       </BlurIn>
      ))}
     </div>
    </div>
   </section>

   {/* CTA Section */}
   <section className="py-16 bg-card">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
     <BlurIn>
      <AnimatedGradientText className="text-3xl font-bold mb-6">
       Experience Gold Excellence
      </AnimatedGradientText>
      <p className="text-xl text-muted-foreground mb-8">
       Join our most successful members who have transformed their mental health journey 
       with unlimited access and personal care. Start your Gold experience today.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
       <ShimmerButton className="px-8 py-4 text-lg bg-linear-to-r from-yellow-400 to-orange-500">
        Start Gold Experience
       </ShimmerButton>
       <Button variant="outline" className="px-8 py-4 text-lg border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50">
        Schedule Consultation
       </Button>
      </div>
      <p className="text-sm text-muted-foreground mt-4">
       14-day satisfaction guarantee • Upgrade from Silver anytime • No commitment
      </p>
     </BlurIn>
    </div>
   </section>
  </div>
 );
}
