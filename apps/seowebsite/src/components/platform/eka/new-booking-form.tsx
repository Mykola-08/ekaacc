"use client";

import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/platform/ui/dialog';
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from '@/components/platform/ui/select';
import { Calendar } from '@/components/platform/ui/calendar';
import React, { useState, useEffect } from 'react';
;
;
;
;
;
import { useToast } from '@/hooks/platform/use-toast';
import fxService from '@/lib/platform/fx-service';
import type { User } from '@/lib/platform/types';

interface NewBookingFormProps {
  open: boolean;
  onClose: () => void;
  onSubmitSuccess: () => void;
  therapistId: string;
}

export function NewBookingForm({ open, onClose, onSubmitSuccess, therapistId }: NewBookingFormProps) {
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const fetchClients = async () => {
        setClientsLoading(true);
        setClientsError(null);
        try {
          const users = await fxService.getUsers();
          const patients = users.filter(u => !u.role || u.role.name === 'Patient');
          setClients(patients);
          if (patients.length === 0) {
            setClientsError('No patients found in the system.');
          }
        } catch (error) {
          console.error('Failed to fetch clients:', error);
          setClientsError('Failed to load clients. Please try again.');
          toast({ title: 'Error', description: 'Could not load clients.', variant: 'destructive' });
        } finally {
          setClientsLoading(false);
        }
      };
      fetchClients();
    }
  }, [open, toast]);

  const handleSubmit = async () => {
    if (!selectedClientId || !selectedDate || !selectedTime) {
      toast({ title: 'Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const bookingDateTime = new Date(selectedDate);
      bookingDateTime.setHours(hours, minutes, 0, 0);

      await fxService.createBooking({
        userId: selectedClientId,
        therapistId: therapistId,
        date: bookingDateTime.toISOString(),
        notes: notes
      });
      
      toast({ title: 'Success', description: 'New booking created successfully.' });
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to create booking:', error);
      toast({ title: 'Error', description: 'Failed to create booking.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="client" className="text-right">Client</label>
            <Select onValueChange={setSelectedClientId} value={selectedClientId}>
              <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client"}  />
              <SelectContent>
                {clientsLoading && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    Loading clients...
                  </div>
                )}
                {clientsError && (
                  <div className="p-4 text-center text-sm text-red-500">
                    {clientsError}
                  </div>
                )}
                {!clientsLoading && !clientsError && clients.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No clients available
                  </div>
                )}
                {!clientsLoading && !clientsError && clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right pt-2">Date</label>
            <div className="col-span-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="time" className="text-right">Time</label>
            <Input
              id="time"
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="notes" className="text-right">Notes</label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes for the session"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
