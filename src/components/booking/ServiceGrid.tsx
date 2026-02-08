'use client';

import { Service } from '@/types/database';
import { ServiceCard } from './ServiceCard';

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="animate-zoom-in grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {services.length > 0 ? (
        services.map((service, index) => (
          <div
            key={service.id}
            className="animate-slide-up flex h-full"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ServiceCard service={service} variant={'default'} />
          </div>
        ))
      ) : (
        <div className="text-muted-foreground glass-card col-span-full rounded-[20px] py-20 text-center">
          No services available at the moment.
        </div>
      )}
    </div>
  );
}
