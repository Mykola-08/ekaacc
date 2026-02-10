'use client';

import { Service } from '@/types/database';
import { ServiceCard } from './ServiceCard';

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.length > 0 ? (
        services.map((service, index) => (
          <div
            key={service.id}
            className="animate-fade-in flex h-full"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <ServiceCard service={service} variant={'default'} />
          </div>
        ))
      ) : (
        <div className="text-muted-foreground bg-card col-span-full rounded-lg border py-16 text-center text-sm">
          No services available at the moment.
        </div>
      )}
    </div>
  );
}
