'use client';

import { 
  Badge, 
  Button, 
  Card, 
  CardContent, 
  Skeleton, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow,
  Avatar,
  AvatarFallback,
  Divider
} from '@/components/keep';
import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, PlusCircle, CalendarX2, Calendar, User, Clock } from 'lucide-react';

import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/supabase-auth';

import { NewBookingForm } from '@/components/eka/new-booking-form';

// --- Reusable Components ---

function BookingsTableSkeleton() {
    return (
        <Card className="p-4">
            <div className="space-y-4">
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
        </Card>
    );
}

function NoBookingsEmptyState({ onCreate }: { onCreate: () => void }) {
    return (
        <Card className="text-center py-16 border-2 border-dashed">
            <CalendarX2 className="mx-auto h-12 w-12 text-gray-400" />
            <h5 className="text-lg font-semibold mt-4">No Bookings Found</h5>
            <p className="text-sm text-gray-600 mt-1">
                Get started by creating the first booking.
            </p>
            <Button onClick={onCreate} className="mt-4" variant="default">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Booking
            </Button>
        </Card>
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
      <div className="min-h-screen bg-gray-50">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Bookings</h3>
              <p className="text-sm text-gray-600">
                Manage all appointments and schedules across the platform.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadBookings} variant="outline" disabled={loading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setIsBookingFormOpen(true)} disabled={loading} variant="default">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>

          {/* Bookings Table */}
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
                      <TableHead>
                        <p className="text-sm font-medium">Client</p>
                      </TableHead>
                      <TableHead>
                        <p className="text-sm font-medium">Therapist</p>
                      </TableHead>
                      <TableHead>
                        <p className="text-sm font-medium">Date</p>
                      </TableHead>
                      <TableHead>
                        <p className="text-sm font-medium">Status</p>
                      </TableHead>
                      <TableHead className="text-right">
                        <p className="text-sm font-medium">Actions</p>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map(b => (
                      <TableRow key={b.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback>{b.userId.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p className="text-base font-medium">{b.userId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar size="sm">
                              <AvatarFallback>{b.therapistId.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <p className="text-base font-medium">{b.therapistId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {new Date(b.date).toLocaleString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge color={b.status === 'CANCELLED' ? 'error' : 'primary'}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => cancelBooking(b.id)} 
                            disabled={b.status === 'CANCELLED'}
                          >
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
        </div>
      </div>
    </>
  );
}
