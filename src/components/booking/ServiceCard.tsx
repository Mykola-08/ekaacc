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
    <div className="h-full origin-center transition-transform duration-500 ease-out hover:scale-[1.02] active:scale-[0.98]">
      <Card
        className={cn(
          'flex h-full flex-col overflow-hidden transition-all duration-300',
          'bg-card border-border', // Porcelain Surface
          'rounded-[20px]' // Apple standard 20px radius for all variants
        )}
        style={{ boxShadow: 'var(--shadow-base)' }} // Use CSS variable
      >
        {/* Image Placeholder or Header Gradient */}
        <div
          className={cn(
            'bg-secondary border-border relative w-full overflow-hidden border-b',
            isCompact ? 'h-24' : 'h-48'
          )}
        >
          {service.image_url ? (
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              {/* Abstract minimalist shape/gradient if needed, but keeping it clean porcelain gray/white */}
              <div className="via-background absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white to-transparent opacity-80" />
            </>
          )}
          <div className="via-background absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white to-transparent opacity-80" />

          <div className="absolute bottom-4 left-6">
            <Badge
              variant="secondary"
              className="bg-card/80 border-border text-foreground border px-3 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-md"
              style={{
                borderRadius: 'var(--radius)', // Apple standard
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {service.category || 'Therapy'}
            </Badge>
          </div>
        </div>

        <CardHeader className={cn('space-y-2', isCompact ? 'p-5' : 'p-7')}>
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              className={cn(
                'text-foreground font-sans font-semibold tracking-tight',
                isCompact ? 'text-[18px]' : 'text-[22px]'
              )}
            >
              {service.name}
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground line-clamp-2 text-base leading-relaxed font-medium">
            {service.description || 'A transformative session focusing on restoring balance.'}
          </CardDescription>
        </CardHeader>

        <CardContent className={cn('flex-grow', isCompact ? 'p-5 pt-0' : 'p-7 pt-0')}>
          <div className="text-muted-foreground flex flex-col gap-3 text-sm font-medium">
            <div className="flex items-center gap-3">
              <HugeiconsIcon
                icon={Clock01Icon}
                className="text-muted-foreground/60 h-4 w-4"
                strokeWidth={2.75}
              />
              <span>{service.duration} minutes</span>
            </div>
            <div className="flex items-center gap-3">
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
          className={cn('border-border bg-secondary/30 border-t', isCompact ? 'p-4' : 'p-7')}
        >
          <Button
            asChild
            className="group bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-full gap-2 text-[15px] font-semibold transition-all active:scale-95"
            style={{
              borderRadius: 'var(--radius)', // Apple standard
              boxShadow: 'var(--shadow-base)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-base)';
            }}
            size={isCompact ? 'sm' : 'lg'}
          >
            <Link href={`/book/${service.id}`}>
              Book Session
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
