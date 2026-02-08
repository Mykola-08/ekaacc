'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'keep-react';
import { ArrowRight, CheckCircle2, Dna, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/components/marketing/PageLayout';
import { products, categories, getLocalized } from '@/app/(marketing)/products';

export default function AgenyzContent() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  const Hero = (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="absolute inset-0 bg-[url('/grid.svg')] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] bg-center" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <div className="bg-primary-100/50 border-primary-100 mb-8 inline-flex items-center rounded-full border py-2">
              <Dna className="text-primary-600 mr-2 h-4 w-4" />
              <span className="text-primary-700 text-sm font-medium tracking-wide uppercase">
                {t('agenyz.hero.biohacking') || 'Bio-Innovation'}
              </span>
            </div>

            <h1 className="text-eka-dark mb-6 text-5xl leading-tight font-bold tracking-tight sm:text-6xl">
              {t('agenyz.page.title') || 'Unlock Your Cellular Potential'}
            </h1>

            <p className="mb-8 text-xl leading-relaxed font-light text-gray-600 sm:text-2xl">
              {t('agenyz.page.subtitle') ||
                'Bio-available supplements designed to restore balance, defy aging, and fuel your vitality at the DNA level.'}
            </p>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed font-light text-gray-700 lg:mx-0">
              {t('agenyz.page.description') ||
                "True health is not just about what you eat - it's about what your cells absorb. Agenyz represents the next generation of Smart Cell Food, combining rare natural extracts with cutting-edge delivery technologies."}
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Link href="/book">
                <Button size="xl" className="btn btn-primary rounded-xl px-8">
                  {t('common.bookNow')}
                </Button>
              </Link>
              <a href="https://agenyz.com" target="_blank" rel="noopener noreferrer">
                <Button
                  size="xl"
                  className="btn btn-secondary bg-primary-600 hover:bg-primary-700 rounded-xl border-none px-8 text-white"
                >
                  {t('agenyz.cta.visitStore') || 'Visit Agenyz Store'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="group relative">
              <div className="from-primary-200 transition-duration-500 absolute inset-0 rounded-[20px] bg-gradient-to-tr to-indigo-200 opacity-30 blur-xl group-hover:opacity-50" />
              <div className="relative aspect-[4/3]">
                <Image
                  src="/agenyz-products.png"
                  alt="Cellular Bio-Innovation"
                  fill
                  className="object-cover shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 z-10 rounded-[20px] border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <span className="relative flex h-3 w-3">
                    <span className="bg-primary-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                    <span className="bg-primary-500 relative inline-flex h-3 w-3 rounded-full"></span>
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {t('agenyz.hero.science') || 'Powered by Science'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <PageLayout hero={Hero}>
      <section className="py-24" id="catalogue">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="mb-16 text-center">
            <span className="text-primary-600 mb-4 block text-sm font-semibold tracking-wider uppercase">
              {t('agenyz.catalogue.subtitle') || 'Our Collection'}
            </span>
            <h2 className="text-eka-dark mb-6 text-4xl font-light md:text-5xl">
              {t('agenyz.catalogue.title') || 'Agenyz Product Catalogue'}
            </h2>
            <p className="mx-auto max-w-2xl text-xl font-light text-gray-600">
              {t('agenyz.catalogue.desc') ||
                'Explore our comprehensive range of bio-additives and functional foods designed for your cellular health.'}
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-16 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 scale-105 text-white shadow-lg'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t(`agenyz.category.${category}`) || category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <Link href={`/agenyz/${product.id}`} key={product.id} className="block h-full">
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="card card-interactive group flex h-full flex-col rounded-[20px] p-8"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <span className="bg-primary-50 text-primary-700 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                        {t(`agenyz.category.${product.category}`) || product.category}
                      </span>
                    </div>

                    <div className="relative mb-6 flex h-56 w-full items-center justify-center rounded-[20px] bg-white p-4">
                      {product.image ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={product.image}
                            alt={getLocalized(product.name, language)}
                            fill
                            className="transform object-contain transition-transform duration-500 will-change-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                          <Sparkles className="h-8 w-8" />
                        </div>
                      )}
                    </div>

                    <h3 className="text-eka-dark group-hover:text-primary-700 mb-4 text-2xl font-light transition-colors">
                      {getLocalized(product.name, language)}
                    </h3>

                    <p className="mb-6 line-clamp-3 flex-grow leading-relaxed font-light text-gray-600">
                      {getLocalized(product.shortDescription || product.description, language)}
                    </p>

                    {product.benefits && product.benefits.length > 0 && (
                      <ul className="mb-8 space-y-2">
                        {product.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-500">
                            <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                            {getLocalized(benefit, language)}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                      <span className="text-sm font-medium text-gray-400">
                        {t('agenyz.viewDetails') || 'View details'}
                      </span>
                      <Button
                        size="sm"
                        className="btn btn-outline border-primary-200 text-primary-600 hover:bg-primary-50 pointer-events-none rounded-xl"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
