import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { useDiscount } from '@/react-app/contexts/DiscountContext';
import SEOHead from '@/react-app/components/SEOHead';
import { Tag, Users, Percent, Gift, Check, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { BOOKING_APP_URL } from '@/lib/config';

export default function Discounts() {
  const { t } = useLanguage();
  const { selectedDiscount, availableDiscounts, applyDiscount, removeDiscount } = useDiscount();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleApplyDiscount = async (code: string) => {
    const success = await applyDiscount(code);
    if (success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <>
      <SEOHead
        title={t('discounts.pageTitle')}
        description={t('discounts.pageDescription')}
      />
      
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center space-x-3 animate-slide-in">
            <Check className="w-5 h-5" />
            <span className="font-medium">{t('discounts.success')}</span>
          </div>
        )}

        {/* Active Discount Banner */}
        {selectedDiscount && (
          <div className="bg-linear-to-r from-green-500 to-green-600 text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5" />
                <span className="font-medium">
                  {selectedDiscount.name} {t('discounts.active').replace('{percentage}', selectedDiscount.percentage.toString())}
                </span>
              </div>
              <button
                onClick={removeDiscount}
                className="flex items-center space-x-2 bg-card/20 hover:bg-card/30 px-4 py-2 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-sm">{t('discounts.remove')}</span>
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative py-20 sm:py-32">
          <div className="absolute inset-0 bg-linear-to-r from-blue-600/5 to-purple-600/5" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-medium mb-8">
              <Tag className="w-4 h-4 mr-2" />
              {t('discounts.badge')}
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
              {t('discounts.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('discounts.subtitle')}
            </p>
          </div>
        </section>

        {/* Available Discounts */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t('discounts.availableTitle')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('discounts.availableSubtitle')}
              </p>
            </div>

            <div className="grid gap-8 md:gap-12">
              {availableDiscounts.map((discount) => (
                <div 
                  key={discount.id}
                  className="group relative bg-card rounded-3xl p-8 sm:p-12 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
                >
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 via-white to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Discount Badge */}
                  <div className="relative flex items-start justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Percent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {discount.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-bold text-blue-600">
                            {discount.percentage}%
                          </span>
                          <span className="text-muted-foreground font-medium">
                            {t('discounts.off')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {discount.isActive && (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        {t('discounts.active')}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="relative mb-8">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {discount.description}
                    </p>
                  </div>

                  {/* Discount Code */}
                  {discount.code && (
                    <div className="relative space-y-3">
                      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border-2 border-dashed border-border group-hover:border-blue-300 transition-colors duration-300">
                        <div className="flex items-center space-x-3">
                          <Gift className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-foreground/90">
                            {t('discounts.code')}:
                          </span>
                          <code className="text-lg font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                            {discount.code}
                          </code>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(discount.code || '')}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-foreground/90 text-sm font-medium rounded-xl transition-colors duration-200"
                        >
                          {t('discounts.copy')}
                        </button>
                      </div>
                      
                      {/* Apply Discount Button */}
                      {selectedDiscount?.code === discount.code ? (
                        <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-xl border border-green-200">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-green-700 font-medium">Descompte actiu</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyDiscount(discount.code || '')}
                          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
                        >
                          Aplicar aquest descompte
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Use Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t('discounts.howToUse.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('discounts.howToUse.subtitle')}
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t('discounts.step1.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('discounts.step1.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Tag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t('discounts.step2.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('discounts.step2.description')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Percent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {t('discounts.step3.title')}
                </h3>
                <p className="text-muted-foreground">
                  {t('discounts.step3.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                {t('discounts.cta.title')}
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                {t('discounts.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={BOOKING_APP_URL}
                  className="inline-flex items-center justify-center px-8 py-4 bg-card text-blue-600 font-semibold rounded-2xl hover:bg-muted/30 transition-colors duration-200"
                >
                  {t('discounts.cta.bookNow')}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 transition-colors duration-200"
                >
                  {t('discounts.cta.contact')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}


