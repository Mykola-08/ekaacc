'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createNewBookingAction } from '@/server/actions/booking-actions';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, Loading03Icon, Alert01Icon } from '@hugeicons/core-free-icons';

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
  onLoad,
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
    const endTime = new Date(startTime.getTime() + selectedService.duration_minutes * 60000);

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
      onLoad(false);
    }
  };

  if (success) {
    return (
      <div
        className="flex h-full min-h-100 flex-col items-center justify-center space-y-6 text-center"
      >
        <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-20 text-primary" />
        <h2 className="text-foreground text-3xl font-bold">Booking Confirmed!</h2>
        <p className="text-muted-foreground max-w-sm">
          We\'ve sent a confirmation to your email. We look forward to seeing you.
        </p>
        <Button
          onClick={() => (window.location.href = '/bookings')}
          size="lg"
          className="bg-foreground text-background hover:bg-foreground/90 mt-4 rounded-full"
        >
          View My Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Your Details</h2>
        <p className="text-muted-foreground">Please tell us a bit about yourself.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive flex items-center gap-3 rounded-lg p-4">
          <HugeiconsIcon icon={Alert01Icon} className="size-5" />
          <span>{error}</span>
        </div>
      )}

      <form id="booking-form" onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              First name
            </label>
            <Input
              required
              id="firstName"
              name="firstName"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last name
            </label>
            <Input
              required
              id="lastName"
              name="lastName"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            required
            type="email"
            id="email"
            name="email"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Phone number (optional)
          </label>
          <Input
            type="tel"
            id="phone"
            name="phone"
          />
        </div>

        <div className="pt-8">
          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 w-full rounded-full text-lg"
          >
            {loading ? <HugeiconsIcon icon={Loading03Icon} className="mr-2 size-5 animate-spin" /> : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    </div>
  );
}
