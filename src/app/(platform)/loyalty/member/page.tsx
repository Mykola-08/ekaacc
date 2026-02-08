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
  description:
    'Join our free Loyalty Member program to earn points, get discounts, and access exclusive rewards.',
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
    name: 'Lisa M.',
    role: 'Loyalty Member',
    content:
      "The 5% discount adds up quickly! I've saved so much while taking care of my mental health.",
    rating: 5,
  },
  {
    name: 'Tom R.',
    role: 'Loyalty Member',
    content: 'Earning points for my sessions motivates me to stay consistent with my therapy.',
    rating: 5,
  },
  {
    name: 'Anna K.',
    role: 'Loyalty Member',
    content: 'The birthday bonus was such a thoughtful surprise! It made me feel truly valued.',
    rating: 5,
  },
];

export default function LoyaltyMemberPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-transparent to-purple-100 opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <BlurIn>
              <div className="mb-6 inline-flex items-center rounded-full bg-linear-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white">
                <Heart className="mr-2 h-4 w-4" />
                Free Loyalty Program
              </div>
            </BlurIn>
            <BlurIn>
              <h1 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
                Earn Rewards While
                <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  You Heal
                </span>
              </h1>
            </BlurIn>
            <BlurIn>
              <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
                Join our free Loyalty Member program and start earning points, discounts, and
                exclusive rewards for taking care of your mental health. It's our way of saying
                thank you for choosing us.
              </p>
            </BlurIn>
            <BlurIn>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ShimmerButton className="px-8 py-4 text-lg">Join Free - No Cost</ShimmerButton>
                <Button
                  variant="outline"
                  className="border-2 border-blue-500 px-8 py-4 text-lg text-blue-600 hover:bg-blue-50"
                >
                  Learn More
                </Button>
              </div>
            </BlurIn>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              How It Works
            </AnimatedGradientText>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Simple, transparent, and rewarding - get started in minutes
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white">
                    {step.step}
                  </div>
                  <div className="mb-4 text-blue-600">
                    <step.icon className="mx-auto h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </BlurIn>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              Member Benefits
            </AnimatedGradientText>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Enjoy exclusive perks designed to enhance your therapy experience
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-card rounded-2xl border border-gray-100 p-6 shadow-lg transition-shadow hover:shadow-xl">
                  <div className={`${benefit.color} mb-4`}>
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </BlurIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-linear-to-r from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center text-white md:grid-cols-4">
            <div>
              <NumberTicker value={1.5} className="mb-2 text-4xl font-bold" />
              <p className="text-blue-100">Points Multiplier</p>
            </div>
            <div>
              <NumberTicker value={5} className="mb-2 text-4xl font-bold" />
              <p className="text-blue-100">Discount Rate</p>
            </div>
            <div>
              <NumberTicker value={2} className="mb-2 text-4xl font-bold" />
              <p className="text-blue-100">Premium Themes</p>
            </div>
            <div>
              <NumberTicker value={0} className="mb-2 text-4xl font-bold" prefix="€" />
              <p className="text-blue-100">Cost to Join</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              What Our Members Say
            </AnimatedGradientText>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-muted/30 rounded-2xl border border-gray-100 p-6 shadow-lg">
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Heart key={i} className="h-5 w-5 fill-current text-red-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-foreground font-semibold">{testimonial.name}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </BlurIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-blue-600 to-purple-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <BlurIn>
            <AnimatedGradientText className="mb-6 text-3xl font-bold text-white">
              Ready to Start Earning Rewards?
            </AnimatedGradientText>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of satisfied members who are already earning points and saving money
              while taking care of their mental health. It's completely free!
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <ShimmerButton className="bg-card hover:bg-muted px-8 py-4 text-lg text-blue-600">
                Join Now - It's Free
              </ShimmerButton>
              <Button
                variant="outline"
                className="hover:bg-card border-2 border-white px-8 py-4 text-lg text-white hover:text-blue-600"
              >
                View Full Benefits
              </Button>
            </div>
            <p className="mt-4 text-sm text-blue-100">
              No commitment • Cancel anytime • Free forever
            </p>
          </BlurIn>
        </div>
      </section>
    </div>
  );
}
