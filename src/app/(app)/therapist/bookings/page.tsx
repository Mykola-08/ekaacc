'use client';

import { Badge, Button, Card, CardContent, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/keep';
import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, PlusCircle, CalendarX2 } from 'lucide-react';

import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';

import { SettingsShell } from '@/components/eka/settings/settings-shell';
import { SettingsHeader } from '@/components/eka/settings/settings-header';
;
;
;
;
import { NewBookingForm } from '@/components/eka/new-booking-form';
;

// --- Reusable Components ---

function BookingsTableSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
        </div>
    );
}

function NoBookingsEmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <CalendarX2 className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Bookings Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by creating the first booking.</p>
            <Button onClick={onCreate} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Booking
            </Button>
        </div>
    );
}

// --- Main Page Component ---

export default function TherapistBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const list = await fxService.getBookings();
      setBookings(list || []);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load bookings.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const cancelBooking = async (id: string) => {
    try {
      await fxService.cancelBooking(id);
      toast({ title: 'Success', description: 'Booking has been cancelled.' });
      await loadBookings();
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to cancel booking.', variant: 'destructive' });
    }
  };

  return (
    <>
      <NewBookingForm
        open={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onSubmitSuccess={loadBookings}
        therapistId={currentUser?.id || ''}
      />
      <SettingsShell>
        <SettingsHeader
          title="Bookings"
          description="Manage all appointments and schedules across the platform."
        >
          <div className="flex gap-2">
            <Button onClick={loadBookings} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => setIsBookingFormOpen(true)} disabled={loading}>
              <PlusCircle className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </div>
        </SettingsHeader>

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <BookingsTableSkeleton />
            ) : bookings.length === 0 ? (
              <NoBookingsEmptyState onCreate={() => setIsBookingFormOpen(true)} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(b => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.userId}</TableCell>
                      <TableCell>{b.therapistId}</TableCell>
                      <TableCell>{new Date(b.date).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge color={b.status === 'CANCELLED' ? 'error' : 'primary'}>
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => cancelBooking(b.id)} disabled={b.status === 'CANCELLED'}>
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </SettingsShell>
    </>
  );
}
