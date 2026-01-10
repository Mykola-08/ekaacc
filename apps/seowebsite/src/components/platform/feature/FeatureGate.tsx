"use client";
import React from 'react';
import { useStatsig } from '../providers/StatsigProvider';

interface FeatureGateProps {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function FeatureGate({ flag, children, fallback = null, loadingFallback = null }: FeatureGateProps) {
  const { ready, check } = useStatsig();
  if (!ready) return <>{loadingFallback}</>;
  return check(flag) ? <>{children}</> : <>{fallback}</>;
}