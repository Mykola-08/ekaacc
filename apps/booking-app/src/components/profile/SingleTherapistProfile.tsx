// Placeholder for simplified therapist profile component
'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';

export function SingleTherapistProfile({ therapist }: { therapist: any }) {
    if (!therapist) return null;
    
    return (
        <div className="rounded-[28px] glass-card p-8 mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start animate-in fade-in slide-in-from-top-5 duration-700">
             <div className="w-24 h-24 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center text-4xl">
                {therapist.photo_url ? (
                    <Image src={therapist.photo_url} alt={therapist.name} width={96} height={96} className="w-full h-full object-cover" />
                ) : (
                    <span>{therapist.name.charAt(0)}</span>
                )}
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-col md:flex-row items-center gap-3">
                    <h2 className="text-2xl font-semibold text-foreground">{therapist.display_name || therapist.name}</h2>
                    <Badge variant="secondary" className="bg-primary/5 text-primary">Active Now</Badge>
                </div>
                <p className="text-muted-foreground">{therapist.bio || 'Experienced wellness practitioner dedicated to your health.'}</p>
                
                {therapist.specialties && therapist.specialties.length > 0 && (
                     <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                        {therapist.specialties.map((s: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-1 bg-white/50 rounded-md border border-black/5 text-foreground/70">
                                {s}
                            </span>
                        ))}
                     </div>
                )}
            </div>
        </div>
    );
}
