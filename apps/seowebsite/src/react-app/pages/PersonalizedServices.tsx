import SEOHead from '@/react-app/components/SEOHead';
import { Link } from 'react-router';
import { Button } from '@ekaacc/shared-ui';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { PERSONALIZED_SERVICES_DATA } from '@/shared/constants';
import { ArrowRight, UserRound, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import LazyImage from '@/react-app/components/LazyImage';

export default function PersonalizedServices() {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead
        title={t('personalizedServices.title')}
        description={t('personalizedServices.subtitle')}
        keywords="personalized services, office workers, athletes, artists, musicians, students"
      />
      
      {/* Unified Gradient Hero */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
             <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-border/30 shadow-sm mb-8">
              <span className="text-sm font-medium text-primary uppercase tracking-wider">
                {t('personalizedServices.title')}
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-light text-foreground mb-8 tracking-tight leading-tight">
              {t('services.therapiesFor')}{' '}
              <span className="font-medium bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('services.integralWellbeing')}
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light">
              {t('personalizedServices.subtitle')}
            </p>

            <Link to="/booking">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-xl border-none"
              >
                {t('personalizedServices.cta')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service List - Unified Design with Services.tsx */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
           <div className="text-center mb-24">
            <h2 className="text-4xl font-light text-foreground mb-6">
              {t('personalizedServices.choose.title')}
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
              {t('personalizedServices.choose.subtitle')}
            </p>
          </div>

           <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:gap-24">
              {PERSONALIZED_SERVICES_DATA.map((service, index) => {
                 // Alternate direction for better flow
                 const isEven = index % 2 === 0;

                 return (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.3 }}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
                  >
                      {/* Image Side */}
                      <div className="w-full lg:w-1/2">
                          <Link to={service.href} className="block relative rounded-3xl overflow-hidden shadow-2xl group">
                            <LazyImage 
                              src={service.image} 
                              alt={t(service.titleKey)}
                              className="w-full h-auto object-cover aspect-4/3 transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent group-hover:from-black/50 transition-colors duration-500"></div>
                            
                            {/* Floating Badge */}
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="inline-flex items-center px-4 py-2 bg-card/90 backdrop-blur-md rounded-full shadow-lg">
                                  <span className="text-foreground font-medium">{t(service.titleKey)}</span>
                                  <ArrowUpRight className="ml-2 w-4 h-4 text-foreground" />
                                </div>
                            </div>
                          </Link>
                      </div>

                      {/* Content Side */}
                      <div className="w-full lg:w-1/2 lg:px-8">
                          <div className={`inline-flex items-center p-3 rounded-2xl bg-blue-50 mb-6`}>
                             <UserRound className={`w-8 h-8 text-blue-600`} />
                          </div>

                          <h3 className="text-3xl font-light text-foreground mb-6">
                            {t(service.titleKey)}
                          </h3>
                          
                          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            {t(service.descriptionKey)}
                          </p>

                          <div className="flex flex-col sm:flex-row gap-4">
                             <Link to={service.href}>
                                <Button 
                                  className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all shadow-md hover:shadow-lg border-none`}
                                >
                                  {t('common.readMore')}
                                </Button>
                             </Link>
                             
                             <Link to="/booking">
                                <Button 
                                  variant="outline"
                                  className="border-gray-300 hover:bg-muted/30 text-foreground/90 px-8 py-3 rounded-xl transition-all"
                                >
                                  {t('common.bookNow')}
                                </Button>
                             </Link>
                          </div>
                      </div>
                  </motion.div>
                 );
              })}
           </div>
        </div>
      </section>
    </>
  );
}



