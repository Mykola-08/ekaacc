'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, Alert01Icon, Home01Icon, Calendar03Icon } from '@hugeicons/core-free-icons';

interface PaymentResultProps {
  status: 'success' | 'cancel';
}

export function PaymentResult({ status }: PaymentResultProps) {
  const isSuccess = status === 'success';

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <Card className="border-border animate-fade-in w-full max-w-lg p-12 text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div
            className={cn(
              'flex h-24 w-24 items-center justify-center rounded-full',
              isSuccess ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
            )}
          >
            {isSuccess ? (
              <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-12"  />
            ) : (
              <HugeiconsIcon icon={Alert01Icon} className="size-12"  />
            )}
          </div>
        </div>

        {/* Text */}
        <h1 className="text-foreground mb-4 font-serif text-4xl">
          {isSuccess ? 'Booking Confirmed' : 'Booking Cancelled'}
        </h1>

        <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
          {isSuccess
            ? 'Thank you for your booking. You will receive a confirmation email shortly with all the details.'
            : 'Your payment was not processed and your booking has not been confirmed. No charges were made.'}
        </p>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          {isSuccess && (
            <Link href="/bookings">
              <Button className="h-12 w-full px-8 text-base sm:w-auto">
                <HugeiconsIcon icon={Calendar03Icon} className="mr-2 size-4"  />
                View My Bookings
              </Button>
            </Link>
          )}

          <Link href="/">
            <Button
              variant={isSuccess ? 'outline' : 'default'}
              className={cn('h-12 w-full px-8 text-base sm:w-auto', !isSuccess && '')}
            >
              <HugeiconsIcon icon={Home01Icon} className="mr-2 size-4"  />
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
