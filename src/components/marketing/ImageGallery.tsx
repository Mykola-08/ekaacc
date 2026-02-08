"use client";

import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

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
  onNext
}) => {
  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrevious}
            aria-label="View previous image"
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="View next image"
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div className="flex items-center justify-center h-full p-12">
        <div className="max-w-7xl max-h-full">
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          {currentImage.caption && (
            <div className="mt-6 text-center">
              <p className="text-white/90 text-lg">{currentImage.caption}</p>
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
        setCurrentImageIndex((prev) =>
          prev === 0 ? images.length - 1 : prev - 1
        );
      }
      if (event.key === 'ArrowRight') {
        setCurrentImageIndex((prev) =>
          prev === images.length - 1 ? 0 : prev + 1
        );
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
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  if (images.length === 0) return null;

  return (
    <>
      <div className={`grid gap-4 ${className}`}>
        {images.map((image, index) => (
          <button
            key={image.url}
            type="button"
            aria-label={`Open image: ${image.alt}`}
            className="relative group cursor-pointer overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.url}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                <ZoomIn className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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

