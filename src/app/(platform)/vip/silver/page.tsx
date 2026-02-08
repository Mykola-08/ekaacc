import React from 'react';
import { Metadata } from 'next';
import { Star, Shield, Users, TrendingUp, Award, Clock, Heart, Zap } from 'lucide-react';
import { ShimmerButton } from '@/components/platform/ui/shimmer-button';
import { Button } from '@/components/platform/ui/button';
import { AnimatedGradientText } from '@/components/platform/ui/animated-gradient-text';
import { NumberTicker } from '@/components/platform/ui/number-ticker';
import { BlurIn } from '@/components/platform/ui/blur-in';

export const metadata: Metadata = {
  title: 'VIP Silver Tier - Enhanced Therapy Experience',
  description:
    'Upgrade to VIP Silver tier for enhanced therapy features, priority support, and exclusive benefits.',
};

const benefits = [
  {
    icon: Star,
    title: '15 Sessions Monthly',
    description: 'Access up to 15 therapy sessions per month with our certified professionals',
    color: 'text-blue-500',
  },
  {
    icon: Shield,
    title: 'Priority Support',
    description:
      'Get priority customer support with faster response times and dedicated assistance',
    color: 'text-green-500',
  },
  {
    icon: Users,
    title: 'VIP Community',
    description: 'Join exclusive VIP community forums and connect with like-minded individuals',
    color: 'text-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'AI Insights',
    description: 'Access basic AI-powered insights and progress tracking tools',
    color: 'text-orange-500',
  },
  {
    icon: Award,
    title: 'Premium Themes',
    description: 'Unlock 10 premium themes to personalize your therapy experience',
    color: 'text-pink-500',
  },
  {
    icon: Clock,
    title: 'Early Access',
    description: 'Be the first to try new features and therapy programs before public release',
    color: 'text-indigo-500',
  },
];

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'VIP Silver Member',
    content: 'The priority support has been incredible. I get responses within hours, not days.',
    rating: 5,
  },
  {
    name: 'David L.',
    role: 'VIP Silver Member',
    content:
      'Having 15 sessions per month gives me the flexibility I need for my mental health journey.',
    rating: 5,
  },
  {
    name: 'Emma R.',
    role: 'VIP Silver Member',
    content:
      'The premium themes make the app feel so personal and inviting. Love the early access perks!',
    rating: 5,
  },
];

export default function VIPSilverPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-100 via-transparent to-slate-100 opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <BlurIn>
              <div className="mb-6 inline-flex items-center rounded-full bg-linear-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white">
                <Star className="mr-2 h-4 w-4" />
                VIP Silver Tier
              </div>
            </BlurIn>
            <BlurIn>
              <h1 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
                Elevate Your Therapy
                <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Experience
                </span>
              </h1>
            </BlurIn>
            <BlurIn>
              <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
                Unlock enhanced therapy features with VIP Silver tier. Get priority support,
                increased session limits, and exclusive access to premium tools and community.
              </p>
            </BlurIn>
            <BlurIn>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ShimmerButton className="px-8 py-4 text-lg">
                  Upgrade to Silver - €29.99/month
                </ShimmerButton>
                <Button
                  variant="outline"
                  className="border-2 border-blue-500 px-8 py-4 text-lg text-blue-600 hover:bg-blue-50"
                >
                  Compare All Tiers
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
              Silver Tier Benefits
            </AnimatedGradientText>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Everything you need to enhance your therapy journey with premium features and priority
              access
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="rounded-[20px] border border-gray-100 bg-linear-to-br from-white to-gray-50 p-6 shadow-lg transition-shadow hover:shadow-xl">
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
              <NumberTicker value={15} className="mb-2 text-4xl font-bold" />
              <p className="text-blue-100">Sessions Per Month</p>
            </div>
            <div>
              <NumberTicker value={10} className="mb-2 text-4xl font-bold" />
              <p className="text-blue-100">Premium Themes</p>
            </div>
            <div>
              <NumberTicker value={24} className="mb-2 text-4xl font-bold" />
              <p className="text-blue-100">Priority Support Hours</p>
            </div>
            <div>
              <NumberTicker value={1.5} className="mb-2 text-4xl font-bold" />
              <p className="text-blue-100">Loyalty Multiplier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              What Our Silver Members Say
            </AnimatedGradientText>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-card rounded-[20px] border border-gray-100 p-6 shadow-lg">
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
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
              Ready to Upgrade?
            </AnimatedGradientText>
            <p className="text-muted-foreground mb-8 text-xl">
              Join thousands of satisfied Silver members who have enhanced their therapy experience.
              Start your journey today with a 7-day free trial.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <ShimmerButton className="px-8 py-4 text-lg">Start Free Trial</ShimmerButton>
              <Button
                variant="outline"
                className="text-foreground/90 hover:bg-muted/30 border-2 border-gray-300 px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              No commitment • Cancel anytime • 7-day free trial
            </p>
          </BlurIn>
        </div>
      </section>
    </div>
  );
}
