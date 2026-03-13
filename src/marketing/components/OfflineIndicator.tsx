import { useEffect, useRef } from 'react';
import { useIsOnline } from '@/hooks/use-is-online';
import { useLanguage } from '@/marketing/contexts/LanguageContext';
import { useToast } from '@/marketing/hooks/useToast';

export function OfflineIndicator() {
  const isOnline = useIsOnline();
  const { t } = useLanguage();
  const toast = useToast();

  const wasOfflineRef = useRef(false);

  useEffect(() => {
    if (!isOnline) {
      wasOfflineRef.current = true;
      toast.warning?.('Sense connexió', 'Algunes funcions poden no estar disponibles');
    } else if (wasOfflineRef.current) {
      toast.success?.('Connexió restaurada', "Ja pots continuar utilitzant l'aplicació");
      wasOfflineRef.current = false;
    }
  }, [isOnline, toast]);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 right-0 left-0 z-50 bg-amber-500 py-2 text-center text-sm font-medium text-white">
      ⚠️ {t('offline.message')}
    </div>
  );
}
