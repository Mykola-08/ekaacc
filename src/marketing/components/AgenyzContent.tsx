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

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(p => p.category === selectedCategory);

    // Filter featured products for the bento grid
    const featuredProducts = products.filter(p => 
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
                subtitle: t('agenyz.page.subtitle') || 'Bio-available supplements designed to restore balance, defy aging, and fuel your vitality at the DNA level.',
                badge: t('agenyz.hero.biohacking') || 'Bio-Innovation',
                icon: <Dna className="w-4 h-4" />,
                backgroundImage: 'https://images.pexels.com/photos/3184451/pexels-photo-3184451.jpeg?auto=compress&cs=tinysrgb&w=1600'
            }}
        >
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4 mb-20 relative z-20">
                <Button asChild size="xl" className="rounded-full shadow-md hover:shadow-lg transition-all px-8">
                    <Link href="/booking">
                        {t('common.bookNow')}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </Button>
                <a
                    href='https://agenyz.es'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <Button
                        size='xl'
                        variant="outline" 
                        className="rounded-full bg-white/90 backdrop-blur-sm text-gray-800 border-gray-200 hover:bg-gray-50 px-8"
                    >
                        {t('agenyz.cta.visitStore') || 'Visit Agenyz Store'}
                    </Button>
                </a>
            </div>

            {/* Apple-Style Bento Section */}
            <section className="py-24 bg-[#fbfbfd] relative overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tighter text-gray-900 mb-6">
                            {t('agenyz.bento.title') || 'Smart Cell Food'}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed max-w-2xl mx-auto">
                            {t('agenyz.bento.subtitle') || 'The next generation of bio-innovation for your longevity and health.'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {featuredProducts.map((product, idx) => (
                            <ServiceBentoItem
                                key={product.id}
                                title={getLocalized(product.name, language)}
                                description={getLocalized(product.description, language)}
                                image={product.image}
                                className={idx === 0 ? "md:col-span-2" : "col-span-1"}
                                delay={idx * 0.1}
                                details={
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold text-gray-900">{getLocalized(product.name, language)}</h4>
                                        <p className="text-gray-600 leading-relaxed">{getLocalized(product.longDescription || product.description, language)}</p>
                                        {product.benefits && (
                                            <ul className="space-y-2 mt-4">
                                                {product.benefits.map((b, i) => (
                                                    <li key={i} className="flex items-center text-sm text-gray-600">
                                                        <CheckCircle2 className="w-4 h-4 text-primary-500 mr-2" />
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

            <section className='py-24 bg-white' id='catalogue'>
                <div className='max-w-7xl mx-auto px-4 sm:px-8'>
                    <div className='text-center mb-16'>
                        <span className='text-primary-600 font-semibold tracking-wider uppercase text-sm mb-4 block'>
                            {t('agenyz.catalogue.subtitle') || 'Our Collection'}
                        </span>
                        <h2 className='text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-6'>
                            {t('agenyz.catalogue.title') || 'Agenyz Product Catalogue'}
                        </h2>
                        <p className='text-xl text-gray-500 font-medium max-w-2xl mx-auto'>
                            {t('agenyz.catalogue.desc') || 'Explore our comprehensive range of bio-additives and functional foods designed for your cellular health.'}
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className='flex flex-wrap justify-center gap-2 mb-16'>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${selectedCategory === category
                                    ? 'bg-black text-white shadow-lg scale-105'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {t(`agenyz.category.${category}`) || category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <motion.div
                        layout
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProducts.map((product) => (
                                <Link href={`/agenyz/${product.id}`} key={product.id} className='h-full block group'>
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        className='bg-[#fbfbfd] border border-gray-100 rounded-[2.5rem] p-8 flex flex-col h-full hover:shadow-2xl hover:shadow-black/5 transition-all duration-500'
                                    >
                                        <div className='mb-6'>
                                            <span className='px-4 py-1.5 bg-white/80 backdrop-blur-md text-gray-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-gray-100 shadow-sm'>
                                                {t(`agenyz.category.${product.category}`) || product.category}
                                            </span>
                                        </div>

                                        <div className='relative w-full h-64 mb-8 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500'>
                                            {product.image ? (
                                                <div className='relative w-full h-full drop-shadow-2xl'>
                                                    <Image
                                                        src={product.image}
                                                        alt={getLocalized(product.name, language)}
                                                        fill
                                                        className='object-contain'
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                </div>
                                            ) : (
                                                <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 border border-gray-50'>
                                                    <Sparkles className='w-10 h-10' />
                                                </div>
                                            )}
                                        </div>

                                        <h3 className='text-2xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-primary-600 transition-colors'>
                                            {getLocalized(product.name, language)}
                                        </h3>

                                        <p className='text-gray-500 mb-6 flex-grow leading-relaxed font-medium line-clamp-3'>
                                            {getLocalized(product.shortDescription || product.description, language)}
                                        </p>

                                        <div className='pt-6 border-t border-gray-100 flex items-center justify-between mt-auto'>
                                            <span className='text-sm font-bold text-gray-400 group-hover:text-gray-900 transition-colors'>{t('agenyz.viewDetails') || 'View details'}</span>
                                            <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover:bg-black group-hover:text-white transition-all duration-300'>
                                                <ArrowRight className='w-5 h-5' />
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
