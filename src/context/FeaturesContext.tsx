'use client';

import { createContext, useContext, ReactNode } from 'react';

const FeaturesContext = createContext<Record<string, boolean>>({});

export function FeaturesProvider({
  children,
  features,
}: {
  children: ReactNode;
  features: Record<string, boolean>;
}) {
  return <FeaturesContext.Provider value={features}>{children}</FeaturesContext.Provider>;
}

export function useFeature(key: string) {
  const features = useContext(FeaturesContext);
  return features[key] ?? false;
}
