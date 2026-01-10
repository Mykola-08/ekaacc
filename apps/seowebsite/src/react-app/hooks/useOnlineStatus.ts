import { useState, useEffect } from 'react';
import { useToast } from '@/react-app/hooks/useToast';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success('Connexió restaurada', 'Ja pots continuar utilitzant l\'aplicació');
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.warning('Sense connexió', 'Algunes funcions poden no estar disponibles');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline, toast]);

  return { isOnline, wasOffline };
}

// Component to show offline indicator - create this as a separate .tsx file
