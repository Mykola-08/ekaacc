'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/react-app/contexts/LanguageContext';
import { UserDashboard } from './user-dashboard';
import { TherapistDashboard } from './therapist-dashboard';

export default function Dashboard({ upcomingSession, walletBalance }: { upcomingSession?: any, walletBalance?: number }) {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  if (user?.role?.name === 'therapist') {
    return <TherapistDashboard />;
  }

  return <UserDashboard upcomingSession={upcomingSession} walletBalance={walletBalance} />;
}
