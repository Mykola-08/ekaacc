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
      <div className="space-y-2">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">Choose Therapist</h2>
        <p className="text-muted-foreground">Select a practitioner for your session.</p>
      </div>

      <div className="grid gap-4 pt-2 sm:grid-cols-2">
        {therapists.map((therapist) => (
          <div key={therapist.id}>
            <button
              onClick={() => onSelect(therapist.id)}
              className={cn(
                'hover:bg-muted/30 relative flex h-full w-full flex-col items-center space-y-4 rounded-lg border-2 p-6 text-center transition-all focus:outline-none',
                selectedTherapistId === therapist.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'bg-muted/40 border-transparent'
              )}
            >
              <div className="relative">
                <img
                  src={therapist.avatar_url || '/assets/avatar-placeholder.png'}
                  alt={therapist.full_name}
                  className="border-background h-24 w-24 rounded-full border-2 object-cover shadow-sm"
                />
                {selectedTherapistId === therapist.id && (
                  <div className="bg-primary text-primary-foreground absolute -right-2 -bottom-2 rounded-full p-1 shadow-sm">
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">{therapist.full_name}</h3>
                <div className="mt-1 flex items-center justify-center text-sm text-amber-500">
                  <HugeiconsIcon icon={StarIcon} className="size-4 fill-current" />
                  <HugeiconsIcon icon={StarIcon} className="size-4 fill-current" />
                  <HugeiconsIcon icon={StarIcon} className="size-4 fill-current" />
                  <HugeiconsIcon icon={StarIcon} className="size-4 fill-current" />
                  <HugeiconsIcon icon={StarIcon} className="size-4 fill-current" />
                  <span className="text-muted-foreground ml-2 text-xs font-medium">
                    5.0 (120+ reviews)
                  </span>
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
