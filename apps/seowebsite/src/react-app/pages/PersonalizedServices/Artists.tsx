import SEOHead from '@/react-app/components/SEOHead';
import { Clock } from 'lucide-react';
import { Link } from 'react-router';
import Image from 'next/image';
import { Button } from 'keep-react';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import LazyImage from '@/react-app/components/LazyImage';

export default function Artists() {
  const { t } = useLanguage();

  return (
    <>
      <SEOHead
        title={t('artists.seo.title')}
        description={t('artists.seo.desc')}
        keywords={t('artists.seo.keywords')}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center mask-[linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-6">
                <span className="text-blue-700 font-medium text-sm">{t('nav.personalizedServices')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground mb-6 leading-tight">
                {t('nav.artists')}
              </h1>

              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {t('artists.hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full transition-colors duration-200 inline-block text-center"
                >
                  {t('common.reserveSession')}
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <LazyImage
                  src="https://images.unsplash.com/photo-1599447421405-0c325d26d77e?w=1920&h=1080&fit=crop"
                  alt={t('nav.artists')}
                  className="w-full h-[400px] sm:h-[500px] object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems & Benefits */}
      <section className="apple-section bg-card">
        <div className="apple-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Problems */}
            <div>
              <h2 className="apple-headline mb-8 text-red-600">
                {t('artists.challenges.title')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('artists.challenge1.title')}</h3>
                    <p className="text-muted-foreground">{t('artists.challenge1.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('artists.challenge2.title')}</h3>
                    <p className="text-muted-foreground">{t('artists.challenge2.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-red-500 rounded-full mt-2 mr-4 shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('artists.challenge3.title')}</h3>
                    <p className="text-muted-foreground">{t('artists.challenge3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="apple-headline mb-8 text-green-600">
                {t('artists.help.title')}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('artists.help1.title')}</h3>
                    <p className="text-muted-foreground">{t('artists.help1.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('artists.help2.title')}</h3>
                    <p className="text-muted-foreground">{t('artists.help2.desc')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-4 shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{t('artists.help3.title')}</h3>
                    <p className="text-muted-foreground">{t('artists.help3.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="apple-section bg-yellow-50">
        <div className="apple-container text-center">
          <div className="squircle-card bg-card p-12 max-w-4xl mx-auto">
            <h2 className="apple-headline mb-6 text-yellow-600">
              {t('artists.result.title')}
            </h2>
            <p className="apple-subtitle mb-8">
              {t('artists.result.desc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-light text-yellow-600 mb-2">88%</div>
                <div className="text-muted-foreground">{t('artists.stats.confidence')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-yellow-600 mb-2">82%</div>
                <div className="text-muted-foreground">{t('artists.stats.tension')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-light text-yellow-600 mb-2">76%</div>
                <div className="text-muted-foreground">{t('artists.stats.anxiety')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Card */}
      <section className="apple-section bg-card">
        <div className="apple-container-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="squircle-image aspect-4/3 relative">
              <Image
                src="https://images.unsplash.com/photo-1544367563-121542f85488?w=800&auto=format&fit=crop"
                alt="Sessió de teràpia per a artistes"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div>
              <h3 className="apple-title mb-6">
                {t('artists.session.title')}
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-muted-foreground mr-3" />
                  <span className="text-foreground/90">1 {t('common.hour')}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl font-light text-foreground">70€</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/booking"
                  className="flex-1 inline-flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-2xl font-medium transition-colors"
                >
                  {t('artists.session.cta')}
                </Link>
                <Link to="/services" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full border-border text-foreground/90 hover:bg-muted/30 px-6 py-3 rounded-2xl font-medium"
                  >
                    {t('artists.session.other')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
}

