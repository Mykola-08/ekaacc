'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { useLanguage } from '@/context/LanguageContext';
import { BentoDashboard } from './bento-dashboard';

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

  return (
    <BentoDashboard
      user={
        user
          ? {
              name: user.email?.split('@')[0] || 'User', // Fallback name logic if name missing
              email: user.email || '',
            }
          : undefined
      }
    />
  );
}
