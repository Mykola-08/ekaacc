'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { PageHeaderSkeleton, TableSkeleton } from '@/components/eka/loading-skeletons';
import { useAuth } from '@/context/auth-context';
import { NewBookingForm } from '@/components/eka/new-booking-form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TherapistBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingFormOpen, setIsBookingFormOpen] = useState(false);
  const { toast } = useToast();
  const { appUser: currentUser } = useAuth();

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      // mock: get all bookings (for therapist dashboard we can call getAllBookings)
      const list = await fxService.getAllBookings();
      setBookings(list || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const cancel = async (id: string) => {
    try {
      await fxService.cancelBooking(id);
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <>
      <NewBookingForm
        open={isBookingFormOpen}
        onClose={() => setIsBookingFormOpen(false)}
        onSubmitSuccess={load}
        therapistId={currentUser?.id || ''}
      />
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-background rounded-xl p-6 border border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                Bookings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage appointments and schedules
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={load} 
                variant="outline"
                disabled={loading}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
              <Button 
                onClick={() => setIsBookingFormOpen(true)}
                disabled={loading}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Booking
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <div className="p-4">
            {!loading && bookings.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No bookings found.</p>
              </div>
            )}
            {!loading && bookings.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map(b => (
                    <TableRow key={b.id}>
                      <TableCell>{b.userId}</TableCell>
                      <TableCell>{b.therapistId}</TableCell>
                      <TableCell>{new Date(b.date).toLocaleString()}</TableCell>
                      <TableCell>{b.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => cancel(b.id)}>Cancel</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
