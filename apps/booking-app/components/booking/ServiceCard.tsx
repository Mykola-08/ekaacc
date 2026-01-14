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
    <div className="h-full hover:scale-[1.02] transition-transform duration-300 ease-out origin-center">
      <Card className={cn(
        "h-full flex flex-col overflow-hidden transition-all duration-300 rounded-[1.5rem]", 
        "glass-card border-white/50 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]"
      )}>
        {/* Image Placeholder or Header Gradient */}
        <div className={cn(
          "relative bg-gradient-to-br from-teal-50 via-cyan-50 to-white w-full",
          isCompact ? "h-24" : "h-48"
        )}>
          {/* Subtle noise/pattern - removed for clean glass look */}
          
          <div className="absolute bottom-4 left-4">
             <Badge variant="secondary" className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm rounded-full px-4 py-1 text-teal-800 font-medium">
                {service.category || 'Therapy'}
             </Badge>
          </div>
        </div>

        <CardHeader className={cn("space-y-2", isCompact ? "p-4" : "p-6")}>
          <div className="flex justify-between items-start gap-2">
            <CardTitle className={cn("font-serif line-clamp-2", isCompact ? "text-lg" : "text-2xl")}>
              {service.name}
            </CardTitle>
          </div>
          <CardDescription className="line-clamp-2 text-muted-foreground">
             {service.description || "A transformative session focusing on restoring balance."}
          </CardDescription>
        </CardHeader>

        <CardContent className={cn("flex-grow", isCompact ? "p-4 pt-0" : "p-6 pt-0")}>
           <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4 text-primary" />
                 <span>{service.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                 <Euro className="w-4 h-4 text-primary" />
                 <span>{service.price}</span>
              </div>
              <div className="flex items-center gap-2">
                 <Users className="w-4 h-4 text-primary" />
                 <span>1-on-1 Session</span>
              </div>
           </div>
        </CardContent>

        <CardFooter className={cn("border-t border-border bg-muted/5", isCompact ? "p-3" : "p-4")}>
           <Button asChild className="w-full gap-2 group rounded-full" size={isCompact ? "sm" : "default"}>
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
