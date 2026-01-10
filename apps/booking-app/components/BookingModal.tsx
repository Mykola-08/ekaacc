'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, Input } from '@ekaacc/shared-ui';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Service } from '@/types/database';
import { AvailabilitySlot } from '@/types/booking';

interface BookingModalProps {
  service: Service;
  preselectedVariantId?: string;
  originApp?: string;
  trigger?: React.ReactNode;
}

export function BookingModal({ service, preselectedVariantId, originApp, trigger }: BookingModalProps) {
  const [date, setDate] = useState<Date>();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | undefined>();
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const [variantId, setVariantId] = useState(preselectedVariantId || service.variants?.[0]?.id);

  useEffect(() => {
    if (date) {
      setLoadingSlots(true);
      setSelectedSlot(undefined);
      const dateStr = format(date, 'yyyy-MM-dd');
      const variantQuery = variantId ? `&variantId=${variantId}` : '';
      
      fetch(`/api/services/${service.id}/availability?date=${dateStr}${variantQuery}`)
        .then(res => res.json())
        .then(data => {
          if (data.slots) {
            setSlots(data.slots);
          } else {
            setSlots([]);
          }
        })
        .catch(err => {
          console.error(err);
          toast.error('Failed to load availability');
          setSlots([]);
        })
        .finally(() => setLoadingSlots(false));
    } else {
      setSlots([]);
      setSelectedSlot(undefined);
    }
  }, [date, service.id, variantId]);

  const handleBooking = async () => {
    if (!date || !selectedSlot || !name || !email) {
      toast.error('Please fill in all fields and select a time');
      return;
    }

    setLoading(true);

    try {
      // 1. Create booking
      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          serviceVariantId: variantId,
          originApp,
          startTime: selectedSlot.startTime,
          email,
          displayName: name,
          paymentMode: 'deposit',
          depositCents: 2000, // 20 EUR
        }),
      });

      const bookingData = await bookingResponse.json();

      if (bookingData.error) {
        throw new Error(bookingData.error);
      }

      // 2. Initiate Checkout
      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: service.id,
          serviceName: service.name,
          price: 20, // 20 EUR deposit
          customerName: name,
          customerEmail: email,
          date: selectedSlot.startTime,
          bookingId: bookingData.bookingId, // Pass booking ID to checkout
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (checkoutData.error) {
        throw new Error(checkoutData.error);
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutData.url;
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error('Failed to initiate booking: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
            Book Now
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-surface border-border-subtle text-slate-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-100 font-serif">Book {service.name}</DialogTitle>
          <DialogDescription className="text-slate-400">
            Enter your details to book this service. Price: €{service.price}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-slate-300">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 bg-surface-highlight border-border-subtle text-slate-200 focus:border-primary"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3 bg-surface-highlight border-border-subtle text-slate-200 focus:border-primary"
              placeholder="john@example.com"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-slate-300">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal bg-surface-highlight border-border-subtle text-slate-200 hover:bg-surface hover:text-white",
                    !date && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-surface border-border-subtle">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="bg-surface text-slate-200 rounded-md border border-border-subtle"
                />
              </PopoverContent>
            </Popover>
          </div>

          {date && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right text-slate-300 pt-2">Time</Label>
              <div className="col-span-3">
                {loadingSlots ? (
                  <div className="text-sm text-slate-400 py-2">Loading available slots...</div>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSlot(slot)}
                        className={cn(
                          "text-xs border-border-subtle hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors",
                          selectedSlot === slot 
                            ? "bg-primary text-primary-foreground border-primary" 
                            : "bg-surface-highlight text-slate-300"
                        )}
                      >
                        {format(new Date(slot.startTime), 'HH:mm')}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 py-2">No slots available for this date.</div>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={handleBooking} 
            disabled={loading || !selectedSlot || !name || !email} 
            className="bg-primary text-primary-foreground hover:bg-primary-hover w-full sm:w-auto"
          >
            {loading ? 'Processing...' : 'Pay €20 Deposit & Book'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
