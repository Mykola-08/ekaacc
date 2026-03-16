'use client';
type Therapist = any;
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, StarIcon } from '@hugeicons/core-free-icons';

interface TherapistStepProps {
  therapists: Therapist[];
  selectedTherapistId: string | null;
  onSelect: (id: string) => void;
}

export function TherapistStep({ therapists, selectedTherapistId, onSelect }: TherapistStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Choose a Therapist</h2>
        <p className="text-muted-foreground text-sm">
          Select the practitioner you'd like to work with.
        </p>
      </div>

      <div className="grid gap-3 pt-1 sm:grid-cols-2">
        {therapists.map((therapist) => {
          const selected = selectedTherapistId === therapist.id;
          return (
            <button
              key={therapist.id}
              onClick={() => onSelect(therapist.id)}
              className={cn(
                'group relative flex h-full w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                selected
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-muted/20 hover:shadow-sm'
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={therapist.avatar_url || '/assets/avatar-placeholder.png'}
                  alt={therapist.full_name}
                  className={cn(
                    'h-16 w-16 rounded-full object-cover transition-all duration-200',
                    selected ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-border'
                  )}
                />
                {selected && (
                  <div className="bg-primary text-primary-foreground absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full shadow-sm">
                    <HugeiconsIcon icon={Tick02Icon} className="size-3" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <h3 className="text-foreground truncate text-sm font-bold">
                  {therapist.full_name}
                </h3>
                {therapist.specialties && (
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">
                    {therapist.specialties}
                  </p>
                )}
                <div className="mt-1.5 flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HugeiconsIcon key={i} icon={StarIcon} className="size-3 fill-current" />
                  ))}
                  <span className="text-muted-foreground ml-1 text-xs font-medium">
                    {therapist.rating || '5.0'}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
