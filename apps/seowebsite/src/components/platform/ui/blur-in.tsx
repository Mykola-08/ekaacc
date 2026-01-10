'use client';

import React from 'react';
import { cn } from '@/lib/platform/utils';

interface BlurInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export function BlurIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  ...props
}: BlurInProps) {
  return (
    <div
      className={cn('animate-blur-in', className)}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
