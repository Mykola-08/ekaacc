'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function AnimatedGradientText({
  children,
  className,
  ...props
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        'inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
