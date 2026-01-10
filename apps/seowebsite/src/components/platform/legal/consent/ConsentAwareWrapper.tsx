"use client";

import React from 'react';
import { useConsent } from '../../..//platform/useConsent';

interface ConsentAwareWrapperProps {
  children: React.ReactNode;
  category: 'analytics' | 'marketing' | 'functional';
}

export default function ConsentAwareWrapper({ children, category }: ConsentAwareWrapperProps) {
  const { preferences, isLoading } = useConsent();

  if (isLoading) {
    return null;
  }

  if (!preferences[category]) {
    return null;
  }

  return <>{children}</>;
}
