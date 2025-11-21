'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
}

export function ShimmerButton({
  children,
  className,
  shimmerColor = 'rgba(255, 255, 255, 0.3)',
  shimmerSize = '200%',
  borderRadius = '0.5rem',
  shimmerDuration = '2s',
  background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'relative overflow-hidden px-6 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg',
        className
      )}
      style={{
        background,
        borderRadius,
      }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div
        className="absolute inset-0 animate-shimmer"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          backgroundSize: shimmerSize,
          animationDuration: shimmerDuration,
        }}
      />
    </button>
  );
}
