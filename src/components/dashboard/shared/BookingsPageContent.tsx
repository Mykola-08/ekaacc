'use client';

import { motion } from 'motion/react';
import { BookingHistoryList } from '@/components/booking/BookingHistoryList';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { useLanguage } from '@/context/LanguageContext';

export function BookingsPageContent({ bookings, userId }: { bookings: any[]; userId: string }) {
  const { t } = useLanguage();

  return (
    <motion.div
      className="px-4 py-8 md:px-8"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <DashboardHeader
        title={t('page.bookings.title') || 'Your Bookings'}
        subtitle={
          t('page.bookings.subtitle') || 'View your session history and upcoming appointments.'
        }
      >
        <Button asChild variant="default">
          <Link href="/book">
            <HugeiconsIcon icon={Add01Icon} className="mr-2 h-4 w-4" strokeWidth={2.5} />
            {t('page.bookings.newBooking') || 'New Booking'}
          </Link>
        </Button>
      </DashboardHeader>

      <div className="border-border bg-card overflow-hidden rounded-lg border p-1">
        <div className="p-6 md:p-8">
          <BookingHistoryList bookings={bookings} userId={userId} />
        </div>
      </div>
    </motion.div>
  );
}
