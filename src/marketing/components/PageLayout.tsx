'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageLayoutProps {
  children: React.ReactNode;
  hero?:
    | React.ReactNode
    | {
        title: string;
        subtitle?: string;
        badge?: string;
        icon?: React.ReactNode;
        backgroundImage?: string;
        themeColor?: string;
      };
  className?: string;
  mainClassName?: string;
}

export default function PageLayout({
  children,
  hero,
  className = '',
  mainClassName = 'bg-white rounded-t-[3rem]',
}: PageLayoutProps) {
  const isCustomHero = React.isValidElement(hero);
  const heroData = !isCustomHero
    ? (hero as
        | {
            title: string;
            subtitle?: string;
            badge?: string;
            icon?: React.ReactNode;
            backgroundImage?: string;
            themeColor?: string;
          }
        | undefined)
    : undefined;

  return (
    <div className={`bg-background min-h-screen ${className}`}>
      {/* Hero Section */}
      {isCustomHero
        ? hero
        : heroData &&
          (heroData.backgroundImage ? (
            <section className="relative flex h-[100svh] min-h-[600px] w-full flex-col items-center justify-center overflow-hidden">
              <motion.div
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src={heroData.backgroundImage}
                  alt={heroData.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
              </motion.div>

              <div className="relative z-10 mx-auto mt-16 max-w-4xl px-6 text-center">
                {heroData.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-black/30 px-4 py-1.5 text-xs font-semibold tracking-widest text-white/90 uppercase backdrop-blur-md"
                  >
                    {heroData.badge}
                  </motion.div>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-6 pb-2 text-4xl leading-[1.05] font-semibold tracking-tighter text-balance text-white sm:text-6xl lg:text-[5.5rem]"
                >
                  {heroData.title}
                </motion.h1>

                {heroData.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mx-auto max-w-3xl text-lg leading-relaxed font-medium tracking-tight text-balance text-white/80 sm:text-2xl"
                  >
                    {heroData.subtitle}
                  </motion.p>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 animate-bounce flex-col items-center justify-center"
              >
                <div className="flex h-[50px] w-[30px] justify-center rounded-full border-2 border-white/40 p-2">
                  <div className="h-3 w-1.5 rounded-full bg-white"></div>
                </div>
              </motion.div>
            </section>
          ) : (
            <section className="bg-background relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
              <div className="section-container relative z-20 mx-auto max-w-4xl px-6 text-center">
                {heroData.badge && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white/50 px-4 py-1.5 text-xs font-semibold tracking-widest text-gray-500 uppercase backdrop-blur-md"
                  >
                    {heroData.badge}
                  </motion.div>
                )}

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mb-6 pb-2 text-4xl leading-[1.05] font-semibold tracking-tighter text-balance text-black sm:text-6xl lg:text-[5.5rem]"
                >
                  {heroData.title}
                </motion.h1>

                {heroData.subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mx-auto max-w-3xl text-lg leading-relaxed font-medium tracking-tight text-balance text-gray-500/90 sm:text-2xl"
                  >
                    {heroData.subtitle}
                  </motion.p>
                )}
              </div>
            </section>
          ))}

      {/* Main Content */}
      <main className={`relative z-20 -mt-8 pt-12 pb-0 ${mainClassName}`}>{children}</main>
    </div>
  );
}
