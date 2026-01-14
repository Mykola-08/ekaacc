 
import { useParams, Link } from 'react-router';
import { ArrowLeft, ArrowRight, CheckCircle, Heart, Brain, Zap, Moon, Activity, Stethoscope, Shield } from 'lucide-react';
import SEOOptimized from '@/react-app/components/SEOOptimized';
import { useLanguage } from '@/react-app/contexts/LanguageContext';


interface ProblemConfig {
  icon: React.ComponentType<any>;
  color: string;
  href: string;
  key: string;
}

export default function CasoDetail() {
  const { id } = useParams();

  const { language, t } = useLanguage();

  // Helper to get array from translations (handling 1-based index keys like .symptom1, .symptom2)
  const getArray = (baseKey: string) => {
    const items: string[] = [];
    let i = 1;
    while (true) {
      const key = `${baseKey}${i}`;
      const val = t(key);
      if (val === key || !val) break;
      items.push(val);
      i++;
    }
    return items;
  };

  const problemsConfig: Record<string, ProblemConfig> = {
    'back-pain': { icon: Activity, color: 'blue', href: '/services/massage', key: 'backPain' },
    'stress-anxiety': { icon: Brain, color: 'purple', href: '/services/kinesiology', key: 'stress' },
    'digestive-problems': { icon: Heart, color: 'green', href: '/services/nutrition', key: 'digestive' },
    'migraines': { icon: Brain, color: 'red', href: '/services/massage', key: 'migraines' },
    'low-energy': { icon: Zap, color: 'orange', href: '/services/kinesiology', key: 'lowEnergy' },
    'hormonal-problems': { icon: Shield, color: 'pink', href: '/services/kinesiology', key: 'hormonal' },
    'sleep-difficulties': { icon: Moon, color: 'indigo', href: '/services/kinesiology', key: 'sleep' },
    'injury-recovery': { icon: Stethoscope, color: 'red', href: '/services/massage', key: 'recovery' }
  };

  const config = id ? problemsConfig[id] : undefined;

  if (!config) {
    return (
      
        <div className="py-20 text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4">
            {language === 'ca' ? 'Problema no trobat' :
              language === 'es' ? 'Problema no encontrado' :
                language === 'en' ? 'Problem not found' :
                  'Проблема не найдена'}
          </h1>
          <Link to="/cases" className="text-blue-600 hover:text-blue-700">
            {t('casos.section.viewAll')}
          </Link>
        </div>
      
    );
  }

  const ProblemIcon = config.icon;
  const problemKey = config.key;

  const title = t(`casos.problems.${problemKey}.title`);
  const description = t(`casos.problems.${problemKey}.description`);
  const symptoms = getArray(`casos.problems.${problemKey}.symptom`);
  const causes = getArray(`casos.problems.${problemKey}.cause`);
  const treatment = t(`casos.problems.${problemKey}.treatment`);
  const results = t(`casos.problems.${problemKey}.results`);

  const successStoryKey = `casos.problems.${problemKey}.successStory`;
  const successStoryRaw = t(successStoryKey);
  const successStory = successStoryRaw !== successStoryKey ? successStoryRaw : null;



  const getBgGradient = (color: string) => {
    const gradients = {
      blue: 'from-blue-600 via-blue-700 to-indigo-700',
      purple: 'from-purple-600 via-purple-700 to-indigo-700',
      green: 'from-green-600 via-green-700 to-emerald-700',
      orange: 'from-orange-600 via-orange-700 to-red-700',
      indigo: 'from-indigo-600 via-indigo-700 to-purple-700',
      pink: 'from-pink-600 via-pink-700 to-purple-700',
      red: 'from-red-600 via-red-700 to-pink-700'
    };
    return gradients[color as keyof typeof gradients] || gradients.blue;
  };

  return (
    <SEOOptimized
      title={`${title} | EKA Balance`}
      description={`${description}`}
      keywords={`${title}, EKA Balance`}
      url={`https://ekabalance.com/cases/${id}`}
    >
      
        {/* Back navigation */}
        <div className="py-6 bg-muted/30 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <Link
              to="/cases"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('casos.section.viewAll')}
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <section className={`py-20 sm:py-28 bg-gradient-to-br ${getBgGradient(config.color)}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-card rounded-full mb-8 shadow-lg">
              <ProblemIcon className="w-10 h-10 text-foreground/90" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-white mb-6">
              {title}
            </h1>

            <p className="text-xl text-white/90 leading-relaxed">
              {description}
            </p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            {/* Symptoms */}
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-8">
                {language === 'ca' ? 'Símptomes típics' :
                  language === 'es' ? 'Síntomas típicos' :
                    language === 'en' ? 'Typical symptoms' :
                      'Типичные симптомы'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {symptoms.map((symptom, index) => (
                  <div key={index} className="flex items-start p-4 bg-muted/30 rounded-xl">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-4 mt-2 flex-shrink-0"></div>
                    <span className="text-foreground/90">{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Causes */}
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-8">
                {language === 'ca' ? 'Causes habituals' :
                  language === 'es' ? 'Causas habituales' :
                    language === 'en' ? 'Common causes' :
                      'Обычные причины'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {causes.map((cause, index) => (
                  <div key={index} className="flex items-start p-4 bg-blue-50 rounded-xl">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-4 mt-2 flex-shrink-0"></div>
                    <span className="text-foreground/90">{cause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Treatment */}
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-8">
                {language === 'ca' ? 'Com ho treballem' :
                  language === 'es' ? 'Cómo lo trabajamos' :
                    language === 'en' ? 'How we work' :
                      'Как мы работаем'}
              </h2>
              <div className="p-8 bg-green-50 rounded-2xl border border-green-200">
                <p className="text-foreground/90 leading-relaxed text-lg">
                  {treatment}
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-8">
                {language === 'ca' ? 'Resultats reals' :
                  language === 'es' ? 'Resultados reales' :
                    language === 'en' ? 'Real results' :
                      'Реальные результаты'}
              </h2>
              <div className="p-8 bg-yellow-50 rounded-2xl border border-yellow-200">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
                  <p className="text-foreground/90 leading-relaxed text-lg">
                    {results}
                  </p>
                </div>
              </div>
            </div>

            {/* Success Story */}
            {successStory && (
              <div className="mb-16">
                <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-8">
                  {language === 'ca' ? 'Cas d\'èxit' :
                    language === 'es' ? 'Caso de éxito' :
                      language === 'en' ? 'Success story' :
                        'История успеха'}
                </h2>
                <div className="p-8 bg-purple-50 rounded-2xl border border-purple-200">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-purple-700 font-semibold text-lg">💬</span>
                    </div>
                    <div>
                      <p className="text-foreground/90 leading-relaxed text-lg italic">
                        "{successStory}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-6">
              {language === 'ca' ? 'El teu cos recorda, però també sap guarir-se' :
                language === 'es' ? 'Tu cuerpo recuerda, pero también sabe curarse' :
                  language === 'en' ? 'Your body remembers, but it also knows how to heal' :
                    'Ваше тело помнит, но оно также знает, как исцеляться'}
            </h2>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              {language === 'ca' ? 'Si reconeixes aquests símptomes, no cal esperar més. Hem ajudat moltes persones a recuperar el seu benestar físic, mental i emocional.' :
                language === 'es' ? 'Si reconoces estos síntomas, no esperes más. Hemos ayudado a muchas personas a recuperar su bienestar físico, mental y emocional.' :
                  language === 'en' ? 'If you recognize these symptoms, don\'t wait any longer. We have helped many people recover their physical, mental, and emotional well-being.' :
                    'Если вы узнаете эти симптомы, не ждите больше. Мы помогли многим людям восстановить свое физическое, психическое и эмоциональное благополучие.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={config.href}
                className="bg-card text-foreground hover:bg-muted font-semibold px-8 py-4 rounded-full transition-colors duration-200 flex items-center justify-center"
              >
                {language === 'ca' ? 'Més informació sobre el tractament' :
                  language === 'es' ? 'Más información sobre el tratamiento' :
                    language === 'en' ? 'More information about the treatment' :
                      'Подробнее о лечении'}
              </Link>
              <Link
                to="/booking"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 rounded-full transition-colors duration-200 flex items-center justify-center"
              >
                {language === 'ca' ? 'Reserva la teva sessió' :
                  language === 'es' ? 'Reserva tu sesión' :
                    language === 'en' ? 'Book your session' :
                      'Забронировать сессию'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      
    </SEOOptimized>
  );
}

