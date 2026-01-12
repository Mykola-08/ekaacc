import React from 'react';
import { Metadata } from 'next';
import { Gem, Gift, Crown, Sparkles, Target, Shield, Users, Award, Calendar, Zap, MessageCircle, TrendingUp } from 'lucide-react';
import { ShimmerButton } from '@/components/platform/ui/shimmer-button';
import { Button } from '@/components/platform/ui/button';
import { AnimatedGradientText } from '@/components/platform/ui/animated-gradient-text';
import { NumberTicker } from '@/components/platform/ui/number-ticker';
import { BlurIn } from '@/components/platform/ui/blur-in';

export const metadata: Metadata = {
 title: 'Loyalty Elite - Premium Rewards & Exclusive Benefits',
 description: 'Upgrade to Loyalty Elite for enhanced rewards, exclusive events, and premium benefits.',
};

const benefits = [
 {
  icon: Gem,
  title: '3x Points Multiplier',
  description: 'Earn 3x loyalty points on every purchase - triple the rewards for your loyalty',
  color: 'text-red-500',
 },
 {
  icon: Gift,
  title: '15% Discount',
  description: 'Enjoy a generous 15% discount on all services, sessions, and premium features',
  color: 'text-orange-500',
 },
 {
  icon: Crown,
  title: 'Elite Events',
  description: 'Get exclusive invitations to Elite-only events, workshops, and networking sessions',
  color: 'text-purple-500',
 },
 {
  icon: Sparkles,
  title: 'Enhanced Birthday Bonus',
  description: 'Receive premium birthday bonuses and anniversary rewards as our valued Elite member',
  color: 'text-pink-500',
 },
 {
  icon: Target,
  title: 'Milestone Rewards',
  description: 'Unlock premium milestone rewards and achievement bonuses as you progress',
  color: 'text-blue-500',
 },
 {
  icon: Shield,
  title: 'Priority Support',
  description: 'Get priority customer support with dedicated Elite support specialists',
  color: 'text-green-500',
 },
 {
  icon: Users,
  title: 'Elite Community',
  description: 'Access to exclusive Elite-only community forums and premium support groups',
  color: 'text-indigo-500',
 },
 {
  icon: Award,
  title: 'Premium Content',
  description: 'Get access to Elite-exclusive content, resources, and expert-led sessions',
  color: 'text-teal-500',
 },
];

const exclusiveFeatures = [
 {
  icon: Calendar,
  title: 'Elite Events Calendar',
  description: 'Access to exclusive workshops, webinars, and networking events',
 },
 {
  icon: Zap,
  title: 'Premium Referral Bonus',
  description: 'Enhanced referral rewards - earn more when you invite friends',
 },
 {
  icon: TrendingUp,
  title: 'Advanced Analytics',
  description: 'Detailed insights into your points, savings, and loyalty progress',
 },
];

const testimonials = [
 {
  name: "Maria S.",
  role: "Loyalty Elite Member",
  content: "The 15% discount has saved me hundreds of euros! The Elite events are incredibly valuable.",
  rating: 5,
 },
 {
  name: "James W.",
  role: "Loyalty Elite Member",
  content: "The 3x points multiplier adds up so fast! I love the exclusive Elite community access.",
  rating: 5,
 },
 {
  name: "Sophie L.",
  role: "Loyalty Elite Member",
  content: "The Elite events and workshops have been transformative. Worth every penny for the premium experience!",
  rating: 5,
 },
];

export default function LoyaltyElitePage() {
 return (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
   {/* Hero Section */}
   <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-red-100 via-orange-100 to-pink-100 opacity-50"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
     <div className="text-center">
      <BlurIn>
       <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full text-white text-lg font-semibold mb-6 shadow-lg">
        <Gem className="w-5 h-5 mr-2" />
        Loyalty Elite
       </div>
      </BlurIn>
      <BlurIn>
       <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Premium Rewards
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
         & Exclusive Benefits
        </span>
       </h1>
      </BlurIn>
      <BlurIn>
       <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Elevate your loyalty experience with enhanced rewards, exclusive events, and premium benefits. 
        Designed for our most valued members who deserve the very best.
       </p>
      </BlurIn>
      <BlurIn>
       <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <ShimmerButton className="px-8 py-4 text-lg bg-gradient-to-r from-red-500 to-orange-500">
         Upgrade to Elite - €14.99/month
        </ShimmerButton>
        <Button variant="outline" className="px-8 py-4 text-lg border-2 border-red-500 text-red-600 hover:bg-red-50">
         Compare Tiers
        </Button>
       </div>
      </BlurIn>
     </div>
    </div>
   </section>

   {/* Key Benefits */}
   <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       Elite Premium Benefits
      </AnimatedGradientText>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
       Enhanced rewards, exclusive access, and premium features designed for our most valued members
      </p>
     </div>
     <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {benefits.map((benefit, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="bg-gradient-to-br from-white to-red-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-red-100 h-full">
         <div className={`${benefit.color} mb-4`}>
          <benefit.icon className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {benefit.title}
         </h3>
         <p className="text-gray-600 text-sm">
          {benefit.description}
         </p>
        </div>
       </BlurIn>
      ))}
     </div>
    </div>
   </section>

   {/* Exclusive Features */}
   <section className="py-16 bg-gradient-to-br from-red-100 to-orange-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       Elite-Exclusive Features
      </AnimatedGradientText>
     </div>
     <div className="grid md:grid-cols-3 gap-8">
      {exclusiveFeatures.map((feature, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-200 text-center">
         <div className="text-orange-600 mb-4">
          <feature.icon className="w-12 h-12 mx-auto" />
         </div>
         <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {feature.title}
         </h3>
         <p className="text-gray-600">
          {feature.description}
         </p>
        </div>
       </BlurIn>
      ))}
     </div>
    </div>
   </section>

   {/* Stats Section */}
   <section className="py-16 bg-gradient-to-r from-red-600 via-orange-600 to-pink-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="grid md:grid-cols-4 gap-8 text-center text-white">
      <div>
       <NumberTicker value={3} className="text-4xl font-bold mb-2" />
       <p className="text-red-100">Points Multiplier</p>
      </div>
      <div>
       <NumberTicker value={15} className="text-4xl font-bold mb-2" />
       <p className="text-red-100">Discount Rate</p>
      </div>
      <div>
       <NumberTicker value={25} className="text-4xl font-bold mb-2" prefix="€" />
       <p className="text-red-100">Referral Bonus</p>
      </div>
      <div>
       <NumberTicker value={15} className="text-4xl font-bold mb-2" />
       <p className="text-red-100">Premium Themes</p>
      </div>
     </div>
    </div>
   </section>

   {/* Testimonials */}
   <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       Elite Member Experiences
      </AnimatedGradientText>
     </div>
     <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100">
         <div className="flex mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
           <Gem key={i} className="w-5 h-5 text-red-400 fill-current" />
          ))}
         </div>
         <p className="text-gray-600 mb-4 italic">
          "{testimonial.content}"
         </p>
         <div>
          <p className="font-semibold text-gray-900">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
         </div>
        </div>
       </BlurIn>
      ))}
     </div>
    </div>
   </section>

   {/* CTA Section */}
   <section className="py-16 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
     <BlurIn>
      <AnimatedGradientText className="text-3xl font-bold mb-6">
       Ready to Go Elite?
      </AnimatedGradientText>
      <p className="text-xl text-gray-600 mb-8">
       Join our most exclusive loyalty tier and experience premium rewards, exclusive events, 
       and enhanced benefits designed for our most valued members.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
       <ShimmerButton className="px-8 py-4 text-lg bg-gradient-to-r from-red-500 to-orange-500">
        Upgrade to Elite Now
       </ShimmerButton>
       <Button variant="outline" className="px-8 py-4 text-lg border-2 border-red-500 text-red-600 hover:bg-red-50">
        View Elite Events Calendar
       </Button>
      </div>
      <p className="text-sm text-gray-500 mt-4">
       14-day Elite trial • Upgrade from Member anytime • Exclusive benefits
      </p>
     </BlurIn>
    </div>
   </section>
  </div>
 );
}