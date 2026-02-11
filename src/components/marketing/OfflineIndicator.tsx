import { useOnlineStatus } from '@/hooks/marketing/useOnlineStatus';
import { useLanguage } from '@/context/marketing/LanguageContext';

export function OfflineIndicator() {
  const { isOnline } = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 bg-warning py-2 text-center text-sm font-medium text-white">
      ⚠️ {t('offline.message')}
    </div>
  );
}
