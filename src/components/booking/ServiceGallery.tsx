'use client';

import * as React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface ServiceGalleryProps {
  images: string[];
  name: string;
}

export function ServiceGallery({ images, name }: ServiceGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {images.map((img, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-2/3">
              <div className="p-1">
                <div className="overflow-hidden rounded-[20px] shadow-eka-base">
                  <div className="relative aspect-video w-full">
                    <Image
                      src={img}
                      alt={`${name} image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-4 flex justify-end gap-2 pr-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
