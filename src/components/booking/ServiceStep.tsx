'use client';
type Service = any;
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, Clock01Icon } from '@hugeicons/core-free-icons';

interface ServiceStepProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (id: string) => void;
}

export function ServiceStep({ services, selectedServiceId, onSelect }: ServiceStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Select Service</h2>
        <p className="text-muted-foreground">Choose the session that best fits your needs.</p>
      </div>

      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        {services.map((service) => (
          <div key={service.id}>
            <button
              onClick={() => onSelect(service.id)}
              className={cn(
                'hover:bg-muted/30 relative flex h-full w-full flex-col space-y-3 rounded-lg border-2 p-6 text-left transition-all focus:outline-none',
                selectedServiceId === service.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'bg-muted/40 border-transparent'
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-lg font-bold">{service.name}</span>
                {selectedServiceId === service.id && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  </div>
                )}
              </div>
              <p className="text-muted-foreground line-clamp-3 grow text-sm">
                {service.description || 'Experience personalized care tailored to you.'}
              </p>

              <div className="border-border/50 mt-4 flex w-full items-center justify-between border-t pt-4 text-sm">
                <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                  {service.duration_minutes} min
                </div>
                <div className="text-foreground text-lg font-bold">
                  ${(service.price_cents / 100).toFixed(2)}
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
