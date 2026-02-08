'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export default function LazyImage({ src, alt, className = '', onLoad }: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={`object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => {
          setIsLoaded(true);
          onLoad?.();
        }}
        priority={false}
      />

      {!isLoaded && <div className="absolute inset-0 animate-pulse bg-gray-100 dark:bg-gray-800" />}
    </div>
  );
}
