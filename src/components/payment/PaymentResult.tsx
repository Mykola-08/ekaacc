'use client';

import Link from 'next/link';
import { CheckCircle2, AlertCircle, Home, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
              <CheckCircle2 className="h-12 w-12" />
            ) : (
              <AlertCircle className="h-12 w-12" />
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
                <Calendar className="mr-2 h-4 w-4" />
                View My Bookings
              </Button>
            </Link>
          )}

          <Link href="/">
            <Button
              variant={isSuccess ? 'outline' : 'default'}
              className={cn('h-12 w-full px-8 text-base sm:w-auto', !isSuccess && '')}
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
