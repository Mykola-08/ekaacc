'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Users, Shield, Star } from 'lucide-react';
import { Button } from '@/components/keep';
import { useRouter } from 'next/navigation';

export default function PremiumHero() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/20 via-purple-100/10 to-pink-100/20 rounded-full blur-3xl"></div>
        <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-100/20 via-blue-100/15 to-indigo-100/20 rounded-full blur-3xl"></div>
        <div className="absolute left-0 bottom-1/4 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100/20 via-teal-100/15 to-cyan-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg">
              <Sparkles className="h-4 w-4" />
              <span>Premium Mental Wellness Platform</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Transform Your Mental
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Wellness Journey
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl max-w-3xl mx-auto">
            Experience personalized therapy, AI-powered insights, and a supportive community designed to help you thrive. 
            Professional care meets cutting-edge technology for your mental wellness.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => router.push('/login?tab=signup')}
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
              onClick={() => router.push('/ai-demo')}
            >
              Try AI Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
    </section>
  );
}