const fs = require('fs');
const path = require('path');

const bookingDir = path.join(__dirname, '../src/components/booking');

const wizardContent = `'use client';
import { useState } from 'react';
import { useBookingData } from './useBookingData';
import { BookingStepIndicator } from './BookingStepIndicator';
import { ServiceStep } from './ServiceStep';
import { TherapistStep } from './TherapistStep';
import { DateTimeStep } from './DateTimeStep';
import { ConfirmStep } from './ConfirmStep';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const STEPS_COUNT = 4;

interface BookingWizardProps {
  serviceId?: string;
}

export function BookingWizard({ serviceId: initialServiceId }: BookingWizardProps = {}) {
  const { services, therapists, loading } = useBookingData();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialServiceId || null);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedTherapist = therapists.find((t) => t.id === selectedTherapistId);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedServiceId;
      case 2: return !!selectedTherapistId;
      case 3: return !!selectedDate && !!selectedTime;
      default: return true;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < STEPS_COUNT) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-theme flex min-h-[400px] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="dashboard-theme min-h-screen bg-[#F4F4F5] p-4 md:p-8 isolate relative">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Book an Appointment
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Follow the steps to schedule your next session.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-2/3 space-y-8">
            <BookingStepIndicator currentStep={currentStep} totalSteps={STEPS_COUNT} />

            <Card className="bg-white overflow-hidden rounded-[36px] border-none shadow-sm min-h-[500px] flex flex-col pt-10 px-8 pb-8 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex-grow"
                >
                  {currentStep === 1 && (
                    <ServiceStep
                      services={services}
                      selectedServiceId={selectedServiceId}
                      onSelect={(id) => { setSelectedServiceId(id); setTimeout(nextStep, 300); }}
                    />
                  )}
                  {currentStep === 2 && (
                    <TherapistStep
                      therapists={therapists}
                      selectedTherapistId={selectedTherapistId}
                      onSelect={(id) => { setSelectedTherapistId(id); setTimeout(nextStep, 300); }}
                    />
                  )}
                  {currentStep === 3 && (
                    <DateTimeStep
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      selectedTime={selectedTime}
                      onSelectTime={setSelectedTime}
                      serviceId={selectedServiceId!}
                    />
                  )}
                  {currentStep === 4 && (
                    <ConfirmStep
                      selectedService={selectedService!}
                      selectedTherapist={selectedTherapist!}
                      selectedDate={selectedDate!}
                      selectedTime={selectedTime!}
                      onConfirm={async (data) => {
                        // Handled in block
                      }}
                      onSuccess={() => setIsSubmitting(false)}
                      onLoad={(val) => setIsSubmitting(val)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {currentStep < 4 && (
                <div className="border-border/50 mt-8 flex items-center justify-between border-t pt-6">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="rounded-full px-6 font-medium transition-all hover:bg-muted"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="rounded-full px-8 font-semibold transition-all shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
                    size="lg"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </Card>
          </div>

          <div className="w-full lg:w-1/3 sticky top-8">
            <Card className="bg-white rounded-[36px] p-8 border-none shadow-sm">
              <h3 className="text-xl font-bold mb-6">Your Session Summary</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Service</p>
                  <p className="font-medium text-foreground">
                    {selectedService ? selectedService.name : '—'}
                  </p>
                  {selectedService && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedService.duration_minutes} min • \${(selectedService.price_cents / 100).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="h-px w-full bg-border/50" />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Therapist</p>
                  <p className="font-medium text-foreground">
                    {selectedTherapist ? selectedTherapist.full_name : '—'}
                  </p>
                </div>

                <div className="h-px w-full bg-border/50" />

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Date & Time</p>
                  <p className="font-medium text-foreground">
                    {selectedDate && selectedTime ? (
                      selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + ' at ' + selectedTime
                    ) : '—'}
                  </p>
                </div>
                
                <div className="pt-6 mt-6 border-t border-border/50 flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>{selectedService ? \`\$\${(selectedService.price_cents / 100).toFixed(2)}\` : '—'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(bookingDir, 'BookingWizard.tsx'), wizardContent);
console.log('Done booking wizard!');
