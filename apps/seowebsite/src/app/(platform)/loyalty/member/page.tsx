import React from 'react';
import { Metadata } from 'next';
import { Heart, Gift, Star, TrendingUp, Users, Calendar, Award, Zap } from 'lucide-react';
import { ShimmerButton } from '@/components/platform/ui/shimmer-button';
import { Button } from '@/components/platform/ui/button';
import { AnimatedGradientText } from '@/components/platform/ui/animated-gradient-text';
import { NumberTicker } from '@/components/platform/ui/number-ticker';
import { BlurIn } from '@/components/platform/ui/blur-in';

export const metadata: Metadata = {
 title: 'Loyalty Member - Earn Points & Rewards',
 description: 'Join our free Loyalty Member program to earn points, get discounts, and access exclusive rewards.',
};

const benefits = [
 {
  icon: Heart,
  title: 'Earn Points',
  description: 'Earn 1.5x loyalty points on every purchase and interaction within our platform',
  color: 'text-red-500',
 },
 {
  icon: Gift,
  title: '5% Discount',
  description: 'Enjoy a 5% discount on all services, sessions, and premium features',
  color: 'text-green-500',
 },
 {
  icon: Star,
  title: 'Birthday Bonus',
  description: 'Receive special birthday bonuses and anniversary rewards as our valued member',
  color: 'text-yellow-500',
 },
 {
  icon: TrendingUp,
  title: 'Milestone Rewards',
  description: 'Unlock exclusive rewards as you reach important milestones in your journey',
  color: 'text-blue-500',
 },
 {
  icon: Users,
  title: 'Member Community',
  description: 'Access to member-only community forums and support groups',
  color: 'text-purple-500',
 },
 {
  icon: Calendar,
  title: 'Exclusive Content',
  description: 'Get access to member-exclusive content, articles, and resources',
  color: 'text-pink-500',
 },
];

const howItWorks = [
 {
  step: 1,
  title: 'Join Free',
  description: 'Sign up for our free Loyalty Member program with no commitment',
  icon: Heart,
 },
 {
  step: 2,
  title: 'Earn Points',
  description: 'Automatically earn points for every session, purchase, and interaction',
  icon: TrendingUp,
 },
 {
  step: 3,
  title: 'Unlock Rewards',
  description: 'Redeem your points for discounts, free sessions, and exclusive perks',
  icon: Gift,
 },
];

const testimonials = [
 {
  name: "Lisa M.",
  role: "Loyalty Member",
  content: "The 5% discount adds up quickly! I've saved so much while taking care of my mental health.",
  rating: 5,
 },
 {
  name: "Tom R.",
  role: "Loyalty Member",
  content: "Earning points for my sessions motivates me to stay consistent with my therapy.",
  rating: 5,
 },
 {
  name: "Anna K.",
  role: "Loyalty Member",
  content: "The birthday bonus was such a thoughtful surprise! It made me feel truly valued.",
  rating: 5,
 },
];

export default function LoyaltyMemberPage() {
 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
   {/* Hero Section */}
   <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-transparent to-purple-100 opacity-50"></div>
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
     <div className="text-center">
      <BlurIn>
       <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6">
        <Heart className="w-4 h-4 mr-2" />
        Free Loyalty Program
       </div>
      </BlurIn>
      <BlurIn>
       <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Earn Rewards While
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
         You Heal
        </span>
       </h1>
      </BlurIn>
      <BlurIn>
       <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Join our free Loyalty Member program and start earning points, discounts, and exclusive rewards 
        for taking care of your mental health. It's our way of saying thank you for choosing us.
       </p>
      </BlurIn>
      <BlurIn>
       <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <ShimmerButton className="px-8 py-4 text-lg">
         Join Free - No Cost
        </ShimmerButton>
        <Button variant="outline" className="px-8 py-4 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
         Learn More
        </Button>
       </div>
      </BlurIn>
     </div>
    </div>
   </section>

   {/* How It Works */}
   <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       How It Works
      </AnimatedGradientText>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
       Simple, transparent, and rewarding - get started in minutes
      </p>
     </div>
     <div className="grid md:grid-cols-3 gap-8">
      {howItWorks.map((step, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="text-center">
         <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
          {step.step}
         </div>
         <div className="text-blue-600 mb-4">
          <step.icon className="w-8 h-8 mx-auto" />
         </div>
         <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {step.title}
         </h3>
         <p className="text-gray-600">
          {step.description}
         </p>
        </div>
       </BlurIn>
      ))}
     </div>
    </div>
   </section>

   {/* Key Benefits */}
   <section className="py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       Member Benefits
      </AnimatedGradientText>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
       Enjoy exclusive perks designed to enhance your therapy experience
      </p>
     </div>
     <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {benefits.map((benefit, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
         <div className={`${benefit.color} mb-4`}>
          <benefit.icon className="w-8 h-8" />
         </div>
         <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {benefit.title}
         </h3>
         <p className="text-gray-600">
          {benefit.description}
         </p>
        </div>
       </BlurIn>
      ))}
     </div>
    </div>
   </section>

   {/* Stats Section */}
   <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="grid md:grid-cols-4 gap-8 text-center text-white">
      <div>
       <NumberTicker value={1.5} className="text-4xl font-bold mb-2" />
       <p className="text-blue-100">Points Multiplier</p>
      </div>
      <div>
       <NumberTicker value={5} className="text-4xl font-bold mb-2" />
       <p className="text-blue-100">Discount Rate</p>
      </div>
      <div>
       <NumberTicker value={2} className="text-4xl font-bold mb-2" />
       <p className="text-blue-100">Premium Themes</p>
      </div>
      <div>
       <NumberTicker value={0} className="text-4xl font-bold mb-2" prefix="€" />
       <p className="text-blue-100">Cost to Join</p>
      </div>
     </div>
    </div>
   </section>

   {/* Testimonials */}
   <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <AnimatedGradientText className="text-3xl font-bold mb-4">
       What Our Members Say
      </AnimatedGradientText>
     </div>
     <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
       <BlurIn key={index} delay={index * 0.1}>
        <div className="bg-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100">
         <div className="flex mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
           <Heart key={i} className="w-5 h-5 text-red-400 fill-current" />
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
   <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
     <BlurIn>
      <AnimatedGradientText className="text-3xl font-bold mb-6 text-white">
       Ready to Start Earning Rewards?
      </AnimatedGradientText>
      <p className="text-xl text-blue-100 mb-8">
       Join thousands of satisfied members who are already earning points and saving money 
       while taking care of their mental health. It's completely free!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
       <ShimmerButton className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100">
        Join Now - It's Free
       </ShimmerButton>
       <Button variant="outline" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-blue-600">
        View Full Benefits
       </Button>
      </div>
      <p className="text-sm text-blue-100 mt-4">
       No commitment • Cancel anytime • Free forever
      </p>
     </BlurIn>
    </div>
   </section>
  </div>
 );
}