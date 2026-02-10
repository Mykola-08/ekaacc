'use client';

import { Service } from '@/types/database';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, ArrowRight01Icon, CreditCardIcon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

interface ServiceCardProps {
  service: Service;
  variant?: 'default' | 'compact';
}

export function ServiceCard({ service, variant = 'default' }: ServiceCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div className="h-full transition-shadow duration-200 hover:shadow-md">
      <Card
        className={cn(
          'flex h-full flex-col overflow-hidden',
          'bg-card border-border'
        )}
      >
        {/* Image Placeholder or Header Gradient */}
        <div
          className={cn(
            'bg-secondary border-border relative w-full overflow-hidden border-b',
            isCompact ? 'h-24' : 'h-44'
          )}
        >
          {service.image_url ? (
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-muted/80 to-muted" />
          )}

          <div className="absolute bottom-3 left-4">
            <Badge
              variant="secondary"
              className="bg-card/80 border-border text-foreground border px-2.5 py-1 text-xs font-medium backdrop-blur-md"
            >
              {service.category || 'Therapy'}
            </Badge>
          </div>
        </div>

        <CardHeader className={cn('space-y-1.5', isCompact ? 'p-4' : 'p-5')}>
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              className={cn(
                'text-foreground font-semibold tracking-tight',
                isCompact ? 'text-base' : 'text-lg'
              )}
            >
              {service.name}
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {service.description || 'A transformative session focusing on restoring balance.'}
          </CardDescription>
        </CardHeader>

        <CardContent className={cn('grow', isCompact ? 'p-4 pt-0' : 'p-5 pt-0')}>
          <div className="text-muted-foreground flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2.5">
              <HugeiconsIcon
                icon={Clock01Icon}
                className="text-muted-foreground/60 h-4 w-4"
                strokeWidth={2}
              />
              <span>{service.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2.5">
              <HugeiconsIcon
                icon={CreditCardIcon}
                className="text-muted-foreground/60 h-4 w-4"
                strokeWidth={2.75}
              />
              <span>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: service.currency || 'EUR',
                }).format(service.price)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter
          className={cn('border-border border-t', isCompact ? 'p-3' : 'p-5')}
        >
          <Button
            asChild
            className="group w-full gap-2"
            size={isCompact ? 'sm' : 'default'}
          >
            <Link href={`/book/${service.id}`}>
              Book Session
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
