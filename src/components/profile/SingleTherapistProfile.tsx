// Placeholder for simplified therapist profile component
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export function SingleTherapistProfile({ therapist }: { therapist: any }) {
  if (!therapist) return null;

  return (
    <div className="glass-card animate-in fade-in slide-in-from-top-5 mb-8 flex flex-col items-center gap-6 rounded-lg p-8 duration-700 md:flex-row md:items-start">
      <div className="bg-primary/10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full text-4xl">
        {therapist.photo_url ? (
          <Image
            src={therapist.photo_url}
            alt={therapist.name}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{therapist.name.charAt(0)}</span>
        )}
      </div>
      <div className="flex-1 space-y-2 text-center md:text-left">
        <div className="flex flex-col items-center gap-3 md:flex-row">
          <h2 className="text-foreground text-2xl font-semibold">
            {therapist.display_name || therapist.name}
          </h2>
          <Badge variant="secondary" className="bg-primary/5 text-primary">
            Active Now
          </Badge>
        </div>
        <p className="text-muted-foreground">
          {therapist.bio || 'Experienced wellness practitioner dedicated to your health.'}
        </p>

        {therapist.specialties && therapist.specialties.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 pt-2 md:justify-start">
            {therapist.specialties.map((s: string, i: number) => (
              <span
                key={i}
                className="text-foreground/70 rounded-md border border-black/5 bg-white/50 px-2 py-1 text-xs"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
