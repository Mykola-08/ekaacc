'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/marketing/components/ui/button';
import { ArrowRight, CheckCircle2, Dna, Sparkles } from 'lucide-react';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '@/marketing/components/PageLayout';
import SEOUpdater from '@/marketing/components/SEOUpdater';
import { products, categories, getLocalized } from '@/app/(marketing)/agenyz/products';
import { ServiceBentoItem } from '@/marketing/components/ui/service-bento';

export default function AgenyzContent() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts =
    selectedCategory === 'All' ? products : products.filter((p) => p.category === selectedCategory);

  // Filter featured products for the bento grid
  const featuredProducts = products.filter((p) =>
    ['CellGenetiX', '3D-Matrix', 'Octomagnesium-XBi-A'].includes(p.id)
  );

  return (
    <>
      <SEOUpdater
        titleKey="agenyz.seo.title"
        descriptionKey="agenyz.seo.description"
        keywordsKey="agenyz.seo.keywords"
      />
      <PageLayout
        hero={{
          title: t('agenyz.page.title') || 'Unlock Your Cellular Potential',
          subtitle:
            t('agenyz.page.subtitle') ||
            'Bio-available supplements designed to restore balance, defy aging, and fuel your vitality at the DNA level.',
          badge: t('agenyz.hero.biohacking') || 'Bio-Innovation',
          icon: <Dna className="h-4 w-4" />,
          backgroundImage:
            'https://images.pexels.com/photos/3184451/pexels-photo-3184451.jpeg?auto=compress&cs=tinysrgb&w=1600',
        }}
      >
        <div className="relative z-20 mt-4 mb-20 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="hover: rounded-full px-8 transition-all">
            <Link href="/booking">
              {t('common.bookNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <a href="https://agenyz.es" target="_blank" rel="noopener noreferrer">
            <Button
              size="xl"
              variant="outline"
              className="rounded-full border-gray-200 bg-white/90 px-8 text-gray-800 backdrop-blur-sm hover:bg-gray-50"
            >
              {t('agenyz.cta.visitStore') || 'Visit Agenyz Store'}
            </Button>
          </a>
        </div>

        {/* Apple-Style Bento Section */}
        <section className="relative overflow-hidden bg-background py-24">
          <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="mb-6 text-4xl font-semibold tracking-tighter text-gray-900 md:text-5xl lg:text-6xl">
                {t('agenyz.bento.title') || 'Smart Cell Food'}
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed font-medium text-gray-500 md:text-xl">
                {t('agenyz.bento.subtitle') ||
                  'The next generation of bio-innovation for your longevity and health.'}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {featuredProducts.map((product, idx) => (
                <ServiceBentoItem
                  key={product.id}
                  title={getLocalized(product.name, language)}
                  description={getLocalized(product.description, language)}
                  image={product.image}
                  className={idx === 0 ? 'md:col-span-2' : 'col-span-1'}
                  delay={idx * 0.1}
                  details={
                    <div className="">
                      <h4 className="text-xl font-bold text-gray-900">
                        {getLocalized(product.name, language)}
                      </h4>
                      <p className="leading-relaxed text-gray-600">
                        {getLocalized(product.longDescription || product.description, language)}
                      </p>
                      {product.benefits && (
                        <ul className="mt-4">
                          {product.benefits.map((b, i) => (
                            <li key={i} className="flex items-center text-sm text-gray-600">
                              <CheckCircle2 className="text-primary-500 mr-2 h-4 w-4" />
                              {getLocalized(b, language)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  }
                  bookUrl={`/agenyz/${product.id}`}
                  bookText={t('agenyz.viewDetails') || 'Full details'}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24" id="catalogue">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="mb-16 text-center">
              <span className="text-primary-600 mb-4 block text-sm font-semibold tracking-wider uppercase">
                {t('agenyz.catalogue.subtitle') || 'Our Collection'}
              </span>
              <h2 className="mb-6 text-4xl font-semibold tracking-tight text-gray-900 md:text-5xl">
                {t('agenyz.catalogue.title') || 'Agenyz Product Catalogue'}
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-medium text-gray-500">
                {t('agenyz.catalogue.desc') ||
                  'Explore our comprehensive range of bio-additives and functional foods designed for your cellular health.'}
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-16 flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-primary scale-105 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {t(`agenyz.category.${category}`) || category}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <motion.div layout className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <Link
                    href={`/agenyz/${product.id}`}
                    key={product.id}
                    className="group block h-full"
                  >
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="hover: flex h-full flex-col rounded-[2.5rem] border border-gray-100 bg-background p-8 transition-all duration-500 hover:shadow-black/5"
                    >
                      <div className="mb-6">
                        <span className="rounded-full border border-gray-100 bg-white/80 px-4 py-1.5 text-[10px] font-bold tracking-widest text-gray-600 uppercase backdrop-blur-md">
                          {t(`agenyz.category.${product.category}`) || product.category}
                        </span>
                      </div>

                      <div className="relative mb-8 flex h-64 w-full items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105">
                        {product.image ? (
                          <div className="drop- relative h-full w-full">
                            <Image
                              src={product.image}
                              alt={getLocalized(product.name, language)}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gray-50 bg-white text-gray-200">
                            <Sparkles className="h-10 w-10" />
                          </div>
                        )}
                      </div>

                      <h3 className="group-hover:text-primary-600 mb-3 text-2xl font-semibold tracking-tight text-gray-900 transition-colors">
                        {getLocalized(product.name, language)}
                      </h3>

                      <p className="mb-6 line-clamp-3 flex-grow leading-relaxed font-medium text-gray-500">
                        {getLocalized(product.shortDescription || product.description, language)}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                        <span className="text-sm font-bold text-gray-400 transition-colors group-hover:text-gray-900">
                          {t('agenyz.viewDetails') || 'View details'}
                        </span>
                        <div className="group-hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white transition-all duration-300 group-hover:text-white">
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </PageLayout>
    </>
  );
}
