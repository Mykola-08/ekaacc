'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFeature } from '@/context/FeaturesContext';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
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
  const supabase = createClient();
  const hasPriority = useFeature('booking.priority');
  const { feedback, setLoading, setSuccess, setError, reset } = useMorphingFeedback();

  useEffect(() => {
    const fetchInitial = async () => {
      // Fetch Services
      const { data: svc } = await supabase.from('services').select('*').eq('is_active', true);
      if (svc) {
        setServices(svc);
        if (serviceId) {
          const found = svc.find((s: any) => s.id === serviceId);
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

    const { data: { user } } = await supabase.auth.getUser();
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
      ends_at: new Date(selectedDate.getTime() + (selectedService.duration_minutes || 60) * 60000).toISOString(),
      status: 'scheduled',
      payment_status: 'unpaid',
      payment_mode: 'full'
    });

    if (error) {
      setError('Booking failed. Please try again.');
    } else {
      setSuccess('Booking confirmed!');
      router.push('/book/success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
            {[
              { id: 1, label: 'Service' },
              { id: 2, label: 'Therapist' },
              { id: 3, label: 'Date & Time' },
              { id: 4, label: 'Confirm' }
            ].map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 w-full">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                    >
                      {s.id}
                    </div>
                    <span className={`text-xs font-medium ${step >= s.id ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
                    {/* Progress Bar Line Connector - visual only, omitted for brevity */}
                </div>
            ))}
        </div>

        <Card className="p-6 md:p-8 min-h-125 shadow-lg border-muted/60 relative overflow-hidden">
            {/* Step 1: Select Service */}
            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Select a Service</h2>
                      <p className="text-muted-foreground">Choose the therapy that suits you best.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map(s => (
                        <div
                          key={s.id}
                          onClick={() => { setSelectedService(s); setStep(2); }}
                          className="group border rounded-xl p-4 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">{s.name}</h3>
                            <Badge variant="secondary">{s.duration_minutes}m</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                          <div className="mt-4 font-medium">€{s.base_price}</div>
                        </div>
                      ))}
                    </div>
                </div>
            )}

            {/* Step 2: Select Therapist */}
            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Select a Therapist</h2>
                      <p className="text-muted-foreground">Choose your preferred specialist.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {therapists.map(t => (
                           <div
                             key={t.id}
                             onClick={() => setSelectedTherapist(t)}
                             className={`border rounded-xl p-4 cursor-pointer transition-all ${selectedTherapist?.id === t.id ? 'border-primary ring-1 ring-primary bg-primary/5' : 'hover:border-primary/50'}`}
                           >
                             <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold mb-3">
                               {t.full_name?.[0]}
                             </div>
                             <h3 className="font-semibold">{t.full_name}</h3>
                             <p className="text-xs text-muted-foreground capitalize">{t.role}</p>
                           </div>
                        ))}
                        {therapists.length === 0 && (
                          <div className="col-span-full text-center p-8 text-muted-foreground">No therapists found.</div>
                        )}
                    </div>
                    <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                        <Button disabled={!selectedTherapist} onClick={() => setStep(3)}>Next</Button>
                    </div>
                </div>
            )}

            {/* Step 3: Select Date */}
            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Select Date & Time</h2>
                      {hasPriority && <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white">Priority Booking Active</Badge>}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                        {/* Mock Availability */}
                        {[0, 1, 2, 3].map(offset => {
                          const d = new Date();
                          d.setDate(d.getDate() + offset);
                          d.setHours(10, 0, 0, 0); // 10:00 AM fixed for now
                          return (
                            <Button
                              key={offset}
                              variant={selectedDate?.getDate() === d.getDate() ? "default" : "outline"}
                              className="h-auto py-3 flex flex-col gap-1"
                              onClick={() => setSelectedDate(d)}
                            >
                              <span className="text-xs font-normal">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                              <span className="font-bold">{d.getDate()}</span>
                              <span className="text-xs text-muted-foreground/80">10:00 AM</span>
                            </Button>
                          );
                        })}
                    </div>

                    <div className="flex justify-between mt-8">
                        <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                        <Button disabled={!selectedDate} onClick={() => setStep(4)}>Next</Button>
                    </div>
                </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold tracking-tight">Confirm Booking</h2>
                      <p className="text-muted-foreground">Please review your appointment details.</p>
                    </div>

                    <div className="bg-muted/20 p-6 rounded-xl space-y-4 max-w-md mx-auto border">
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
                          <span className="font-medium">{selectedDate?.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                          <span className="text-lg font-bold">Total</span>
                          <span className="text-lg font-bold">€{selectedService?.base_price}</span>
                        </div>
                    </div>

                    <InlineFeedback status={feedback.status} message={feedback.message} onDismiss={reset} className="max-w-md mx-auto" />

                    <div className="flex justify-between mt-4 max-w-md mx-auto">
                        <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                        <Button onClick={handleBook} disabled={feedback.status === 'loading'} className="w-full ml-4">
                          {feedback.status === 'loading' ? 'Booking...' : 'Confirm & Pay'}
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    </div>
  )
}
