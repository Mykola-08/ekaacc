'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/context/LanguageContext';
import { UserDashboard } from './UserDashboard';
import { TherapistDashboard } from './TherapistDashboard';

export default function Dashboard({
  upcomingSession,
  walletBalance,
}: {
  upcomingSession?: any;
  walletBalance?: number;
}) {
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
