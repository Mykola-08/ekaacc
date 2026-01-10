'use client';

import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/platform/utils';

interface OptimizedImageProps extends Omit<NextImageProps, 'onLoad'> {
  fallback?: string;
  showSkeleton?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  fallback = '/placeholder.svg',
  showSkeleton = true,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setError(false);
    setIsLoading(true);
  }, [src]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
    if (fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-muted animate-skeleton" />
      )}
      <NextImage
        {...props}
        src={imageSrc}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg=="
      />
    </div>
  );
}
