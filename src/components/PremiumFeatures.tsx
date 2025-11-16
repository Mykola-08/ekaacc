'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Users, Shield, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Advanced artificial intelligence analyzes your patterns and provides personalized recommendations for better mental wellness.",
    color: "from-blue-500 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-50 to-cyan-50"
  },
  {
    icon: Heart,
    title: "Personalized Therapy",
    description: "Tailored therapy sessions that adapt to your unique needs, preferences, and progress for maximum effectiveness.",
    color: "from-pink-500 to-rose-500",
    gradient: "bg-gradient-to-br from-pink-50 to-rose-50"
  },
  {
    icon: Users,
    title: "Supportive Community",
    description: "Connect with like-minded individuals in a safe, moderated environment focused on growth and mutual support.",
    color: "from-green-500 to-emerald-500",
    gradient: "bg-gradient-to-br from-green-50 to-emerald-50"
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Enterprise-grade security with end-to-end encryption. Your data is yours alone, always protected and private.",
    color: "from-purple-500 to-violet-500",
    gradient: "bg-gradient-to-br from-purple-50 to-violet-50"
  },
  {
    icon: Sparkles,
    title: "Smart Adaptation",
    description: "Our platform learns from your interactions and automatically adjusts to provide the most relevant experience.",
    color: "from-amber-500 to-orange-500",
    gradient: "bg-gradient-to-br from-amber-50 to-orange-50"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your journey with comprehensive analytics, mood tracking, and measurable wellness improvements.",
    color: "from-indigo-500 to-blue-500",
    gradient: "bg-gradient-to-br from-indigo-50 to-blue-50"
  }
];

export default function PremiumFeatures() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-100/30 via-transparent to-purple-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-green-100/30 via-transparent to-pink-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mental Wellness
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover powerful tools and features designed by mental health professionals to support your journey towards better mental health and personal growth.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className={`h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${feature.gradient} group-hover:scale-105`}>
                  <CardHeader className="pb-4">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base text-gray-600 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-lg">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Ready to begin your journey?</h3>
              <p className="text-gray-600">Join thousands who have transformed their mental wellness</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}