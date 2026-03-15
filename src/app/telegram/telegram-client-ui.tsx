'use client';

import { useTelegramWebApp } from '@/components/platform/telegram-web-app-provider';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function TelegramClientUI() {
  const { webApp, isTelegram } = useTelegramWebApp();
  const router = useRouter();

  useEffect(() => {
    if (isTelegram && webApp) {
      // Show native back button if we are deep in the app
      if (window.history.length > 2 || window.location.pathname !== '/telegram') {
        webApp.BackButton.show();
        webApp.BackButton.onClick(() => {
          router.back();
        });
      } else {
        webApp.BackButton.hide();
      }

      // Configure main button as "Nova Reserva" maybe, or hide it
      webApp.MainButton.hide();

      // Haptic feedback for nice feel when landing
      webApp.HapticFeedback.impactOccurred('light');
    }

    return () => {
      if (webApp) {
        webApp.BackButton.offClick(() => router.back());
      }
    };
  }, [isTelegram, webApp, router]);

  return null;
}
