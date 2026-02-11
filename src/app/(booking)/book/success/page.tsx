
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';

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
    <main className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="bg-success/20 text-success mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full"
        >
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-12 w-12" strokeWidth={3} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-foreground mb-4 text-3xl font-semibold"
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8 max-w-md text-lg"
        >
          Thank you for trusting EKA Balance. Your session has been successfully scheduled.
          We have sent a confirmation email to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4"
        >
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/dashboard/bookings">View My Bookings</Link>
          </Button>
        </motion.div>
      </div>
    </main>
  );
}
