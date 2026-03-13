'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFeature } from '@/context/FeaturesContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { InlineFeedback } from '@/components/ui/inline-feedback';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { Badge } from '@/components/ui/badge';

export default function BookingWizard({ serviceId }: { serviceId?: string }) {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const hasPriority = useFeature('booking.priority');
  const { feedback, setLoading, setSuccess, setError, reset } = useMorphingFeedback();

  useEffect(() => {
    const fetchInitial = async () => {
      // Fetch Services
      const { data: svc } = await supabase.from('services').select('*').eq('is_active', true);
      if (svc) {
        setServices(svc);
        const urlService = searchParams.get('service') || searchParams.get('subject');
        const targetId = serviceId || urlService;

        if (targetId) {
          const found = svc.find(
            (s: any) =>
              s.id === targetId ||
              s.slug === targetId ||
              s.name?.toLowerCase().includes(targetId.toLowerCase())
          );
          if (found) {
            setSelectedService(found);
            setStep(2); // Skip to therapist if service pre-selected
          }
        }
      }

      // Fetch Therapists
      const { data: thr } = await supabase.from('profiles').select('*').eq('role', 'therapist');
      if (thr) setTherapists(thr);
    };
    fetchInitial();
  }, [serviceId, supabase]);

  const handleBook = async () => {
    if (!selectedService || !selectedTherapist || !selectedDate) return;

    // Get current user
    setLoading('Creating booking...');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError('Please login to complete booking');
      router.push('/login?next=/book');
      return;
    }

    const { error } = await supabase.from('bookings').insert({
      service_id: selectedService.id,
      therapist_id: selectedTherapist.id,
      client_id: user.id,
      starts_at: selectedDate.toISOString(),
      ends_at: new Date(
        selectedDate.getTime() + (selectedService.duration_minutes || 60) * 60000
      ).toISOString(),
      status: 'scheduled',
      payment_status: 'unpaid',
      payment_mode: 'full',
    });

    if (error) {
      setError('Booking failed. Please try again.');
    } else {
      setSuccess('Booking confirmed!');
      router.push('/book/success');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-between px-2">
        {[
          { id: 1, label: 'Service' },
          { id: 2, label: 'Therapist' },
          { id: 3, label: 'Date & Time' },
          { id: 4, label: 'Confirm' },
        ].map((s) => (
          <div key={s.id} className="relative z-10 flex w-full flex-col items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {s.id}
            </div>
            <span
              className={`text-xs font-medium ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              {s.label}
            </span>
            {/* Progress Bar Line Connector - visual only, omitted for brevity */}
          </div>
        ))}
      </div>

      <Card className="border-muted/60 relative min-h-125 overflow-hidden p-6 shadow-lg md:p-8">
        {/* Step 1: Select Service */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Select a Service</h2>
              <p className="text-muted-foreground">Choose the therapy that suits you best.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s);
                    setStep(2);
                  }}
                  className="group hover:border-primary/50 hover:bg-muted/30 cursor-pointer rounded-xl border p-4 transition-all"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="group-hover:text-primary font-semibold transition-colors">
                      {s.name}
                    </h3>
                    <Badge variant="secondary">{s.duration_minutes}m</Badge>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-sm">{s.description}</p>
                  <div className="mt-4 font-medium">€{s.base_price}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Therapist */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Select a Therapist</h2>
              <p className="text-muted-foreground">Choose your preferred specialist.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {therapists.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTherapist(t)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${selectedTherapist?.id === t.id ? 'border-primary ring-primary bg-primary/5 ring-1' : 'hover:border-primary/50'}`}
                >
                  <div className="bg-muted mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold">
                    {t.full_name?.[0]}
                  </div>
                  <h3 className="font-semibold">{t.full_name}</h3>
                  <p className="text-muted-foreground text-xs capitalize">{t.role}</p>
                </div>
              ))}
              {therapists.length === 0 && (
                <div className="text-muted-foreground col-span-full p-8 text-center">
                  No therapists found.
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button disabled={!selectedTherapist} onClick={() => setStep(3)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Select Date */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Select Date & Time</h2>
              {hasPriority && (
                <Badge variant="default" className="bg-yellow-500 text-white hover:bg-yellow-600">
                  Priority Booking Active
                </Badge>
              )}
            </div>

            <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
              {/* Mock Availability */}
              {[0, 1, 2, 3].map((offset) => {
                const d = new Date();
                d.setDate(d.getDate() + offset);
                d.setHours(10, 0, 0, 0); // 10:00 AM fixed for now
                return (
                  <Button
                    key={offset}
                    variant={selectedDate?.getDate() === d.getDate() ? 'default' : 'outline'}
                    className="flex h-auto flex-col gap-1 py-3"
                    onClick={() => setSelectedDate(d)}
                  >
                    <span className="text-xs font-normal">
                      {d.toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                    <span className="font-bold">{d.getDate()}</span>
                    <span className="text-muted-foreground/80 text-xs">10:00 AM</span>
                  </Button>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button disabled={!selectedDate} onClick={() => setStep(4)}>
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight">Confirm Booking</h2>
              <p className="text-muted-foreground">Please review your appointment details.</p>
            </div>

            <div className="bg-muted/20 mx-auto max-w-md rounded-xl border p-6">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Therapist</span>
                <span className="font-medium">{selectedTherapist?.full_name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">{selectedDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">
                  {selectedDate?.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">€{selectedService?.base_price}</span>
              </div>
            </div>

            <InlineFeedback
              status={feedback.status}
              message={feedback.message}
              onDismiss={reset}
              className="mx-auto max-w-md"
            />

            <div className="mx-auto mt-4 flex max-w-md justify-between">
              <Button variant="outline" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={handleBook}
                disabled={feedback.status === 'loading'}
                className="ml-4 w-full"
              >
                {feedback.status === 'loading' ? 'Booking...' : 'Confirm & Pay'}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
