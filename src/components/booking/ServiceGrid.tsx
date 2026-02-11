'use client';

import { Service } from '@/types/database';
import { ServiceCard } from './ServiceCard';
import { EmptyState } from '@/components/ui/empty-state';
import { Calendar03Icon } from '@hugeicons/core-free-icons';

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
        <div className="col-span-full">
          <EmptyState
            icon={Calendar03Icon}
            title="No services available"
            description="Check back soon for new sessions and offerings."
          />
        </div>
      )}
    </div>
  );
}
