import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/marketing/hooks/useToast';

export function useOnlineStatus() {
  const toast = useToast();
  const toastRef = useRef(toast);
  const wasOfflineRef = useRef(false);

  const [isOnline, setIsOnline] = useState(() => (
    typeof navigator === 'undefined' ? true : navigator.onLine
  ));
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);

      if (wasOfflineRef.current) {
        toastRef.current.success?.('Connexió restaurada', "Ja pots continuar utilitzant l'aplicació");
        wasOfflineRef.current = false;
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      wasOfflineRef.current = true;
      setWasOffline(true);
      toastRef.current.warning?.('Sense connexió', 'Algunes funcions poden no estar disponibles');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, wasOffline };
}
