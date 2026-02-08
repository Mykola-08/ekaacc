'use client';

import React from 'react';
import { cn } from '@/lib/platform/utils/css-utils';

interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function AnimatedGradientText({ children, className, ...props }: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'animate-gradient inline-block bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
