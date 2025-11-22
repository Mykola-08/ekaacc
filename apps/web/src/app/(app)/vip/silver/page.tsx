import React from 'react';
import { Metadata } from 'next';
import { Star, Shield, Users, TrendingUp, Award, Clock, Heart, Zap } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { Button } from '@/components/ui/button';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { NumberTicker } from '@/components/ui/number-ticker';
import { BlurIn } from '@/components/ui/blur-in';

export const metadata: Metadata = {
  title: 'VIP Silver Tier - Enhanced Therapy Experience',
  description: 'Upgrade to VIP Silver tier for enhanced therapy features, priority support, and exclusive benefits.',
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
    description: 'Get priority customer support with faster response times and dedicated assistance',
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
    name: "Sarah M.",
    role: "VIP Silver Member",
    content: "The priority support has been incredible. I get responses within hours, not days.",
    rating: 5,
  },
  {
    name: "David L.",
    role: "VIP Silver Member",
    content: "Having 15 sessions per month gives me the flexibility I need for my mental health journey.",
    rating: 5,
  },
  {
    name: "Emma R.",
    role: "VIP Silver Member",
    content: "The premium themes make the app feel so personal and inviting. Love the early access perks!",
    rating: 5,
  },
];

export default function VIPSilverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-transparent to-slate-100 opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <BlurIn>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                VIP Silver Tier
              </div>
            </BlurIn>
            <BlurIn>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Elevate Your Therapy
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Experience
                </span>
              </h1>
            </BlurIn>
            <BlurIn>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Unlock enhanced therapy features with VIP Silver tier. Get priority support, 
                increased session limits, and exclusive access to premium tools and community.
              </p>
            </BlurIn>
            <BlurIn>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <ShimmerButton className="px-8 py-4 text-lg">
                  Upgrade to Silver - €29.99/month
                </ShimmerButton>
                <Button variant="outline" className="px-8 py-4 text-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                  Compare All Tiers
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
              Silver Tier Benefits
            </AnimatedGradientText>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to enhance your therapy journey with premium features and priority access
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
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
              <NumberTicker value={15} className="text-4xl font-bold mb-2" />
              <p className="text-blue-100">Sessions Per Month</p>
            </div>
            <div>
              <NumberTicker value={10} className="text-4xl font-bold mb-2" />
              <p className="text-blue-100">Premium Themes</p>
            </div>
            <div>
              <NumberTicker value={24} className="text-4xl font-bold mb-2" />
              <p className="text-blue-100">Priority Support Hours</p>
            </div>
            <div>
              <NumberTicker value={1.5} className="text-4xl font-bold mb-2" />
              <p className="text-blue-100">Loyalty Multiplier</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <AnimatedGradientText className="text-3xl font-bold mb-4">
              What Our Silver Members Say
            </AnimatedGradientText>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <BlurIn key={index} delay={index * 0.1}>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
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
              Ready to Upgrade?
            </AnimatedGradientText>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of satisfied Silver members who have enhanced their therapy experience. 
              Start your journey today with a 7-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ShimmerButton className="px-8 py-4 text-lg">
                Start Free Trial
              </ShimmerButton>
              <Button variant="outline" className="px-8 py-4 text-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                Learn More
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No commitment • Cancel anytime • 7-day free trial
            </p>
          </BlurIn>
        </div>
      </section>
    </div>
  );
}