'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createNewBookingAction } from '@/server/actions/booking-actions';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle01Icon,
  Loading03Icon,
  Alert01Icon,
  Calendar03Icon,
  Clock01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

interface ConfirmStepProps {
  selectedService: any;
  selectedTherapist: any;
  selectedDate: Date;
  selectedTime: string;
  onSuccess: () => void;
}

export function ConfirmStep({
  selectedService,
  selectedTherapist,
  selectedDate,
  selectedTime,
  onSuccess,
}: ConfirmStepProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;

    const startTime = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    startTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    const endTime = new Date(
      startTime.getTime() + selectedService.duration_minutes * 60000
    );

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
        staffId: selectedTherapist.id,
      });

      if (!res.success) throw new Error(res.error || 'Failed to create booking');
      setSuccess(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-80 flex-col items-center justify-center space-y-5 py-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-foreground text-2xl font-bold">Booking Confirmed!</h2>
          <p className="text-muted-foreground mx-auto max-w-xs text-sm leading-relaxed">
            A confirmation has been sent to your email. We look forward to seeing you.
          </p>
        </div>
        <Button
          onClick={() => router.push('/bookings')}
          size="lg"
          className="mt-2 rounded-lg px-8"
        >
          View My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Your Details</h2>
        <p className="text-muted-foreground text-sm">
          Just a few details to complete your booking.
        </p>
      </div>

      {/* Booking mini-summary */}
      <div className="bg-muted/40 rounded-xl border border-border p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2.5">
            <div className="pf-icon-well-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <HugeiconsIcon icon={UserCircleIcon} className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Therapist</p>
              <p className="text-foreground truncate text-sm font-semibold">
                {selectedTherapist?.full_name || selectedTherapist?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="pf-icon-well-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <HugeiconsIcon icon={Calendar03Icon} className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Date</p>
              <p className="text-foreground truncate text-sm font-semibold">
                {selectedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="pf-icon-well-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
              <HugeiconsIcon icon={Clock01Icon} className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-xs">Time</p>
              <p className="text-foreground truncate text-sm font-semibold">{selectedTime}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive flex items-center gap-3 rounded-lg p-4 text-sm">
          <HugeiconsIcon icon={Alert01Icon} className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First name
            </Label>
            <Input
              required
              id="firstName"
              name="firstName"
              placeholder="Jane"
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last name
            </Label>
            <Input
              required
              id="lastName"
              name="lastName"
              placeholder="Smith"
              className="h-10 rounded-lg"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email address
          </Label>
          <Input
            required
            type="email"
            id="email"
            name="email"
            placeholder="jane@example.com"
            className="h-10 rounded-lg"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone{' '}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+1 555 000 0000"
            className="h-10 rounded-lg"
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className={cn(
              'h-12 w-full rounded-lg text-base font-semibold transition-all',
              loading && 'opacity-70'
            )}
          >
            {loading ? (
              <HugeiconsIcon icon={Loading03Icon} className="mr-2 size-5 animate-spin" />
            ) : null}
            {loading ? 'Confirming…' : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    </div>
  );
}
