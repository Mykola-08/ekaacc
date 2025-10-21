'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function TherapistBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  const createDemo = async () => {
    try {
      const res = await fxService.createBooking('demo-user', 'therapist1', new Date(Date.now() + 3600 * 1000).toISOString(), 'Demo booking');
  toast({ title: 'Created', description: `Created ${res?.id || JSON.stringify(res)}` });
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <div className="flex gap-2">
          <Button onClick={load} variant="outline">Refresh</Button>
          <Button onClick={createDemo}>Create Demo Booking</Button>
        </div>
      </div>

      <Card>
        <div className="p-4">
          {loading && <p>Loading...</p>}
          {!loading && (
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
  );
}
