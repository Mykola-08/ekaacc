'use client';

import SEOHead from '@/react-app/components/SEOHead';
import Link from 'next/link';
import { Button } from 'keep-react';
import { Sparkles, Zap, Shield, Brain, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import FloatingBiomedSymbols from '@/app/components/FloatingBiomedSymbols';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Product = {
    id: string;
    name: string;
    category: string;
    description: string;
    features?: string[];
    price?: string;
};

const products: Product[] = [
    // Cell Elixir
    {
        id: 'cellgenetix',
        name: 'CellGenetiX',
        category: 'Cell Elixir',
        description: 'An advanced antioxidant complex with Polyprenols and Astaxanthin - perfect for those who want to preserve youth and vitality.',
        features: ['Active Cell Regeneration', 'Telomere Protection', 'DNA Repair'],
    },
    {
        id: '3d-matrix',
        name: '3D-Matrix',
        category: 'Cell Elixir',
        description: 'The synergy of chondroprotectors, amino acids and antioxidants promotes the restoration of joint cartilage and collagen production.',
        features: ['Joint Health', 'Skin Elasticity', 'Connective Tissue Support'],
    },
    {
        id: 'alpha-omega-q10',
        name: 'AlphaOmega-Q10',
        category: 'Cell Elixir',
        description: 'Complex of antioxidants, coenzyme Q10, betulin and omega-3 fatty acids for heart, brain and beauty.',
        features: ['Heart Health', 'Brain Function', 'Anti-aging'],
    },
    {
        id: 'hepaart',
        name: 'HepaArt',
        category: 'Cell Elixir',
        description: 'A unique complex of plant extracts for liver protection and detoxification.',
        features: ['Liver Support', 'Detoxification', 'Cholesterol Balance'],
    },
    {
        id: 'ursus',
        name: 'Ursus',
        category: 'Cell Elixir',
        description: 'Complex of plant extracts and microelements for kidneys and urinary tract health.',
        features: ['Kidney Health', 'Urinary Tract Support', 'Mild Diuretic'],
    },
    {
        id: 'slim-hit',
        name: 'Slim Hit',
        category: 'Cell Elixir',
        description: 'Complex to block the absorption of excess fats and carbohydrates and reduce appetite.',
        features: ['Weight Management', 'Appetite Control', 'Metabolism Boost'],
    },
     {
        id: 'k2d3-boost',
        name: 'K2D3-Boost',
        category: 'Cell Elixir',
        description: 'A unique complex of fat-soluble vitamins and microelements for calcium metabolism.',
        features: ['Bone Strength', 'Immune Support', 'Calcium Absorption'],
    },

    // 3D Guard
    {
        id: 'cellguard',
        name: 'CellGuard',
        category: '3D Guard',
        description: 'A complex of the strongest natural immunomodulators aimed at protecting cells from viruses and damage.',
        features: ['Immune Defense', 'Antiviral', 'Cell Protection'],
    },
    {
        id: 'candidel',
        name: 'Candidel',
        category: '3D Guard',
        description: 'Natural complex of active plant components for protection against fungal infections (Candida).',
        features: ['Anti-fungal', 'Microbiome Balance', 'Detox'],
    },
    {
        id: 'infladel',
        name: 'Infladel',
        category: '3D Guard',
        description: 'Complex of active natural components aimed at reducing inflammatory processes.',
        features: ['Anti-inflammatory', 'Pain Relief', 'Recovery'],
    },

    // Beauty Drone
    {
        id: 'serum-progressive-anti-age',
        name: 'Serum Progressive Anti-Age',
        category: 'Beauty Drone',
        description: 'A premium, highly effective serum for deep skin rejuvenation and wrinkle reduction.',
        features: ['Lifting Effect', 'Wrinkle Reduction', 'Deep Hydration'],
    },
    {
        id: 'eye-lifting-cream',
        name: 'Anti-Age Eye Lifting Cream',
        category: 'Beauty Drone',
        description: 'Intensive anti-aging lifting cream for the delicate eye area.',
        features: ['Dark Circles Reduction', 'Lifting', 'Puffiness Reduction'],
    },
    {
        id: 'hyaluronic-aqua-cream',
        name: 'Hyaluronic Aqua Cream',
        category: 'Beauty Drone',
        description: 'Multi-molecular hyaluronic aqua cream for intensive moisturizing.',
        features: ['Deep Moisture', 'Skin Barrier', 'Radiance'],
    },

    // Functional Food
    {
        id: 'iq-mct-powder',
        name: 'IQ-MCT Powder',
        category: 'Functional Food',
        description: 'A high-quality source of pure energy for the heart, brain, and skeletal muscles. Keto-friendly.',
        features: ['Instant Energy', 'Brain Clarity', 'Keto Support'],
    },
    {
        id: 'alpha-shake-mct',
        name: 'Alpha Shake + MCT',
        category: 'Functional Food',
        description: 'Protein cocktail enriched with MCT oil for saturation and energy.',
        features: ['Muscle Recovery', 'Satiety', 'Metabolism'],
    },
    {
        id: 'chocolate-iq-shock',
        name: 'Chocolate iQ-Shock',
        category: 'Functional Food',
        description: 'Dark chocolate with no added sugar, aimed at mental clarity and brain concentration.',
        features: ['Focus', 'Mood Elevation', 'No Sugar'],
    },
    {
        id: 'black-gold-hot',
        name: 'Black Gold & Hot',
        category: 'Functional Food',
        description: 'Hot drink made from Chaga, Ginger and Lemon for immunity.',
        features: ['Immunity Warming', 'Antioxidant', 'Digestive Aid'],
    },

    // True Aqua
    {
        id: 'ph-balance-cell',
        name: 'pH Balance Cell',
        category: 'True Aqua',
        description: 'Balanced complex of minerals from Lithothamnia seaweed to regulate acid-base balance.',
        features: ['Alkalizing', 'Mineral Replenishment', 'Detox'],
    },
    {
        id: 'immune-cell',
        name: 'Immune Cell',
        category: 'True Aqua',
        description: 'Drink with vitamins, iodine and extracts for comprehensive immune support.',
        features: ['Daily Immunity', 'Energy', 'Vitality'],
    },
    {
        id: 'sorbio-detox-cell',
        name: 'Sorbio Detox Cell',
        category: 'True Aqua',
        description: 'Drink for effective detoxification and cleansing of the body.',
        features: ['Deep Detox', 'Gut Health', 'Heavy Metal Removal'],
    },

    // KidYZ
    {
        id: 'gummyz-kidyz',
        name: 'Gummyz KidYZ Calcium',
        category: 'KidYZ',
        description: 'Delicious vitamins for children with Calcium, Vitamin K2 and D3.',
        features: ['Strong Bones', 'Growth Support', 'Tasty & Healthy'],
    }
];

const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

export default function AgenyzPage() {
    const { t } = useLanguage();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(p => p.category === selectedCategory);

    return (
        <>
            <SEOHead
                title="Agenyz - Cellular Nutrition Catalogue"
                description="Explore the full range of Agenyz biohacking supplements and functional foods."
                keywords="agenyz catalogue, cell elixir, 3d guard, beauty drone, functional food"
            />

            {/* Hero Section - Unified Gradient */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <FloatingBiomedSymbols />
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="order-2 lg:order-1 text-center lg:text-left">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100/50 rounded-full mb-8 border border-blue-100">
                                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="text-blue-700 font-medium text-sm tracking-wide uppercase">{t('agenyz.hero.biohacking') || 'Biohacking & Nutrition'}</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl font-light text-gray-900 mb-6 leading-tight tracking-tight">
                                {t('agenyz.page.title') || 'Agenyz Cellular Nutrition'}
                            </h1>

                            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed font-light">
                                {t('agenyz.page.subtitle') || 'Advanced supplements for deep cellular regeneration and vitality.'}
                            </p>

                            <p className="text-lg text-gray-700 mb-10 leading-relaxed font-light max-w-2xl mx-auto lg:mx-0">
                                {t('agenyz.page.description') || 'Discover the power of biohacking with Agenyz. These supplements are designed to work at the cellular level, restoring energy, immunity, and youthfulness from the inside out.'}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link href="/booking">
                                    <Button 
                                        size="xl"
                                        className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-medium px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl border-none hover:scale-105"
                                    >
                                        {t('common.bookNow')}
                                    </Button>
                                </Link>
                                <a
                                    href="https://agenyz.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button 
                                        size="xl"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl border-none hover:scale-105"
                                    >
                                        {t('agenyz.cta.visitStore') || 'Visit Agenyz Store'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </a>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                             <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-duration-500" />
                                <img
                                    src="https://images.pexels.com/photos/3618606/pexels-photo-3618606.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    alt="Advanced supplements and cellular nutrition"
                                    className="relative w-full h-auto aspect-[4/3] object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/20">
                                    <div className="flex items-center space-x-3">
                                        <span className="relative flex h-3 w-3">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">{t('agenyz.hero.available') || 'Available for Order'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-light text-gray-900 mb-6">
                            {t('agenyz.why.title') || 'Why Agenyz?'}
                        </h2>
                        <p className="text-xl text-gray-600 font-light">
                            {t('agenyz.why.subtitle') || 'Science-backed benefits for your body and mind.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-start space-x-6 p-8 bg-blue-50/50 rounded-3xl hover:bg-blue-50 transition-colors duration-300">
                            <div className="flex-shrink-0 p-4 bg-blue-100 rounded-2xl text-blue-600">
                                <Zap className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('agenyz.benefits.energy') || 'Infinite Energy'}</h3>
                                <p className="text-gray-600 leading-relaxed font-light">{t('agenyz.benefits.energy.desc') || 'Restores mitochondrial function for sustained daily energy.'}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6 p-8 bg-purple-50/50 rounded-3xl hover:bg-purple-50 transition-colors duration-300">
                            <div className="flex-shrink-0 p-4 bg-purple-100 rounded-2xl text-purple-600">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('agenyz.benefits.immunity') || 'Immune Shield'}</h3>
                                <p className="text-gray-600 leading-relaxed font-light">{t('agenyz.benefits.immunity.desc') || 'Strengthens your natural defenses against stress and pathogens.'}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6 p-8 bg-indigo-50/50 rounded-3xl hover:bg-indigo-50 transition-colors duration-300">
                            <div className="flex-shrink-0 p-4 bg-indigo-100 rounded-2xl text-indigo-600">
                                <Brain className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('agenyz.benefits.brain') || 'Cognitive Clarity'}</h3>
                                <p className="text-gray-600 leading-relaxed font-light">{t('agenyz.benefits.brain.desc') || 'Enhances focus, memory, and mental agility.'}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6 p-8 bg-pink-50/50 rounded-3xl hover:bg-pink-50 transition-colors duration-300">
                            <div className="flex-shrink-0 p-4 bg-pink-100 rounded-2xl text-pink-600">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-3">{t('agenyz.benefits.youth') || 'Cellular Youth'}</h3>
                                <p className="text-gray-600 leading-relaxed font-light">{t('agenyz.benefits.youth.desc') || 'Promotes regeneration and fights oxidative stress.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Catalogue Section */}
            <section className="py-24 bg-gray-50" id="catalogue">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block">
                            {t('agenyz.catalogue.subtitle') || 'Our Collection'}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                            {t('agenyz.catalogue.title') || 'Agenyz Product Catalogue'}
                        </h2>
                        <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
                            {t('agenyz.catalogue.desc') || 'Explore our comprehensive range of bio-additives and functional foods designed for your cellular health.'}
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                    selectedCategory === category
                                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <motion.div 
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence>
                            {filteredProducts.map((product) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={product.id}
                                    className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group"
                                >
                                    <div className="mb-6 flex items-start justify-between">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                                            {product.category}
                                        </span>
                                        {/* Placeholder for Product Icon/Image */}
                                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-light text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">
                                        {product.name}
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6 flex-grow leading-relaxed font-light">
                                        {product.description}
                                    </p>

                                    {product.features && (
                                        <ul className="space-y-2 mb-8">
                                            {product.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-sm text-gray-500">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between mt-auto">
                                        <span className="text-sm font-medium text-gray-400">Available via Consult</span>
                                        <Link href="/booking">
                                            <Button size="sm" className="bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200">
                                                Inquire <ArrowRight className="ml-2 w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    <div className="mt-20 text-center">
                        <Link href="/contact">
                            <div className="inline-flex items-center justify-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                                <span>Need help choosing?</span>
                                <span className="font-medium underline decoration-1 underline-offset-4">Get a personalized recommendation</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
