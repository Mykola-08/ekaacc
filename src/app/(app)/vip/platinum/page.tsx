import React from 'react';
import { Metadata } from 'next';
import { Crown, Shield, Users, TrendingUp, Award, Clock, Heart, Zap, Sparkles, Target, Gem, Wifi, Briefcase } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { NumberTicker } from '@/components/ui/number-ticker';
import { BlurIn } from '@/components/ui/blur-in';

export const metadata: Metadata = {
  title: 'VIP Platinum Tier - Elite Therapy Experience',
  description: 'Experience the pinnacle of therapy with VIP Platinum - unlimited everything, white-label solutions, and elite concierge service.',
};

const benefits = [
  {
    icon: Crown,
    title: 'Unlimited Everything',
    description: 'Unlimited therapy sessions, group sessions, reports, and storage - no restrictions, pure healing',
    color: 'text-purple-500',
  },
  {
    icon: Shield,
    title: 'Personal Therapist Team',
    description: 'Dedicated team of therapists working together on your personalized treatment plan',
    color: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Elite Community',
    description: 'Access to exclusive Platinum-only events, workshops, and networking opportunities',
    color: 'text-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Custom AI Insights',
    description: 'Advanced AI analytics with custom reports tailored to your specific needs and goals',
    color: 'text-green-500',
  },
  {
    icon: Award,
    title: 'Complete Theme Access',
    description: 'Full access to all premium, custom, and exclusive themes plus white-label options',
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
    color: 'text-teal-500',
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
    name: "Dr. Amanda Richardson",
    role: "VIP Platinum Member",
    content: "As a healthcare professional, the white-label solutions and API access have been game-changing for my practice.",
    rating: 5,
  },
  {
    name: "James Mitchell",
    role: "VIP Platinum Member",
    content: "The personal therapist team approach has accelerated my progress beyond my expectations. Truly elite service.",
    rating: 5,
  },
  {
    name: "Sophie Laurent",
    role: "VIP Platinum Member",
    content: "The exclusive events and networking opportunities have connected me with incredible people on similar journeys.",
    rating: 5,
  },
];

export default function VIPPlatinumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <BlurIn>
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-lg font-semibold mb-6 shadow-lg">
                <Crown className="w-5 h-5 mr-2" />
                VIP Platinum Tier
              </div>
            </BlurIn>
            <BlurIn>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Elite Therapy
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  Excellence
                </span>
              </h1>
            </BlurIn>
            <BlurIn>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Experience the absolute pinnacle of therapy with unlimited access, personal therapist teams, 
                white-label solutions, and elite concierge service. Reserved for those who demand the best.
              </p>
            </BlurIn>
            <BlurIn>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ShimmerButton className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600">
                  Request Platinum Access - €149.99/month
                </ShimmerButton>
                <button className="px-8 py-4 text-lg border-2 border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  Schedule Elite Consultation
                </button>
              </div>
            </BlurIn>
            <BlurIn>
              <p className="text-sm text-gray-500 mt-4">
                Invitation-only tier • Application required • Premium onboarding
              </p>
            </BlurIn>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedGradientText className="text-3xl font-bold mb-4">
              Platinum Elite Benefits
            </AnimatedGradientText>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unprecedented access, unlimited resources, and elite-level service designed for ultimate success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-purple-100 h-full">
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
      <section className="py-16 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedGradientText className="text-3xl font-bold mb-4">
              Platinum-Exclusive Features
            </AnimatedGradientText>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {exclusiveFeatures.map((feature, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-200 text-center">
                  <div className="text-purple-600 mb-4">
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
      <section className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <NumberTicker value={999} className="text-4xl font-bold mb-2" />
              <p className="text-purple-100">Unlimited Sessions</p>
            </div>
            <div>
              <NumberTicker value={200} className="text-4xl font-bold mb-2" />
              <p className="text-purple-100">GB Storage</p>
            </div>
            <div>
              <NumberTicker value={2.5} className="text-4xl font-bold mb-2" />
              <p className="text-purple-100">Loyalty Multiplier</p>
            </div>
            <div>
              <NumberTicker value={24} className="text-4xl font-bold mb-2" />
              <p className="text-purple-100">Priority Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedGradientText className="text-3xl font-bold mb-4">
              Elite Member Testimonials
            </AnimatedGradientText>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-purple-100">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Crown key={i} className="w-5 h-5 text-purple-400 fill-current" />
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
              Ready for Elite Status?
            </AnimatedGradientText>
            <p className="text-xl text-gray-600 mb-8">
              Join the most exclusive therapy experience available. Our Platinum tier is reserved for 
              those who demand unlimited access, elite service, and transformative results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton className="px-8 py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600">
                Apply for Platinum Access
              </ShimmerButton>
              <button className="px-8 py-4 text-lg border-2 border-purple-500 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                Elite Consultation Call
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Application review within 24 hours • Premium onboarding • Exclusive benefits
            </p>
          </BlurIn>
        </div>
      </section>
    </div>
  );
}