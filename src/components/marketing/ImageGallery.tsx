'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';


interface ImageGalleryProps {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
}

interface LightboxProps {
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
}) => {
  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background/20 text-primary-foreground backdrop-blur-md transition-all duration-200 hover:bg-background/30"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrevious}
            aria-label="View previous image"
            className="absolute top-1/2 left-6 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background/20 text-primary-foreground backdrop-blur-md transition-all duration-200 hover:bg-background/30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="View next image"
            className="absolute top-1/2 right-6 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-background/20 text-primary-foreground backdrop-blur-md transition-all duration-200 hover:bg-background/30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div className="flex h-full items-center justify-center p-12">
        <div className="max-h-full max-w-7xl">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
          {currentImage.caption && (
            <div className="mt-6 text-center">
              <p className="text-lg text-primary-foreground/90">{currentImage.caption}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ImageGallery({ images, className = '' }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxOpen(false);
      }
      if (event.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (event.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxOpen, images.length]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className={cn("grid gap-4", className)}>
        {images.map((image, index) => (
          <button
            key={image.url}
            type="button"
            aria-label={`Open image: ${image.alt}`}
            className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-border/80"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/20">
              <div className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-card/90 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                <ZoomIn className="h-6 w-6 text-foreground" />
              </div>
            </div>
            {image.caption && (
              <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/60 to-transparent p-4">
                <p className="text-sm text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {image.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onPrevious={goToPrevious}
          onNext={goToNext}
        />
      )}
    </>
  );
}

