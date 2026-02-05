'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { BentoGrid } from '@/components/marketing/BentoGrid';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';

import CasosSection from '@/components/marketing/CasosSection';
import TestimonialSlider from '@/components/marketing/TestimonialSlider';
import FAQ from '@/components/marketing/FAQ';

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      {/* Welcome Section */}
      <div className="px-6 py-10 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary mb-3"
            >
              <div className="h-px w-8 bg-primary/30" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">EKA Account</span>
            </motion.div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-[1.1]">
              {t('elena.greeting') || "Welcome back to your wellbeing center."}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl font-medium opacity-80">
              Manage your therapies, track your progress, and explore personalized wellness treatments designed for your lifestyle.
            </p>
        </div>

        {/* Bento Grid Layout */}
        <BentoGrid />

        {/* Content Sections */}
        <div className="mt-20 space-y-32">
          <section>
            <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Recent Success Stories</h3>
                  <p className="text-muted-foreground text-sm">Real results from our integrative therapies.</p>
                </div>
                <Button variant="outline" className="rounded-full px-6">View All</Button>
            </div>
            <div className="bg-primary/5 rounded-3xl p-2">
                <CasosSection />
            </div>
          </section>

          <section className="py-20 bg-muted/30 rounded-3xl -mx-4 lg:-mx-8 px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h3 className="text-3xl font-bold tracking-tight mb-4">What our clients say</h3>
                <p className="text-muted-foreground">Transformative experiences from people like you.</p>
            </div>
            <TestimonialSlider />
          </section>

          <section className="pb-20">
            <FAQ />
          </section>
        </div>
      </div>
    </>
  );
}


