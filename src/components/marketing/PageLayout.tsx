'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  hero?:
    | React.ReactNode
    | {
        title: string;
        subtitle?: string;
        badge?: string;
        icon?: React.ReactNode;
      };
  className?: string;
}

export default function PageLayout({ children, hero, className = '' }: PageLayoutProps) {
  const isCustomHero = React.isValidElement(hero);
  const heroData = !isCustomHero
    ? (hero as
        | {
            title: string;
            subtitle?: string;
            badge?: string;
            icon?: React.ReactNode;
          }
        | undefined)
    : undefined;

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Hero Section */}
      {isCustomHero
        ? hero
        : heroData && (
            <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-16">
              {/* Background Elements */}
              <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center opacity-40" />
              <div className="from-primary-50/30 absolute inset-0 bg-gradient-to-b via-white/30 to-transparent" />

              <div className="section-container relative z-10 text-center">
                {heroData.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-primary-700 border-primary-100/70 mb-8 inline-flex items-center rounded-full border bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur-sm"
                  >
                    {heroData.icon && <span className="mr-2">{heroData.icon}</span>}
                    {heroData.badge}
                  </motion.div>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-eka-dark mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
                >
                  {heroData.title}
                </motion.h1>

                {heroData.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto max-w-3xl text-lg leading-relaxed text-balance text-gray-600 sm:text-xl"
                  >
                    {heroData.subtitle}
                  </motion.p>
                )}
              </div>
            </section>
          )}

      {/* Main Content */}
      <main className="relative z-10">{children}</main>
    </div>
  );
}
