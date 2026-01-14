'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Brain, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/lib/platform/supabase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MinimalistHomePage() {
 const { user, loading } = useAuth();
 const router = useRouter();

 useEffect(() => {
  if (!loading && !user) {
   router.push('/login');
  }
 }, [user, loading, router]);

 if (loading) {
  return (
   <div className="min-h-screen bg-muted/30 flex items-center justify-center">
    <motion.div
     className="flex flex-col items-center space-y-4"
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.5 }}
    >
     <motion.div
      className="w-8 h-8 bg-blue-500 rounded-full"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
     />
     <div className="text-muted-foreground">Loading...</div>
    </motion.div>
   </div>
  );
 }

 if (!user) {
  return null;
 }

 return (
  <div className="min-h-screen bg-muted/30">
   {/* Minimalist Hero Section */}
   <section className="relative overflow-hidden py-20 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
     <div className="mx-auto max-w-3xl text-center">
      <motion.div
       className="mb-8 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium text-foreground/90"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, ease: "easeOut" }}
      >
       <Sparkles className="h-4 w-4 text-blue-500" />
       Welcome back
      </motion.div>

      <motion.h1
       className="text-4xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
       initial={{ opacity: 0, y: 30 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      >
       Your wellness
       <span className="block text-blue-600">journey continues</span>
      </motion.h1>

      <motion.p
       className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
      >
       Track your progress, gain insights, and grow with personalized AI-powered guidance.
      </motion.p>

      <motion.div
       className="mt-10 flex items-center justify-center gap-4"
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
      >
       <motion.button
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-medium transition-all duration-200 hover:bg-blue-700"
        whileHover={{ y: -2, opacity: 0.95 }}
        whileTap={{ scale: 0.95 }}
       >
        Continue journey
        <ArrowRight className="h-4 w-4" />
       </motion.button>
      </motion.div>
     </div>
    </div>
   </section>

   {/* Minimalist Features Section */}
   <section className="py-24 bg-card">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
     <div className="mx-auto max-w-2xl text-center mb-16">
      <motion.h2
       className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6 }}
      >
       Simple tools for
       <span className="text-blue-600"> meaningful growth</span>
      </motion.h2>
      <motion.p
       className="mt-6 text-lg leading-8 text-muted-foreground"
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6, delay: 0.2 }}
      >
       Focus on what matters with clean, intuitive tools designed for your wellness journey.
      </motion.p>
     </div>
     
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
       {
        icon: Heart,
        title: 'Mood Tracking',
        description: 'Simple, quick mood logging that fits your daily routine.',
       },
       {
        icon: Brain,
        title: 'AI Insights',
        description: 'Personalized recommendations based on your patterns.',
       },
       {
        icon: Shield,
        title: 'Private & Secure',
        description: 'Your data stays yours with end-to-end encryption.',
       },
       {
        icon: Zap,
        title: 'Quick Actions',
        description: 'Fast access to tools that support your wellness.',
       },
      ].map((feature, index) => (
       <motion.div
        key={feature.title}
        className="group bg-card p-6 rounded-[32px] border-none hover: transition-all duration-200 hover:shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        whileHover={{ y: -4 }}
       >
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
         <feature.icon className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
         {feature.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
         {feature.description}
        </p>
       </motion.div>
      ))}
     </div>
    </div>
   </section>

   {/* Minimalist CTA Section */}
   <section className="py-24 bg-muted/30">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
     <div className="mx-auto max-w-2xl text-center">
      <motion.h2
       className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6 }}
      >
       Ready to continue?
      </motion.h2>
      <motion.p
       className="mt-6 text-lg leading-8 text-muted-foreground"
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6, delay: 0.2 }}
      >
       Pick up where you left off or explore something new.
      </motion.p>
      <motion.div
       className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
       initial={{ opacity: 0, y: 20 }}
       whileInView={{ opacity: 1, y: 0 }}
       viewport={{ once: true }}
       transition={{ duration: 0.6, delay: 0.4 }}
      >
       <motion.button
        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-medium transition-all duration-200 hover:bg-blue-700"
        whileHover={{ y: -2, opacity: 0.95 }}
        whileTap={{ scale: 0.95 }}
       >
        Go to dashboard
        <ArrowRight className="h-4 w-4" />
       </motion.button>
       
       <motion.button
        className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-foreground/90 font-medium transition-all duration-200 hover:bg-muted hover:border-border"
        whileHover={{ y: -2, opacity: 0.95 }}
        whileTap={{ scale: 0.95 }}
       >
        View progress
       </motion.button>
      </motion.div>
     </div>
    </div>
   </section>
  </div>
 );
}