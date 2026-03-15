'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
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
    <main className="dashboard-theme flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-lg overflow-hidden rounded-[36px] border-2 p-8 text-center sm:p-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20 text-green-600 dark:bg-green-500/10 dark:text-green-500"
        >
          <CheckCircle2 className="h-12 w-12" strokeWidth={2.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-foreground mb-4 text-3xl font-semibold tracking-tight"
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mx-auto mb-8 max-w-md text-lg"
        >
          Thank you for trusting EKA Balance. Your session has been successfully scheduled. We have
          sent a confirmation email to you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-4"
        >
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/dashboard/bookings">View My Bookings</Link>
          </Button>
        </motion.div>
      </Card>
    </main>
  );
}
