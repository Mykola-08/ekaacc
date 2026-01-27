'use client';

import React from 'react';
import { useAuth } from '@/contexts/platform/auth-context';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserDashboardHeadless as UserDashboard } from './user-dashboard-headless';
import { TherapistDashboardHeadless as TherapistDashboard } from './therapist-dashboard-headless';

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
