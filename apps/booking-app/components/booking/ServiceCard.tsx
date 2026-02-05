'use client';

import { Service } from '@/types/database';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ArrowRight, Euro } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ServiceCardProps {
  service: Service;
  variant?: 'default' | 'compact';
}

export function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div className="h-full hover:scale-105 transition-transform duration-500 ease-out origin-center">
      <Card className={cn(
        "h-full flex flex-col overflow-hidden transition-all duration-300",
        "bg-card border-border shadow-sm", // Porcelain Surface
        isCompact ? "rounded-xl" : "rounded-2xl"
      )}>
        {/* Image Placeholder or Header Gradient */}
        <div className={cn(
          "relative bg-secondary w-full border-b border-border",
          isCompact ? "h-24" : "h-48"
        )}>
          {/* Abstract minimalist shape/gradient if needed, but keeping it clean porcelain gray/white */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-background to-transparent opacity-80" />

          <div className="absolute bottom-4 left-6">
            <Badge variant="secondary" className="bg-card/80 backdrop-blur-md border border-border shadow-none rounded-xl px-3 py-1.5 text-foreground font-semibold tracking-wide text-xs">
              {service.category || 'Therapy'}
            </Badge>
          </div>
        </div>

        <CardHeader className={cn("space-y-2", isCompact ? "p-5" : "p-7")}>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className={cn("font-sans font-semibold tracking-tight text-foreground", isCompact ? "text-[18px]" : "text-[22px]")}>
              {service.name}
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2 text-muted-foreground font-medium text-base leading-relaxed">
            {service.description || "A transformative session focusing on restoring balance."}
          </CardDescription>
        </CardHeader>

        <CardContent className={cn("flex-grow", isCompact ? "p-5 pt-0" : "p-7 pt-0")}>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground/60" strokeWidth={2.75} />
              <span>{service.duration} minutes</span>
            </div>
            <div className="flex items-center gap-3">
              <Euro className="w-4 h-4 text-muted-foreground/60" strokeWidth={2.75} />
              <span>{service.price}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className={cn("border-t border-border bg-secondary/30", isCompact ? "p-4" : "p-7")}>
          <Button asChild className="w-full gap-2 group rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-none hover:shadow-lg hover:shadow-primary/20 transition-all font-semibold active:scale-95 h-12 text-[15px]" size={isCompact ? "sm" : "lg"}>
            <Link href={`/book/${service.id}`}>
              Book Session
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
