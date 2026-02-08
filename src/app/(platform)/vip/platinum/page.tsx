import React from 'react';
import { Metadata } from 'next';
import {
  Crown,
  Shield,
  Users,
  TrendingUp,
  Award,
  Clock,
  Heart,
  Zap,
  Sparkles,
  Target,
  Gem,
  Wifi,
  Briefcase,
} from 'lucide-react';
import { ShimmerButton } from '@/components/platform/ui/shimmer-button';
import { Button } from '@/components/platform/ui/button';
import { AnimatedGradientText } from '@/components/platform/ui/animated-gradient-text';
import { NumberTicker } from '@/components/platform/ui/number-ticker';
import { BlurIn } from '@/components/platform/ui/blur-in';

export const metadata: Metadata = {
  title: 'VIP Platinum Tier - Elite Therapy Experience',
  description:
    'Experience the pinnacle of therapy with VIP Platinum - unlimited everything, white-label solutions, and elite concierge service.',
};

const benefits = [
  {
    icon: Crown,
    title: 'Unlimited Everything',
    description:
      'Unlimited therapy sessions, group sessions, reports, and storage - no restrictions, pure healing',
    color: 'text-purple-500',
  },
  {
    icon: Shield,
    title: 'Personal Therapist Team',
    description:
      'Dedicated team of therapists working together on your personalized treatment plan',
    color: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Elite Community',
    description:
      'Access to exclusive Platinum-only events, workshops, and networking opportunities',
    color: 'text-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Custom AI Insights',
    description:
      'Advanced AI analytics with custom reports tailored to your specific needs and goals',
    color: 'text-green-500',
  },
  {
    icon: Award,
    title: 'Complete Theme Access',
    description:
      'Full access to all premium, custom, and exclusive themes plus white-label options',
    color: 'text-yellow-500',
  },
  {
    icon: Sparkles,
    title: 'White-Label Solutions',
    description: 'Custom branding and white-label solutions for organizations and practitioners',
    color: 'text-indigo-500',
  },
  {
    icon: Target,
    title: 'API Access',
    description: 'Full API access for integrations with your existing systems and workflows',
    color: 'text-red-500',
  },
  {
    icon: Gem,
    title: 'Concierge Service',
    description: 'Dedicated account manager and concierge service for all your needs',
    color: 'text-blue-500',
  },
];

const exclusiveFeatures = [
  {
    icon: Wifi,
    title: 'Priority Infrastructure',
    description: 'Access to premium servers and priority bandwidth for uninterrupted sessions',
  },
  {
    icon: Briefcase,
    title: 'Business Solutions',
    description: 'Enterprise-level features for organizations and mental health professionals',
  },
  {
    icon: Clock,
    title: '24/7 Priority Support',
    description: 'Round-the-clock dedicated support team with instant response times',
  },
];

const testimonials = [
  {
    name: 'Dr. Amanda Richardson',
    role: 'VIP Platinum Member',
    content:
      'As a healthcare professional, the white-label solutions and API access have been game-changing for my practice.',
    rating: 5,
  },
  {
    name: 'James Mitchell',
    role: 'VIP Platinum Member',
    content:
      'The personal therapist team approach has accelerated my progress beyond my expectations. Truly elite service.',
    rating: 5,
  },
  {
    name: 'Sophie Laurent',
    role: 'VIP Platinum Member',
    content:
      'The exclusive events and networking opportunities have connected me with incredible people on similar journeys.',
    rating: 5,
  },
];

export default function VIPPlatinumPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-purple-100 via-pink-100 to-indigo-100 opacity-50"></div>
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <BlurIn>
              <div className="mb-6 inline-flex items-center rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-lg font-semibold text-white shadow-lg">
                <Crown className="mr-2 h-5 w-5" />
                VIP Platinum Tier
              </div>
            </BlurIn>
            <BlurIn>
              <h1 className="text-foreground mb-6 text-4xl font-bold md:text-6xl">
                Elite Therapy
                <span className="block bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Excellence
                </span>
              </h1>
            </BlurIn>
            <BlurIn>
              <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl">
                Experience the absolute pinnacle of therapy with unlimited access, personal
                therapist teams, white-label solutions, and elite concierge service. Reserved for
                those who demand the best.
              </p>
            </BlurIn>
            <BlurIn>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <ShimmerButton className="bg-linear-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg">
                  Request Platinum Access - €149.99/month
                </ShimmerButton>
                <Button
                  variant="outline"
                  className="border-2 border-purple-500 px-8 py-4 text-lg text-purple-600 hover:bg-purple-50"
                >
                  Schedule Elite Consultation
                </Button>
              </div>
            </BlurIn>
            <BlurIn>
              <p className="text-muted-foreground mt-4 text-sm">
                Invitation-only tier • Application required • Premium onboarding
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="bg-card py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              Platinum Elite Benefits
            </AnimatedGradientText>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              Unprecedented access, unlimited resources, and elite-level service designed for
              ultimate success
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="h-full rounded-[20px] border border-purple-100 bg-linear-to-br from-white to-purple-50 p-6 shadow-lg transition-shadow hover:shadow-xl">
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
      <section className="bg-linear-to-br from-purple-100 to-pink-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              Platinum-Exclusive Features
            </AnimatedGradientText>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {exclusiveFeatures.map((feature, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-card rounded-[20px] border border-purple-200 p-6 text-center shadow-lg">
                  <div className="mb-4 text-purple-600">
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
      <section className="bg-linear-to-r from-purple-600 via-pink-600 to-indigo-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center text-white md:grid-cols-4">
            <div>
              <NumberTicker value={999} className="mb-2 text-4xl font-bold" />
              <p className="text-purple-100">Unlimited Sessions</p>
            </div>
            <div>
              <NumberTicker value={200} className="mb-2 text-4xl font-bold" />
              <p className="text-purple-100">GB Storage</p>
            </div>
            <div>
              <NumberTicker value={2.5} className="mb-2 text-4xl font-bold" />
              <p className="text-purple-100">Loyalty Multiplier</p>
            </div>
            <div>
              <NumberTicker value={24} className="mb-2 text-4xl font-bold" />
              <p className="text-purple-100">Priority Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-linear-to-br from-purple-50 to-pink-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <AnimatedGradientText className="mb-4 text-3xl font-bold">
              Elite Member Testimonials
            </AnimatedGradientText>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-card rounded-2xl border border-purple-100 p-6 shadow-lg">
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Crown key={i} className="h-5 w-5 fill-current text-purple-400" />
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
              Ready for Elite Status?
            </AnimatedGradientText>
            <p className="text-muted-foreground mb-8 text-xl">
              Join the most exclusive therapy experience available. Our Platinum tier is reserved
              for those who demand unlimited access, elite service, and transformative results.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <ShimmerButton className="bg-linear-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg">
                Apply for Platinum Access
              </ShimmerButton>
              <Button
                variant="outline"
                className="border-2 border-purple-500 px-8 py-4 text-lg text-purple-600 hover:bg-purple-50"
              >
                Elite Consultation Call
              </Button>
            </div>
            <p className="text-muted-foreground mt-4 text-sm">
              Application review within 24 hours • Premium onboarding • Exclusive benefits
            </p>
          </BlurIn>
        </div>
      </section>
    </div>
  );
}
