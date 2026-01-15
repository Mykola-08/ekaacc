import SEOHead from '@/react-app/components/SEOHead';
import { Link } from 'react-router';
import { Heart, Brain, Leaf, RotateCcw, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { SERVICES_DATA } from '@/shared/constants';
import { motion } from 'framer-motion';
import { Button } from 'keep-react';
import LazyImage from '@/react-app/components/LazyImage';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Leaf,
  RotateCcw
};

export default function Services() {
  const { t } = useLanguage();


  const getColorClasses = (color: string) => {
    const colors = {
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-600',
        iconBg: 'bg-orange-100',
        button: 'bg-orange-500 hover:bg-orange-600',
        text: 'text-orange-600'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-600',
        iconBg: 'bg-blue-100',
        button: 'bg-blue-500 hover:bg-blue-600',
        text: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-600',
        iconBg: 'bg-green-100',
        button: 'bg-green-500 hover:bg-green-600',
        text: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-600',
        iconBg: 'bg-purple-100',
        button: 'bg-purple-500 hover:bg-purple-600',
        text: 'text-purple-600'
      },
      pink: {
        bg: 'bg-pink-50',
        border: 'border-pink-200',
        icon: 'text-pink-600',
        iconBg: 'bg-pink-100',
        button: 'bg-pink-500 hover:bg-pink-600',
        text: 'text-pink-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.orange;
  };

  return (
    <>
      <SEOHead
        title={t('seo.services.title')}
        description={t('seo.services.description')}
        keywords={t('seo.services.keywords')}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-card/80 backdrop-blur-sm border border-blue-100 rounded-full mb-8 shadow-sm">
              <Heart className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">{t('services.integralWellbeingFor')}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-foreground mb-8 leading-tight">
              {t('services.ourServices')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium">
                {t('services.ourServices2') || 'Therapies'}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              {t('services.wellnessPath')}
            </p>

            <div className="flex justify-center">
              <Link
                to="/booking"
              >
                 <Button 
                  size="xl" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-medium transition-all duration-300 hover:scale-105 shadow-xl border-none"
                >
                  {t('common.bookNow')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
           <div className="grid grid-cols-1 gap-12 sm:gap-16 lg:gap-24">
              {SERVICES_DATA.map((service, index) => {
                 const colorClass = getColorClasses(service.color);
                 const Icon = iconMap[service.iconName] || Heart;
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
                          <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl group">
                            <LazyImage 
                              src={service.image} 
                              alt={t(service.titleKey)}
                              className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          </div>
                      </div>

                      {/* Content Side */}
                      <div className="w-full lg:w-1/2 lg:px-8">
                          <div className={`inline-flex items-center p-3 rounded-2xl ${colorClass.iconBg} mb-6`}>
                             <Icon className={`w-8 h-8 ${colorClass.icon}`} />
                          </div>
                          
                          <h2 className="text-3xl sm:text-4xl font-light text-foreground mb-4">
                            {t(service.titleKey)}
                          </h2>
                          <div className={`h-1 w-20 rounded-full ${colorClass.bg.replace('bg-', 'bg-gradient-to-r from-').replace('-50', '-400')} to-gray-200 mb-6`}></div>

                          <p className="text-xl text-foreground/90 mb-8 leading-relaxed font-light">
                            {t(service.descriptionKey)}
                          </p>
                          
                          {service.benefitsKeys && (
                            <ul className="mb-8 space-y-3">
                              {service.benefitsKeys.slice(0, 3).map((benefitKey) => (
                                <li key={benefitKey} className="flex items-start">
                                  <div className={`p-1 rounded-full ${colorClass.bg} mr-3 mt-1`}>
                                     <ArrowRight className={`w-3 h-3 ${colorClass.icon}`} />
                                  </div>
                                  <span className="text-muted-foreground">{t(benefitKey)}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex flex-wrap gap-4">
                             <Link to={service.href}>
                               <Button className={`${colorClass.button} border-none rounded-xl px-6 py-3 transition-transform hover:-translate-y-1`}>
                                  {t('common.readMore')}
                               </Button>
                             </Link>
                             
                             <Link to="/booking">
                                <Button variant="outline" className="rounded-xl px-6 py-3 border-border hover:bg-muted/30 text-foreground/90 transition-transform hover:-translate-y-1">
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

      {/* Disclaimer */}
      <section className="py-16 bg-muted/30 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <span className="font-semibold">{t('services.disclaimerPrefix')}:</span> {t('services.disclaimerBody')}
          </p>
        </div>
      </section>
    </>
  );
}


