"use client";

import { Button, Input, Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle, Select, SelectContent, SelectItem, SelectValue } from '@/components/keep';
import React, { useState, useEffect } from 'react';
;
;
;
;
;
import { useToast } from '@/hooks/use-toast';
import fxService from '@/lib/fx-service';
import type { User } from '@/lib/types';

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
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      const fetchClients = async () => {
        try {
          const users = await fxService.getUsers();
          const patients = users.filter(u => !u.role || u.role === 'Patient');
          setClients(patients);
        } catch (error) {
          console.error('Failed to fetch clients:', error);
          toast({ title: 'Error', description: 'Could not load clients.', variant: 'destructive' });
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

      await fxService.createBooking(selectedClientId, therapistId, bookingDateTime.toISOString(), notes);
      
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
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-[425px]">
        <ModalHeader>
          <ModalTitle>Create New Booking</ModalTitle>
        </ModalHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="client" className="text-right">Client</label>
            <Select onValueChange={setSelectedClientId} value={selectedClientId}>
              <SelectValue placeholder="Select a client"  />
              <SelectContent>
                {clients.map(client => (
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
        <ModalFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Booking'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
