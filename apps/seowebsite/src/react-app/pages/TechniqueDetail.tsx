import { useParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SEOHead from '@/react-app/components/SEOHead';
import Layout from '@/react-app/components/Layout';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function TechniqueDetail() {
  const { id } = useParams();
  const { t } = useLanguage();

  const techniqueMap: Record<string, string> = {
    'movement-lesson': 'technique.movement_lesson',
    'jka': 'technique.jka',
    'tmr': 'technique.tmr',
    'kgh': 'technique.kgh',
    'ke': 'technique.ke',
    'kb': 'technique.kb',
    'osteobalance': 'technique.osteobalance',
    'sujok': 'technique.sujok',
    'quiromasaje': 'technique.quiromasaje',
  };

  const baseKey = techniqueMap[id || ''];

  if (!baseKey) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-900">
          Technique not found
        </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${t(`${baseKey}.title`)} - Elena Kucherova`}
        description={t(`${baseKey}.desc`)}
        url={`https://ekabalance.com/technique/${id}`}
      />
      
      <Layout>
      <div className="bg-gray-50 min-h-screen text-gray-900 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/about-elena" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('technique.back')}
          </Link>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 mb-6">
              {t(`${baseKey}.title`)}
            </h1>
            
            <div className="prose prose-lg text-gray-600 max-w-none">
              <p>
                {t(`${baseKey}.desc`)}
              </p>
            </div>
            
            <div className="mt-12 p-8 bg-white rounded-3xl shadow-sm border border-orange-100">
               <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('technique.why')}</h3>
               <p className="text-gray-600">
                  {t(`${baseKey}.why`)}
               </p>
            </div>
          </motion.div>
        </div>
      </div>
      </Layout>
    </>
  );
}

