'use client';

import { Service } from '@/types/database';
import { ServiceCard } from './ServiceCard';

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-zoom-in'>
      {services.length > 0 ? (
        services.map((service, index) => (
          <div 
            key={service.id} 
            className='h-full flex animate-slide-up'
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ServiceCard service={service} variant={'default'} />
          </div>
        ))
      ) : (
        <div className='col-span-full text-center py-20 text-muted-foreground glass-card rounded-2xl'>
          No services available at the moment.
        </div>
      )}
    </div>
  );
}

