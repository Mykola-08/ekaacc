'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Dna, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/marketing/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PageLayout from '@/components/marketing/PageLayout';
import { products, categories, getLocalized } from '@/app/(marketing)/products';
import SEOUpdater from '@/components/marketing/SEOUpdater';

export default function AgenyzContent() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  return (
    <>
      <SEOUpdater titleKey="agenyz.seo.title" descriptionKey="agenyz.seo.description" />
      <PageLayout
        hero={{
          title: t('agenyz.page.title') || 'Unlock Your Cellular Potential',
          subtitle: t('agenyz.page.subtitle') || 'Bio-available supplements designed to restore balance, defy aging, and fuel your vitality at the DNA level.',
          badge: t('agenyz.hero.biohacking') || 'Bio-Innovation',
          icon: <Dna className="w-4 h-4" />,
          backgroundImage: '/agenyz-products.png',
        }}
      >
        <section className="py-24" id="catalogue">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="mb-16 text-center">
              <span className="text-gray-400 mb-4 block text-sm font-semibold tracking-wider uppercase">
                {t('agenyz.catalogue.subtitle') || 'Our Collection'}
              </span>
              <h2 className="text-gray-900 mb-6 text-4xl font-semibold tracking-tight md:text-5xl">
                {t('agenyz.catalogue.title') || 'Agenyz Product Catalogue'}
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-normal text-gray-500">
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
                      ? 'bg-gray-900 scale-105 text-white shadow-lg'
                      : 'border border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
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
                      className="group flex h-full flex-col rounded-[2.5rem] border border-gray-100 bg-white p-8 transition-shadow hover:shadow-xl"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <span className="bg-gray-100 text-gray-600 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                          {t(`agenyz.category.${product.category}`) || product.category}
                        </span>
                      </div>

                      <div className="relative mb-6 flex h-56 w-full items-center justify-center rounded-2xl bg-gray-50 p-4">
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
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-300">
                            <Sparkles className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-gray-900 group-hover:text-gray-600 mb-4 text-2xl font-semibold tracking-tight transition-colors">
                        {getLocalized(product.name, language)}
                      </h3>

                      <p className="mb-6 line-clamp-3 grow leading-relaxed font-normal text-gray-500">
                        {getLocalized(product.shortDescription || product.description, language)}
                      </p>

                      {product.benefits && product.benefits.length > 0 && (
                        <ul className="mb-8 space-y-2">
                          {product.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-gray-500">
                              <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />
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
                          variant="outline"
                          className="pointer-events-none rounded-full"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* CTA */}
            <div className="mt-24 text-center">
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/reservar">
                  <Button size="lg" className="rounded-full px-10">
                    {t('common.bookNow')}
                  </Button>
                </Link>
                <a href="https://agenyz.com" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full px-10">
                    {t('agenyz.cta.visitStore') || 'Visit Agenyz Store'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
