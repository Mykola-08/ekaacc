'use client';

import { Service } from '@/types/database';
import Link from 'next/link';
import { ArrowLeft, Clock, Pencil, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// Card imports removed as we use div with glass-card
import { cn } from '@/lib/utils';

interface ServiceMarketingPageProps {
  service: Service;
  canEdit?: boolean;
}

export function ServiceMarketingPage({ service, canEdit }: ServiceMarketingPageProps) {
  return (
    <div className="bg-background animate-fade-in group/page min-h-screen pb-20">
      {/* Admin Edit Floating Action */}
      {canEdit && (
        <div className="fixed top-24 right-6 z-50">
          <Link href={`/admin/services/${service.id}`}>
            <Button size="default" className="gap-2 rounded-full shadow-xl">
              <Pencil className="h-4 w-4" />
              Edit Service
            </Button>
          </Link>
        </div>
      )}

      {/* Hero */}
      <header className="relative flex h-[60vh] min-h-125 w-full items-center justify-center overflow-hidden">
        <div className="bg-background/50 absolute inset-0 z-10" />
        <div className="from-background absolute inset-0 z-10 bg-linear-to-t to-transparent" />

        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="bg-muted h-full w-full" />
        )}

        <div className="text-foreground animate-slide-up relative z-20 max-w-4xl px-6 text-center">
          <h1 className="mb-6 font-serif text-5xl leading-tight font-medium drop-shadow-sm md:text-7xl">
            {service.name}
          </h1>

          <div className="bg-background/60 border-border inline-flex items-center gap-6 rounded-full border px-8 py-3 text-lg font-medium shadow-lg backdrop-blur-md md:text-xl">
            <div className="flex items-center gap-2.5">
              <Clock className="text-muted-foreground h-5 w-5" />
              {service.duration} mins
            </div>
            <div className="bg-border h-5 w-px" />
            <div className="flex items-center gap-2.5">
              <span className="text-muted-foreground">from</span>
              <span className="font-serif text-2xl">€{service.price}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Container (Overlapping Hero) */}
      <div className="relative z-30 mx-auto -mt-24 max-w-5xl px-6">
        <div className="glass-card animate-slide-up rounded-3xl p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] md:p-16">
          <Link href="/services">
            <Button variant="ghost" className="mb-10 pl-0 transition-all hover:pl-2">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to treatments
            </Button>
          </Link>

          <div className="mb-16 grid gap-16 md:grid-cols-2">
            <div className="prose prose-lg text-muted-foreground prose-p:font-sans prose-headings:font-serif prose-headings:font-medium max-w-none leading-relaxed">
              <p className="whitespace-pre-line">{service.description}</p>
            </div>

            <div className="bg-card/40 h-fit rounded-3xl border border-white/50 p-8 backdrop-blur-md">
              <h3 className="mb-6 font-serif text-2xl text-blue-800">Benefits</h3>

              <ul className="space-y-4">
                {[
                  'Relieves tension & stress',
                  'Improves circulation',
                  'Restores structural balance',
                  'Deep relaxation',
                ].map((item, i) => (
                  <li key={i} className="text-foreground flex items-center gap-3 font-medium">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Booking Options */}
          <div>
            <h3 className="text-foreground mb-8 text-center font-serif text-3xl">
              Choose Your Experience
            </h3>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {(service.variants && service.variants.length > 0
                ? service.variants
                : [
                    {
                      id: null,
                      name: 'Standard Session',
                      duration: service.duration,
                      price: service.price,
                      description: 'Flexible session tailored to your needs.',
                    },
                  ]
              ).map((variant: any) => (
                <Link
                  key={variant.id || 'standard'}
                  href={`/book/${service.id}?variantId=${variant.id || ''}`}
                >
                  <div className="glass-card group hover:bg-card/80 relative h-full rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-xl">
                    <div className="flex h-full flex-col p-8">
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 p-8 opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                          <ArrowRight className="h-6 w-6 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-foreground mb-1 text-xl font-bold">{variant.name}</h4>
                        <Badge
                          variant="secondary"
                          className="gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {variant.duration} minutes
                        </Badge>
                      </div>

                      <p className="text-muted-foreground mb-8 max-w-[85%] grow leading-relaxed">
                        {variant.description ||
                          'A complete session focused on your specific needs.'}
                      </p>

                      <div className="mt-auto flex items-center gap-2">
                        <span className="font-serif text-3xl text-blue-900">€{variant.price}</span>
                        <span className="text-muted-foreground mb-1.5 self-end text-sm font-medium">
                          per session
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
