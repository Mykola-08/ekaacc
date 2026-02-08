'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface PredictiveLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  prefetchThreshold?: number;
}

export function PredictiveLink({ 
  children, 
  prefetchThreshold = 150,
  ...props 
}: PredictiveLinkProps) {
  void prefetchThreshold;

  return (
    <Link {...props}>
      {children}
    </Link>
  );
}

