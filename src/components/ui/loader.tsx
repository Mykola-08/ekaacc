'use client';

import { cn } from '@/lib/utils';
import React from 'react';

export interface LoaderProps {
  variant?:
    | 'circular'
    | 'classic'
    | 'pulse'
    | 'pulse-dot'
    | 'dots'
    | 'typing'
    | 'wave'
    | 'bars'
    | 'text-shimmer'
    | 'loading-dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function DotsLoader({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dotSizes = {
    sm: 'h-1 w-1',
    md: 'h-1.5 w-1.5',
    lg: 'h-2 w-2',
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-primary animate-[dots_1.4s_ease-in-out_infinite] rounded-full',
            dotSizes[size]
          )}
          style={{
            animationDelay: `${i * 160}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TypingLoader({
  className,
  size = 'md',
}: {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const dotSizes = {
    sm: 'h-1 w-1',
    md: 'h-1.5 w-1.5',
    lg: 'h-2 w-2',
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn('bg-primary animate-[typing_1s_infinite] rounded-full', dotSizes[size])}
          style={{
            animationDelay: `${i * 250}ms`,
          }}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TextShimmerLoader({
  text = 'Thinking',
  className,
  size = 'md',
}: {
  text?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div
      className={cn(
        'bg-[linear-gradient(to_right,var(--muted-foreground)_40%,var(--foreground)_60%,var(--muted-foreground)_80%)]',
        'bg-[length:200%_auto] bg-clip-text font-medium text-transparent',
        'animate-[shimmer_4s_infinite_linear]',
        textSizes[size],
        className
      )}
    >
      {text}
    </div>
  );
}

export function TextDotsLoader({
  className,
  text = 'Thinking',
  size = 'md',
}: {
  className?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('inline-flex items-center', className)}>
      <span className={cn('text-primary font-medium', textSizes[size])}>{text}</span>
      <span className="inline-flex">
        <span className="text-primary animate-[loading-dots_1.4s_infinite_0.2s]">.</span>
        <span className="text-primary animate-[loading-dots_1.4s_infinite_0.4s]">.</span>
        <span className="text-primary animate-[loading-dots_1.4s_infinite_0.6s]">.</span>
      </span>
    </div>
  );
}

function Loader({ variant = 'dots', size = 'md', text, className }: LoaderProps) {
  switch (variant) {
    case 'dots':
      return <DotsLoader size={size} className={className} />;
    case 'typing':
      return <TypingLoader size={size} className={className} />;
    case 'text-shimmer':
      return <TextShimmerLoader text={text} size={size} className={className} />;
    case 'loading-dots':
      return <TextDotsLoader text={text} size={size} className={className} />;
    default:
      return <DotsLoader size={size} className={className} />;
  }
}

export { Loader };
