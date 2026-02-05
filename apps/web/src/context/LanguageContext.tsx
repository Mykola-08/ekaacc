'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ca' | 'en' | 'es' | 'ru';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  showLanguagePopup: boolean;
  setShowLanguagePopup: (show: boolean) => void;
  confirmLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.about': 'About',
    'nav.login': 'Log in',
    'nav.book': 'Book Appointment',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.signout': 'Sign out',
    'nav.account': 'My Account',
    'hero.title': 'Wellness, Reimagined.',
    'hero.subtitle': 'Discover a sanctuary for your mind and body. Book your next session with ease.',
    'dashboard.welcome': 'Welcome back',
    'dashboard.wallet': 'Wallet Balance',
    'dashboard.upcoming': 'Upcoming Session',
    'dashboard.book_next': 'Book Next Session',
    'status.confirmed': 'Confirmed',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'therapist.view_calendar': 'View Calendar',
    'therapist.add_block': 'Add Block',
    'therapist.total_bookings': 'Total Bookings',
    'therapist.for_today': 'For today',
    'therapist.sessions_confirmed': 'Sessions confirmed',
    'therapist.awaiting_action': 'Awaiting action',
    'therapist.today_schedule': 'Today\'s Schedule',
    'therapist.no_bookings': 'No bookings for today',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.about': 'Sobre mí',
    'nav.login': 'Iniciar sesión',
    'nav.book': 'Reservar Cita',
    'nav.dashboard': 'Panel',
    'nav.settings': 'Ajustes',
    'nav.signout': 'Cerrar sesión',
    'nav.account': 'Mi Cuenta',
    'hero.title': 'Bienestar, Reimaginado.',
    'hero.subtitle': 'Descubre un santuario para tu mente y cuerpo. Reserva tu próxima sesión con facilidad.',
    'dashboard.welcome': 'Bienvenido de nuevo',
    'dashboard.wallet': 'Saldo',
    'dashboard.upcoming': 'Próxima Sesión',
    'dashboard.book_next': 'Reservar Siguiente',
    'status.confirmed': 'Confirmada',
    'status.pending': 'Pendiente',
    'status.completed': 'Completada',
    'status.cancelled': 'Cancelada',
    'therapist.view_calendar': 'Ver Calendario',
    'therapist.add_block': 'Añadir Bloque',
    'therapist.total_bookings': 'Total Reservas',
    'therapist.for_today': 'Para hoy',
    'therapist.sessions_confirmed': 'Sesiones confirmadas',
    'therapist.awaiting_action': 'Pendiente de acción',
    'therapist.today_schedule': 'Agenda de hoy',
    'therapist.no_bookings': 'No hay reservas hoy',
  },
  ca: {
    'nav.home': 'Inici',
    'nav.services': 'Serveis',
    'nav.about': 'Sobre mí',
    'nav.login': 'Iniciar sessió',
    'nav.book': 'Reservar Cita',
    'nav.dashboard': 'Tauler',
    'nav.settings': 'Configuració',
    'nav.signout': 'Tancar sessió',
    'nav.account': 'El meu Compte',
    'hero.title': 'Benestar, Reimaginat.',
    'hero.subtitle': 'Descobreix un santuari per a la teva ment i cos. Reserva la teva propera sessió amb facilitat.',
    'therapist.view_calendar': 'Veure Calendari',
    'therapist.add_block': 'Afegir Bloc',
    'therapist.total_bookings': 'Total Reserves',
    'therapist.for_today': 'Per avui',
    'therapist.sessions_confirmed': 'Sessions confirmades',
    'therapist.awaiting_action': 'Pendent d\'acció',
    'therapist.today_schedule': 'Agenda d\'avui',
    'therapist.no_bookings': 'No hi ha reserves avui',
    'dashboard.welcome': 'Benvingut de nou',
    'dashboard.wallet': 'Saldo',
    'dashboard.upcoming': 'Properament',
    'dashboard.book_next': 'Reservar Següent',
    'status.confirmed': 'Confirmada',
    'status.pending': 'Pendent',
    'status.completed': 'Completada',
    'status.cancelled': 'Cancel·lada',
  },
  ru: {
    'nav.home': 'Главная',
    'nav.services': 'Услуги',
    'nav.about': 'Обо мне',
    'nav.login': 'Войти',
    'nav.book': 'Записаться',
    'nav.dashboard': 'Кабинет',
    'nav.settings': 'Настройки',
    'nav.signout': 'Выйти',
    'nav.account': 'Мой Аккаунт',
    'hero.title': 'Велнес, переосмысленный.',
    'hero.subtitle': 'Откройте убежище для вашего разума и тела. Забронируйте следующий сеанс с легкостью.',
    'therapist.view_calendar': 'Календарь',
    'therapist.add_block': 'Добавить блок',
    'therapist.total_bookings': 'Всего бронирований',
    'therapist.for_today': 'На сегодня',
    'therapist.sessions_confirmed': 'Сеансов подтверждено',
    'therapist.awaiting_action': 'Ожидает действия',
    'therapist.today_schedule': 'Расписание на сегодня',
    'therapist.no_bookings': 'Нет бронирований на сегодня',
    'dashboard.welcome': 'С возвращением',
    'dashboard.wallet': 'Баланс',
    'dashboard.upcoming': 'Предстоящая сессия',
    'dashboard.book_next': 'Забронировать',
    'status.confirmed': 'Подтверждено',
    'status.pending': 'В ожидании',
    'status.completed': 'Завершено',
    'status.cancelled': 'Отменено',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);

  useEffect(() => {
    // Try to get from localStorage or browser
    const stored = localStorage.getItem('language') as Language;
    if (stored && translations[stored]) {
      setLanguage(stored);
    } else {
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguage(browserLang);
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const confirmLanguage = () => {
    setShowLanguagePopup(false);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, showLanguagePopup, setShowLanguagePopup, confirmLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
