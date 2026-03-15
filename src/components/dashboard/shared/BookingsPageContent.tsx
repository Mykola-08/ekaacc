'use client';

import { BookingHistoryList } from '@/components/booking/BookingHistoryList';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function BookingsPageContent({ bookings, userId }: { bookings: any[]; userId: string }) {
  const { t } = useLanguage();

  return (
    <div className="flex-1 space-y-4">
      <div className="mb-6 flex items-center justify-end gap-2">
        <Button variant="default" asChild>
          <Link href="/book">
            <HugeiconsIcon icon={Add01Icon} className="mr-2 h-4 w-4" strokeWidth={2.5} />
            {t('page.dashboard.actions.newBooking') || 'New Booking'}
          </Link>
        </Button>
      </div>

      <div className="w-full">
        <BookingHistoryList bookings={bookings} userId={userId} />
      </div>
    </div>
  );
}
