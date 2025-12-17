'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Service } from '@/types/database';
import { BookingModal } from '@/components/BookingModal';
import { ServiceMatcher } from '@/components/booking/ServiceMatcher';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceListProps {
  services: Service[];
}

export function ServiceList({ services }: ServiceListProps) {
  const serviceRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleMatch = (serviceId: string) => {
    const element = serviceRefs.current[serviceId];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Optional: Add a highlight effect
      element.classList.add('ring-2', 'ring-primary');
      setTimeout(() => element.classList.remove('ring-2', 'ring-primary'), 2000);
    }
  };

  return (
    <div>
      <ServiceMatcher onMatch={handleMatch} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div 
            key={service.id} 
            ref={(el) => { serviceRefs.current[service.id] = el; }}
            className="transition-all duration-300"
          >
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow border-border/50">
              {service.image_url && (
                <div className="relative h-48 w-full bg-muted">
                  <Image className="object-cover" src={service.image_url} alt={service.name} fill />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-primary">{service.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {service.description}
                </CardDescription>
                {(service.location || service.version) && (
                  <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
                    {service.location && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary">
                        📍 {service.location}
                      </span>
                    )}
                    {service.version && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary">
                        🏷️ {service.version}
                      </span>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-foreground">${service.price}</span>
                  <span className="text-sm text-muted-foreground">{service.duration} mins</span>
                </div>
              </CardContent>
              <CardFooter>
                <BookingModal service={service} />
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
