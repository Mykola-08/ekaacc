import SEOOptimized from '@/react-app/components/SEOOptimized';
import PersonalizedOnboarding from '@/react-app/components/PersonalizedOnboarding';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

export default function FirstTimeVisitor() {
  const { t } = useLanguage();
  
  return (
    <SEOOptimized
      title={t('firstTime.seo.title')}
      description={t('firstTime.seo.desc')}
      keywords={t('firstTime.seo.keywords')}
      url="https://ekabalance.com/first-time"
    >
      <PersonalizedOnboarding />
    </SEOOptimized>
  );
}

