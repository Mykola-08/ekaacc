'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';

export default function BookingSuccessPage() {
  const router = useRouter();

  // Redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      //   router.push('/dashboard/bookings'); // Or where ever bookings are
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="dashboard-theme flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-lg border-2 p-8 text-center sm:p-12">
        <div className="mx-auto mb-6 flex size-24 items-center justify-center rounded-full bg-primary/20 text-primary">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-12" />
        </div>

        <h1 className="text-foreground mb-4 text-3xl font-semibold tracking-tight">
          Booking Confirmed!
        </h1>

        <p className="text-muted-foreground mx-auto mb-8 max-w-md text-lg">
          Thank you for trusting EKA Balance. Your session has been successfully scheduled. We have
          sent a confirmation email to you.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/dashboard/bookings">View My Bookings</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}
