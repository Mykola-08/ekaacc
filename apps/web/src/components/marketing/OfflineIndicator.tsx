import { useOnlineStatus } from '@/react-app/hooks/useOnlineStatus';
import { useLanguage } from '@/context/LanguageContext';

export function OfflineIndicator() {
  const { isOnline } = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-sm font-medium z-50">
      ⚠️ {t('offline.message')}
    </div>
  );
}

