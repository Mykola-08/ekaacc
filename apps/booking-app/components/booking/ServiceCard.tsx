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
    <div className="h-full hover:scale-[1.01] transition-transform duration-500 ease-out origin-center">
      <Card className={cn(
        "h-full flex flex-col overflow-hidden transition-all duration-300 rounded-[28px]", 
        "glass-card border-white/40 hover:shadow-lg hover:shadow-black/5"
      )}>
        {/* Image Placeholder or Header Gradient */}
        <div className={cn(
          "relative bg-gradient-to-br from-primary/5 via-gray-50 to-white w-full",
          isCompact ? "h-24" : "h-48"
        )}>
          {/* Subtle noise/pattern - removed for clean glass look */}
          
          <div className="absolute bottom-4 left-6">
             <Badge variant="secondary" className="bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-lg px-3 py-1 text-primary font-medium tracking-tight">
                {service.category || 'Therapy'}
             </Badge>
          </div>
        </div>

        <CardHeader className={cn("space-y-2", isCompact ? "p-4" : "p-6")}>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className={cn("font-sans font-medium tracking-tight line-clamp-2", isCompact ? "text-lg" : "text-xl")}>
              {service.name}
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2 text-muted-foreground font-light text-base">
             {service.description || "A transformative session focusing on restoring balance."}
          </CardDescription>
        </CardHeader>

        <CardContent className={cn("flex-grow", isCompact ? "p-4 pt-0" : "p-6 pt-0")}>
           <div className="flex flex-col gap-3 text-sm text-foreground/80 font-medium">
              <div className="flex items-center gap-3">
                 <Clock className="w-4 h-4 text-primary" />
                 <span>{service.duration} minutes</span>
              </div>
              <div className="flex items-center gap-3">
                 <Euro className="w-4 h-4 text-primary" />
                 <span>{service.price}</span>
              </div>
           </div>
        </CardContent>

        <CardFooter className={cn("border-t border-primary/5 bg-transparent", isCompact ? "p-3" : "p-6")}>
           <Button asChild className="w-full gap-2 group rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-xl transition-all" size={isCompact ? "sm" : "lg"}>
              <Link href={`/book/${service.id}`}>
                 Book Session
                 <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
