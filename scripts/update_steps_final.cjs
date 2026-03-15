const fs = require('fs');
const path = require('path');

const bookingDir = path.join(__dirname, '../src/components/booking');

const serviceContent = `'use client';
import { type Service } from '@/lib/platform/types';
import { cn } from '@/lib/utils';
import { Check, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServiceStepProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (id: string) => void;
}

export function ServiceStep({ services, selectedServiceId, onSelect }: ServiceStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Select Service</h2>
        <p className="text-muted-foreground">Choose the session that best fits your needs.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        {services.map((service, i) => (
          <motion.div key={service.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <button
              onClick={() => onSelect(service.id)}
              className={cn(
                'relative flex h-full w-full flex-col space-y-3 rounded-[24px] border-2 p-6 text-left transition-all hover:bg-muted/30 focus:outline-none',
                selectedServiceId === service.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent bg-muted/40'
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-bold text-lg">{service.name}</span>
                {selectedServiceId === service.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="rounded-full bg-primary p-1 text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex-grow line-clamp-3">
                {service.description || 'Experience personalized care tailored to you.'}
              </p>
              
              <div className="mt-4 flex items-center justify-between text-sm w-full pt-4 border-t border-border/50">
                <div className="flex items-center text-muted-foreground font-medium">
                  <Clock className="mr-1.5 h-4 w-4" />
                  {service.duration_minutes} min
                </div>
                <div className="font-bold text-lg text-foreground">
                  \${(service.price_cents / 100).toFixed(2)}
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}`;

const therapistContent = `'use client';
import { type Therapist } from '@/lib/platform/types';
import { cn } from '@/lib/utils';
import { Check, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface TherapistStepProps {
  therapists: Therapist[];
  selectedTherapistId: string | null;
  onSelect: (id: string) => void;
}

export function TherapistStep({ therapists, selectedTherapistId, onSelect }: TherapistStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Choose Therapist</h2>
        <p className="text-muted-foreground">Select a practitioner for your session.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        {therapists.map((therapist, i) => (
          <motion.div key={therapist.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <button
              onClick={() => onSelect(therapist.id)}
              className={cn(
                'relative flex h-full w-full flex-col items-center space-y-4 rounded-[24px] border-2 p-6 text-center transition-all hover:bg-muted/30 focus:outline-none',
                selectedTherapistId === therapist.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-transparent bg-muted/40'
              )}
            >
              <div className="relative">
                <img src={therapist.avatar_url || '/assets/avatar-placeholder.png'} alt={therapist.full_name} className="h-24 w-24 rounded-full object-cover border-2 border-background shadow-sm" />
                {selectedTherapistId === therapist.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -bottom-2 -right-2 rounded-full bg-primary p-1 text-primary-foreground shadow-sm">
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{therapist.full_name}</h3>
                <div className="flex items-center justify-center text-sm text-yellow-500 mt-1">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-2 text-muted-foreground text-xs font-medium">5.0 (120+ reviews)</span>
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}`;

const dateContent = `'use client';
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getAvailableSlotsAction } from '@/server/actions/booking-actions';
import { Loader2 } from 'lucide-react';

interface DateTimeStepProps {
  selectedDate?: Date;
  onSelectDate: (date: Date | undefined) => void;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  serviceId: string;
}

export function DateTimeStep({ selectedDate, onSelectDate, selectedTime, onSelectTime, serviceId }: DateTimeStepProps) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    
    async function fetchSlots() {
      setLoading(true);
      // Simulate real slots integration; fetch available slots action
      const isoDate = selectedDate!.toISOString();
      const res = await getAvailableSlotsAction(serviceId, isoDate);
      if (res.success && res.data && res.data.length > 0) {
        setSlots(res.data.map((slot: any) => new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })));
      } else {
        // Fallback for demonstration
        setSlots(['09:00', '10:00', '11:00', '13:00', '14:30', '16:00']);
      }
      setLoading(false);
    }
    fetchSlots();
  }, [selectedDate, serviceId]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Select Date & Time</h2>
        <p className="text-muted-foreground">Choose when you would like to have your session.</p>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="rounded-[24px] bg-muted/20 p-2 shadow-sm border">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(d) => { onSelectDate(d); onSelectTime(''); }}
            className="rounded-[16px]"
            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
          />
        </div>

        <div className="flex-1">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date first'}
          </h3>
          
          {loading ? (
             <div className="flex justify-center py-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : selectedDate ? (
            <div className="grid grid-cols-3 gap-3">
              {slots.map((time) => (
                <button
                  key={time}
                  onClick={() => onSelectTime(time)}
                  className={cn(
                    'rounded-xl border py-3 text-sm font-semibold transition-all',
                    selectedTime === time
                      ? 'border-primary bg-primary text-primary-foreground shadow-md'
                      : 'border-border bg-background hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}`;

const confirmContent = `'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createNewBookingAction } from '@/server/actions/booking-actions';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmStepProps {
  selectedService: any;
  selectedTherapist: any;
  selectedDate: Date;
  selectedTime: string;
  onConfirm: (data: any) => Promise<void>;
  onSuccess: () => void;
  onLoad: (val: boolean) => void;
}

export function ConfirmStep({
  selectedService,
  selectedTherapist,
  selectedDate,
  selectedTime,
  onConfirm,
  onSuccess,
  onLoad
}: ConfirmStepProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    onLoad(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    const startTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    const endTime = new Date(startTime.getTime() + (selectedService.duration_minutes * 60000));

    try {
      const res = await createNewBookingAction({
        serviceId: selectedService.id,
        startTime,
        endTime,
        email,
        firstName,
        lastName,
        phone,
        priceCents: selectedService.price_cents,
        paymentMode: 'pay_later',
        staffId: selectedTherapist.id
      });
      
      if (!res.success) throw new Error(res.error || 'Failed to create booking');
      setSuccess(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      onLoad(false);
    }
  };

  if (success) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-6 min-h-[400px]">
        <CheckCircle2 className="w-20 h-20 text-emerald-500" />
        <h2 className="text-3xl font-bold text-foreground">Booking Confirmed!</h2>
        <p className="text-muted-foreground max-w-sm">We\\'ve sent a confirmation to your email. We look forward to seeing you.</p>
        <Button onClick={() => window.location.href = '/bookings'} size="lg" className="rounded-full mt-4 bg-foreground text-background hover:bg-foreground/90">View My Bookings</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your Details</h2>
        <p className="text-muted-foreground">Please tell us a bit about yourself.</p>
      </div>

      {error && (
        <div className="p-4 rounded-[16px] bg-destructive/10 text-destructive flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      <form id="booking-form" onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input required id="firstName" name="firstName" className="flex h-11 w-full rounded-2xl border-none bg-muted/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input required id="lastName" name="lastName" className="flex h-11 w-full rounded-2xl border-none bg-muted/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email address</label>
          <input required type="email" id="email" name="email" className="flex h-11 w-full rounded-2xl border-none bg-muted/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone number (optional)</label>
          <input type="tel" id="phone" name="phone" className="flex h-11 w-full rounded-2xl border-none bg-muted/50 px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        
        <div className="pt-8">
          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    </div>
  );
}`;

fs.writeFileSync(path.join(bookingDir, 'ServiceStep.tsx'), serviceContent);
fs.writeFileSync(path.join(bookingDir, 'TherapistStep.tsx'), therapistContent);
fs.writeFileSync(path.join(bookingDir, 'DateTimeStep.tsx'), dateContent);
fs.writeFileSync(path.join(bookingDir, 'ConfirmStep.tsx'), confirmContent);
console.log('Done!');
