import SEOOptimized from '@/react-app/components/SEOOptimized';
import Layout from '@/react-app/components/Layout';
import ContactFormOptimized from '@/react-app/components/ContactFormOptimized';
import { MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { Button } from 'keep-react';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <SEOOptimized
      title={t('seo.contact.title')}
      description={t('seo.contact.description')}
      keywords={t('seo.contact.keywords')}
      url="https://ekabalance.com/contact"
    >
      <Layout>
        {/* Unified Gradient Hero */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-card/80 backdrop-blur-sm border border-blue-100 rounded-full mb-8 shadow-sm">
              <MessageCircle className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-blue-700 font-medium text-sm tracking-wide uppercase">{t('contact.hero.badge')}</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-foreground mb-8 leading-tight tracking-tight">
              {t('contact.hero.title')}{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">{t('contact.hero.titleHighlight')}</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              {t('contact.hero.description')}
            </p>

            {/* Quick contact options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="https://wa.me/34658867133"
                target="_blank"
                rel="noopener noreferrer"
              >
                  <Button 
                    size="xl"
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white font-medium px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl border-none"
                  >
                    <MessageCircle className="w-6 h-6 mr-2" />
                    {t('contact.whatsapp')}
                  </Button>
              </a>
              <a href="tel:+34658867133">
                 <Button 
                    size="xl"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl border-none"
                 >
                    <Phone className="w-6 h-6 mr-2" />
                    {t('contact.callNow')}
                 </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-24 bg-card relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="bg-card rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
               <ContactFormOptimized />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-muted/30/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <h2 className="text-3xl font-light text-foreground mb-12 text-center">
              {t('contact.faq.title')}
            </h2>
            
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-card rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="font-medium text-foreground mb-3 text-lg">{t(`contact.faq.q${i}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed font-light">
                      {t(`contact.faq.q${i}.answer`)}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </SEOOptimized>
  );
}

