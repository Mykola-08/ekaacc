'use client';

import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';
import { usePredictivePrefetch } from '@/hooks/usePredictivePrefetch';

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
  const { elementRef } = usePredictivePrefetch(props.href.toString(), { 
    threshold: prefetchThreshold 
  });

  return (
    <Link ref={elementRef as any} {...props}>
      {children}
    </Link>
  );
}
