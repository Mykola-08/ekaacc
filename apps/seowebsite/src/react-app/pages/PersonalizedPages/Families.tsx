import SEOHead from '@/react-app/components/SEOHead';
import { Link } from 'react-router';
import Image from 'next/image';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function Families() {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead
        title={`${t('elena.target.families.title')} - EKA Balance`}
        description={t('elena.target.families.desc')}
        url="https://ekabalance.com/services/families"
      />
      
      {/* Hero Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full mb-6">
                <span className="text-green-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight">
                {t('elena.target.families.title')}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {t('elena.target.families.desc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  className="bg-[#FFB405] hover:bg-[#e8a204] text-[#000035] font-semibold px-8 py-4 rounded-full transition-colors duration-200 inline-block text-center"
                >
                  {t('common.reserveSession')}
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative h-[400px] sm:h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=1920&h=1080&fit=crop"
                  alt={t('elena.target.families.title')}
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

