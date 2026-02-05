import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';

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
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 bg-card/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-card/30 transition-all duration-200 z-10"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-card/30 transition-all duration-200 z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-card/30 transition-all duration-200 z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div className="flex items-center justify-center h-full p-4 sm:p-12">
        <div className="relative w-full h-full max-w-7xl">
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            className="object-contain drop-shadow-2xl"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
          {currentImage.caption && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <p className="text-white/90 text-lg bg-black/50 inline-block px-4 py-2 rounded-lg backdrop-blur-sm">
                {currentImage.caption}
              </p>
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
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-square"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <div className="w-12 h-12 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                <ZoomIn className="w-6 h-6 text-foreground/90" />
              </div>
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/60 to-transparent">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
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
