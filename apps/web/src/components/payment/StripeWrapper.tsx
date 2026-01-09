'use client';

import { ReactNode } from 'react';

interface StripeWrapperProps {
  children: ReactNode;
  clientSecret?: string;
}

export function StripeWrapper({ children, clientSecret }: StripeWrapperProps) {
  // Pass through children, ignoring Stripe context
  return <>{children}</>;
}
