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
      <div className="space-y-1">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Choose a Service</h2>
        <p className="text-muted-foreground text-sm">
          Select the session type that best fits your needs.
        </p>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        {services.map((service) => {
          const selected = selectedServiceId === service.id;
          return (
            <button
              key={service.id}
              onClick={() => onSelect(service.id)}
              className={cn(
                'group relative flex h-full w-full flex-col rounded-[var(--radius)] border-2 p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                selected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-muted/20 hover:shadow-sm'
              )}
            >
              {/* Selected check */}
              <div
                className={cn(
                  'absolute top-3.5 right-3.5 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200',
                  selected
                    ? 'bg-primary text-primary-foreground scale-100 opacity-100'
                    : 'border-2 border-border scale-90 opacity-0 group-hover:opacity-30'
                )}
              >
                <HugeiconsIcon icon={Tick02Icon} className="size-3.5" />
              </div>

              <div className="min-w-0 flex-1 space-y-2 pr-8">
                <span className="text-foreground text-base font-bold leading-tight">
                  {service.name}
                </span>
                <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                  {service.description || 'Personalized care tailored to your wellness journey.'}
                </p>
              </div>

              <div className="mt-4 flex w-full items-center justify-between border-t border-border/50 pt-3.5">
                <div className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <HugeiconsIcon icon={Clock01Icon} className="size-4" />
                  {service.duration_minutes} min
                </div>
                <div
                  className={cn(
                    'text-base font-bold transition-colors',
                    selected ? 'text-primary' : 'text-foreground'
                  )}
                >
                  ${(service.price_cents / 100).toFixed(0)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
