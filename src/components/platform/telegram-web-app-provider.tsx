'use client';

import { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { validateAndLoginWithTelegram } from '@/server/telegram/auth-actions';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface IWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
}

interface TelegramWebAppContextState {
  webApp: IWebApp | null;
  user: ITelegramUser | null;
  isTelegram: boolean;
  isLoading: boolean;
}

const TelegramWebAppContext = createContext<TelegramWebAppContextState>({
  webApp: null,
  user: null,
  isTelegram: false,
  isLoading: true,
});

export function TelegramWebAppProvider({ children }: { children: React.ReactNode }) {
  const [webApp, setWebApp] = useState<IWebApp | null>(null);
  const [isTelegram, setIsTelegram] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, startLogin] = useTransition();
  const router = useRouter();

  useEffect(() => {
    // Need to handle this client-side only
    const initTelegram = () => {
      const tg = (window as any).Telegram?.WebApp;

      if (tg && tg.initData) {
        setWebApp(tg);
        setIsTelegram(true);
        tg.ready();
        tg.expand();

        // Trigger automatic background login
        startLogin(async () => {
          try {
            const res = await validateAndLoginWithTelegram(tg.initData);
            if (res.success && res.redirectUrl) {
              // Only redirect if they aren't already on a deep link
              // or handle redirect explicitly.
              // We'll trust middleware/auth states but can force router refresh.
              router.refresh();
            }
          } catch (e) {
            console.error('Failed to auto-login with Telegram Web App', e);
          }
        });
      }
      setIsLoading(false);
    };

    // Wait a brief moment for the Telegram script to fully inject and parse
    // if it hasn't injected synchronously
    if ((window as any).Telegram?.WebApp) {
      initTelegram();
    } else {
      const timeoutFallbackId = setTimeout(() => {
        initTelegram();
      }, 500);

      return () => clearTimeout(timeoutFallbackId);
    }
  }, []);

  // Update document theme classes based on Telegram color scheme
  useEffect(() => {
    if (webApp) {
      if (webApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, [webApp]);

  return (
    <TelegramWebAppContext.Provider
      value={{
        webApp,
        user: webApp?.initDataUnsafe?.user ?? null,
        isTelegram,
        isLoading,
      }}
    >
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      {children}
    </TelegramWebAppContext.Provider>
  );
}

export const useTelegramWebApp = () => useContext(TelegramWebAppContext);
