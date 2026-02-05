"use client";

import { Service } from "@/types/database";
import Link from "next/link";
import { ArrowLeft, Clock, Pencil, ArrowRight, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Card imports removed as we use div with glass-card
import { cn } from "@/lib/utils";

interface ServiceMarketingPageProps {
  service: Service;
  canEdit?: boolean;
}

export function ServiceMarketingPage({ service, canEdit }: ServiceMarketingPageProps) {
  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in group/page">
      {/* Admin Edit Floating Action */}
      {canEdit && (
        <div className="fixed top-24 right-6 z-50">
          <Link href={`/admin/services/${service.id}`}>
            <Button size="default" className="gap-2 shadow-xl rounded-full">
              <Pencil className="w-4 h-4" />
              Edit Service
            </Button>
          </Link>
        </div>
      )}

      {/* Hero */}
      <header className="relative w-full h-[60vh] min-h-125 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-background/50 z-10" />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent z-10" />
        
        {service.image_url ? (
          <Image 
            src={service.image_url} 
            alt={service.name} 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}

        <div className="relative z-20 text-center text-foreground px-6 animate-slide-up max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 leading-tight drop-shadow-sm">{service.name}</h1>
          
          <div className="inline-flex items-center gap-6 text-lg md:text-xl font-medium backdrop-blur-md bg-background/60 border border-border px-8 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-muted-foreground" />
              {service.duration} mins
            </div>
            <div className="h-5 w-px bg-border" />
            <div className="flex items-center gap-2.5">
              <span className="text-muted-foreground">from</span>
              <span className="font-serif text-2xl">€{service.price}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Container (Overlapping Hero) */}
      <div className="relative z-30 -mt-24 max-w-5xl mx-auto px-6">
        <div className="glass-card rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] animate-slide-up p-8 md:p-16">
            
                <Link href="/services">
                    <Button variant="ghost" className="mb-10 pl-0 hover:pl-2 transition-all">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to treatments
                    </Button>
                </Link>

                <div className="grid md:grid-cols-2 gap-16 mb-16">
                    <div className="prose prose-lg text-muted-foreground leading-relaxed max-w-none prose-p:font-sans prose-headings:font-serif prose-headings:font-medium">
                    <p className="whitespace-pre-line">{service.description}</p>
                    </div>
                
                    <div className="bg-card/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 h-fit">
                        <h3 className="font-serif text-2xl mb-6 text-blue-800">Benefits</h3>
                        
                            <ul className="space-y-4">
                                {['Relieves tension & stress', 'Improves circulation', 'Restores structural balance', 'Deep relaxation'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        
                    </div>
                </div>

                {/* Booking Options */}
                <div>
                    <h3 className="text-3xl font-serif text-foreground mb-8 text-center">Choose Your Experience</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {(
                        service.variants && service.variants.length > 0 
                            ? service.variants 
                            : [{ id: null, name: 'Standard Session', duration: service.duration, price: service.price, description: 'Flexible session tailored to your needs.' }]
                    ).map((variant: any) => (
                        <Link 
                            key={variant.id || 'standard'} 
                            href={`/book/${service.id}?variantId=${variant.id || ''}`}
                        >
                            <div className="glass-card group relative h-full hover:border-blue-500/50 hover:bg-card/80 transition-all duration-300 hover:shadow-xl rounded-3xl hover:-translate-y-1">
                                <div className="p-8 flex flex-col h-full">
                                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity -mr-4 -mt-4">
                                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white">
                                            <ArrowRight className="w-6 h-6 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="text-xl font-bold text-foreground mb-1">{variant.name}</h4>
                                        <Badge variant="secondary" className="gap-2 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                            <Clock className="w-3.5 h-3.5" />
                                            {variant.duration} minutes
                                        </Badge>
                                    </div>
                                    
                                    <p className="text-muted-foreground mb-8 leading-relaxed max-w-[85%] grow">
                                        {variant.description || "A complete session focused on your specific needs."}
                                    </p>

                                    <div className="mt-auto flex items-center gap-2">
                                        <span className="text-3xl font-serif text-blue-900">€{variant.price}</span>
                                        <span className="text-muted-foreground text-sm font-medium self-end mb-1.5">per session</span>
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
