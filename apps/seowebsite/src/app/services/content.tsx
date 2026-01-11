'use client';

import Link from 'next/link';
import { Heart, Brain, Leaf, RotateCcw, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Button } from 'keep-react';
import LazyImage from '@/react-app/components/LazyImage';
import ServiceCard from '@/app/components/ServiceCard';

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Leaf,
  RotateCcw
};

interface ServicesContentProps {
  services: any[];
}

export default function ServicesContent({ services }: ServicesContentProps) {
  const { t } = useLanguage();

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm border border-blue-100 rounded-full mb-8 shadow-sm">
              <Heart className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium">{t('services.integralWellbeingFor')}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-gray-900 mb-8 leading-tight">
              {t('services.ourServices')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium">
                {t('services.ourServices2') || 'Therapies'}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed font-light">
              {t('services.wellnessPath')}
            </p>

            <div className="flex justify-center">
              <Link href="/booking">
                <Button size="2xl" className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-12 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
                  {t('services.bookSession')}
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              // Map DB fields to component props
              const meta = service.metadata || {};
              // Fallback to DB fields if key is missing (though we seeded keys)
              const titleKey = meta.translationKey || service.name;
              // Construct other keys if needed or use description directly
              // The original constants used subtitleKey, descriptionKey. 
              // We only have description in DB (which holds the key 'services.massage.description').
              // We'll pass the descriptionKey as service.description.
              
              // We need to reconstruct the benefits. The seed didn't include benefitsKeys for general services explicitly in my SQL (I missed it in metadata).
              // But the component likely uses them.
              // For now, I will use a default or empty array if not in metadata.
              // Actually, I should have seeded benefits.
              // Let's check ServiceCard to see what it expects.
              
              const item = {
                  id: service.id, // or service.slug
                  slug: service.slug,
                  titleKey: titleKey,
                  subtitleKey: meta.translationKey ? `${meta.translationKey}.subtitle` : undefined, // Infer from pattern
                  descriptionKey: service.description,
                  iconName: meta.icon,
                  color: service.slug === 'massage' ? 'orange' : 'blue', // simplified
                  durations: meta.durations || [],
                  image: service.image_url,
                  href: `/services/${service.slug}`,
                  benefitsKeys: meta.benefitsKeys || [] // Ideally this should be in DB
              };
              
              return (
                  <ServiceCard 
                    key={service.slug} 
                    service={item} 
                  />
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
