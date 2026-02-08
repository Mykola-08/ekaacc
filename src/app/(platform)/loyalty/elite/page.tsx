import React from 'react';
import { Metadata } from 'next';
import {
  Gem,
  Gift,
  Crown,
  Sparkles,
  Target,
  Shield,
  Users,
  Award,
  Calendar,
  Zap,
  MessageCircle,
  TrendingUp,
} from 'lucide-react';
import { ShimmerButton } from '@/components/platform/ui/shimmer-button';
import { Button } from '@/components/platform/ui/button';
import { AnimatedGradientText } from '@/components/platform/ui/animated-gradient-text';
import { NumberTicker } from '@/components/platform/ui/number-ticker';
import { BlurIn } from '@/components/platform/ui/blur-in';

export const metadata: Metadata = {
  title: 'Loyalty Elite - Premium Rewards & Exclusive Benefits',
  description:
    'Upgrade to Loyalty Elite for enhanced rewards, exclusive events, and premium benefits.',
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
    description:
      'Get exclusive invitations to Elite-only events, workshops, and networking sessions',
    color: 'text-purple-500',
  },
  {
    icon: Sparkles,
    title: 'Enhanced Birthday Bonus',
    description:
      'Receive premium birthday bonuses and anniversary rewards as our valued Elite member',
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
    color: 'text-blue-500',
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
    name: 'Maria S.',
    role: 'Loyalty Elite Member',
    content:
      'The 15% discount has saved me hundreds of euros! The Elite events are incredibly valuable.',
    rating: 5,
  },
  {
    name: 'James W.',
    role: 'Loyalty Elite Member',
    content:
      'The 3x points multiplier adds up so fast! I love the exclusive Elite community access.',
    rating: 5,
  },
  {
    name: 'Sophie L.',
    role: 'Loyalty Elite Member',
    content:
      'The Elite events and workshops have been transformative. Worth every penny for the premium experience!',
    rating: 5,
  },
];

export default function LoyaltyElitePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-red-100 via-orange-100 to-pink-100 opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <BlurIn>
              <div className="mb-6 inline-flex items-center rounded-full bg-linear-to-r from-red-500 to-orange-500 px-6 py-3 text-lg font-semibold text-white shadow-lg">
                <Gem className="mr-2 h-5 w-5" />
                Loyalty Elite
              </div>
            </BlurIn>
            <BlurIn>
              <h1 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
                Premium Rewards
                <span className="block bg-linear-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                  & Exclusive Benefits
                </span>
              </h1>
            </BlurIn>
            <BlurIn>
              <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
                Elevate your loyalty experience with enhanced rewards, exclusive events, and premium
                benefits. Designed for our most valued members who deserve the very best.
              </p>
            </BlurIn>
            <BlurIn>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ShimmerButton className="bg-linear-to-r from-red-500 to-orange-500 px-8 py-4 text-lg">
                  Upgrade to Elite - €14.99/month
                </ShimmerButton>
                <Button
                  variant="outline"
                  className="border-2 border-red-500 px-8 py-4 text-lg text-red-600 hover:bg-red-50"
                >
                  Compare Tiers
                </Button>
              </div>
            </BlurIn>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              Elite Premium Benefits
            </AnimatedGradientText>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Enhanced rewards, exclusive access, and premium features designed for our most valued
              members
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="h-full rounded-2xl border border-red-100 bg-linear-to-br from-white to-red-50 p-6 shadow-lg transition-shadow hover:shadow-xl">
                  <div className={`${benefit.color} mb-4`}>
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </div>
              </BlurIn>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Features */}
      <section className="bg-linear-to-br from-red-100 to-orange-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              Elite-Exclusive Features
            </AnimatedGradientText>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {exclusiveFeatures.map((feature, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-card rounded-2xl border border-orange-200 p-6 text-center shadow-lg">
                  <div className="mb-4 text-orange-600">
                    <feature.icon className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </BlurIn>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-linear-to-r from-red-600 via-orange-600 to-pink-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center text-white md:grid-cols-4">
            <div>
              <NumberTicker value={3} className="mb-2 text-4xl font-bold" />
              <p className="text-red-100">Points Multiplier</p>
            </div>
            <div>
              <NumberTicker value={15} className="mb-2 text-4xl font-bold" />
              <p className="text-red-100">Discount Rate</p>
            </div>
            <div>
              <NumberTicker value={25} className="mb-2 text-4xl font-bold" prefix="€" />
              <p className="text-red-100">Referral Bonus</p>
            </div>
            <div>
              <NumberTicker value={15} className="mb-2 text-4xl font-bold" />
              <p className="text-red-100">Premium Themes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-linear-to-br from-red-50 to-orange-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              Elite Member Experiences
            </AnimatedGradientText>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-card rounded-2xl border border-orange-100 p-6 shadow-lg">
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Gem key={i} className="h-5 w-5 fill-current text-red-400" />
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
      <section className="bg-card py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <BlurIn>
            <AnimatedGradientText className="mb-6 text-3xl font-bold">
              Ready to Go Elite?
            </AnimatedGradientText>
            <p className="text-muted-foreground mb-8 text-xl">
              Join our most exclusive loyalty tier and experience premium rewards, exclusive events,
              and enhanced benefits designed for our most valued members.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <ShimmerButton className="bg-linear-to-r from-red-500 to-orange-500 px-8 py-4 text-lg">
                Upgrade to Elite Now
              </ShimmerButton>
              <Button
                variant="outline"
                className="border-2 border-red-500 px-8 py-4 text-lg text-red-600 hover:bg-red-50"
              >
                View Elite Events Calendar
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              14-day Elite trial • Upgrade from Member anytime • Exclusive benefits
            </p>
          </BlurIn>
        </div>
      </section>
    </div>
  );
}
