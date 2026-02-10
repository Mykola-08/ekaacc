'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Wifi01Icon, WifiDisconnected01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

/**
 * Morphing online/offline status indicator.
 * Shows an animated banner instead of toasts.
 */
export function OnlineStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasEverOffline, setWasEverOffline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      if (wasEverOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasEverOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasEverOffline]);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="fixed top-0 right-0 left-0 z-[200] overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-white">
            <HugeiconsIcon icon={WifiDisconnected01Icon} className="size-4" />
            <span>You&apos;re offline. Some features may not be available.</span>
          </div>
        </motion.div>
      )}

      {showReconnected && isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          className="fixed top-0 right-0 left-0 z-[200] overflow-hidden"
        >
          <div className="flex items-center justify-center gap-2 bg-emerald-500 px-4 py-2 text-sm font-medium text-white">
            <HugeiconsIcon icon={Wifi01Icon} className="size-4" />
            <span>Connection restored</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
