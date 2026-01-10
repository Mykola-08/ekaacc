
import { useState } from 'react';
import { useLazyImage } from '@/react-app/hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
}

export default function LazyImage({
  src,
  alt,
  placeholder,
  className = '',
  onLoad
}: LazyImageProps) {
  const [imageRef, imageSrc] = useLazyImage(src, placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div ref={imageRef as React.LegacyRef<HTMLDivElement>} className={`relative overflow-hidden ${className}`}>
      {imageSrc ? (
        <img
          src={imageSrc as string}
          alt={alt}
          onLoad={handleLoad}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}

      {!isLoaded && imageSrc && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
}
