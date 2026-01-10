'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { Badge } from '@/components/platform/ui/badge';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/platform/utils';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  badgeText: string;
  gradient: string;
}

const banners: Banner[] = [
  {
    id: 1,
    title: "Your Complete Wellness",
    subtitle: "Management Platform",
    description: "EKA Account is your centralized wellness platform combining therapy management, mood tracking, AI-powered insights, and personalized health guidance all in one place.",
    ctaText: "Get Started Free",
    ctaHref: "/signup",
    badgeText: "AI-Powered Wellness Platform",
    gradient: "from-blue-600 to-purple-600"
  },
  {
    id: 2,
    title: "Transform Your Mental",
    subtitle: "& Physical Wellbeing",
    description: "Track progress, connect with therapists, and transform your mental and physical wellbeing with personalized insights and comprehensive tools.",
    ctaText: "Start Your Journey",
    ctaHref: "/onboarding",
    badgeText: "Personalized Health Guidance",
    gradient: "from-green-600 to-blue-600"
  },
  {
    id: 3,
    title: "Connect with Expert",
    subtitle: "Therapists Today",
    description: "Book sessions, manage appointments, and communicate with licensed therapists seamlessly through our secure platform.",
    ctaText: "Book a Session",
    ctaHref: "/sessions/booking",
    badgeText: "Licensed Therapist Network",
    gradient: "from-purple-600 to-pink-600"
  }
];

export function HeroSection() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleBannerSelect = (index: number) => {
    setCurrentBanner(index);
  };

  const handleNext = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const currentBannerData = banners[currentBanner];

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-background to-muted/30 py-20 sm:py-24 lg:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Hero banner"
    >
      {/* Background gradient animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-10 animate-pulse",
          currentBannerData.gradient
        )} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Banner indicator dots */}
          <div className="flex justify-center gap-2 mb-8" role="tablist" aria-label="Banner navigation">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => handleBannerSelect(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  index === currentBanner 
                    ? "bg-primary w-8" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                role="tab"
                aria-selected={index === currentBanner}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>

          {/* Banner content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  <Sparkles className="w-3 h-3 mr-1 inline" />
                  {currentBannerData.badgeText}
                </Badge>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground"
              >
                {currentBannerData.title}
                <span className="block text-primary">{currentBannerData.subtitle}</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              >
                {currentBannerData.description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap justify-center gap-4 pt-4"
              >
                <Button asChild size="lg" className="group">
                  <Link href={currentBannerData.ctaHref}>
                    {currentBannerData.ctaText}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrev}
              className="rounded-full hover:bg-primary/10 transition-colors duration-200"
              aria-label="Previous banner"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="rounded-full hover:bg-primary/10 transition-colors duration-200"
              aria-label="Next banner"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  );
}