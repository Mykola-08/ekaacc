import SEOHead from '@/react-app/components/SEOHead';
import { Link } from 'react-router';
import Image from 'next/image';
import { Button } from 'keep-react';
import { Sparkles, Zap, Shield, Brain, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function AgenyzPage() {
    const { t } = useLanguage();

    return (
        <>
            <SEOHead
                title="Agenyz - Cellular Nutrition"
                description="Biohacking and advanced supplements for cellular regeneration."
                keywords="agenyz, supplements, biohacking, cellular nutrition"
            />

            {/* Hero Section - Unified Gradient */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
                                <Link to="/booking">
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
                             <div className="relative group aspect-[4/3]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-duration-500" />
                                <Image
                                    src="https://images.pexels.com/photos/3618606/pexels-photo-3618606.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                    alt="Advanced supplements and cellular nutrition"
                                    fill
                                    className="object-cover rounded-[2.5rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                                    sizes="(max-width: 768px) 100vw, 50vw"
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
        </>
    );
}

