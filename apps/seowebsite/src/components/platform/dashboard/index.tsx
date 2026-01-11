'use client';

import React from 'react';
import { useAuth } from '@/context/platform/auth-context';
import { UserDashboard } from './user-dashboard';
import { TherapistDashboard } from './therapist-dashboard';

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (user?.role?.name === 'therapist') {
    return <TherapistDashboard />;
  }

  return <UserDashboard />;
}
