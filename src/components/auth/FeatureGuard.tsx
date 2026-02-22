'use client';

import { useFeature } from '@/context/FeaturesContext';
import { ReactNode } from 'react';

interface FeatureGuardProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGuard({ feature, children, fallback = null }: FeatureGuardProps) {
  const isEnabled = useFeature(feature);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
