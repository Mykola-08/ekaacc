'use client';
import { useState } from 'react';
import { useBookingData } from './useBookingData';
import { BookingStepIndicator } from './BookingStepIndicator';
import { ServiceStep } from './ServiceStep';
import { TherapistStep } from './TherapistStep';
import { DateTimeStep } from './DateTimeStep';
import { ConfirmStep } from './ConfirmStep';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Loading03Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Clock01Icon,
  UserCircleIcon,
} from '@hugeicons/core-free-icons';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const STEPS_COUNT = 4;

interface BookingWizardProps {
  serviceId?: string;
}

export function BookingWizard({ serviceId: initialServiceId }: BookingWizardProps = {}) {
  const { services, therapists, loading } = useBookingData();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    initialServiceId || null
  );
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedTherapist = therapists.find((t) => t.id === selectedTherapistId);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!selectedServiceId;
      case 2:
        return !!selectedTherapistId;
      case 3:
        return !!selectedDate && !!selectedTime;
      default:
        return true;
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
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-3">
          <HugeiconsIcon
            icon={Loading03Icon}
            className="size-8 text-primary animate-spin"
          />
          <p className="text-muted-foreground text-sm">Loading services…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-card/80 px-4 py-4 backdrop-blur-sm md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Book an Appointment
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Schedule your next wellness session in minutes.
              </p>
            </div>
          </div>
          <BookingStepIndicator currentStep={currentStep} totalSteps={STEPS_COUNT} />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Main card */}
          <div className="min-w-0 flex-1">
            <Card className="border-border/60 overflow-hidden rounded-2xl border-none bg-card shadow-sm">
              <div
                key={currentStep}
                className="animate-fade-in min-h-80 p-6 sm:p-8"
              >
                {currentStep === 1 && (
                  <ServiceStep
                    services={services}
                    selectedServiceId={selectedServiceId}
                    onSelect={(id) => {
                      setSelectedServiceId(id);
                      setTimeout(nextStep, 300);
                    }}
                  />
                )}
                {currentStep === 2 && (
                  <TherapistStep
                    therapists={therapists}
                    selectedTherapistId={selectedTherapistId}
                    onSelect={(id) => {
                      setSelectedTherapistId(id);
                      setTimeout(nextStep, 300);
                    }}
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
                    onConfirm={async () => {}}
                    onSuccess={() => setIsSubmitting(false)}
                    onLoad={(val) => setIsSubmitting(val)}
                  />
                )}
              </div>

              {/* Navigation footer */}
              {currentStep < 4 && (
                <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-6 py-4 sm:px-8">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    size="sm"
                    className="gap-1.5 rounded-full px-5 font-medium disabled:opacity-30"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    size="sm"
                    className="gap-1.5 rounded-full px-6 font-semibold shadow-sm"
                  >
                    Continue
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Summary sidebar */}
          <div className="w-full shrink-0 lg:w-72 xl:w-80">
            <Card className="sticky top-6 rounded-2xl border-none bg-card shadow-sm">
              <div className="p-6">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Session Summary
                </h3>

                <div className="space-y-4">
                  {/* Service */}
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Service</p>
                    {selectedService ? (
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedService.name}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {(selectedService as any).duration_minutes} min
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground/60">Not selected</p>
                    )}
                  </div>

                  <Separator className="opacity-50" />

                  {/* Therapist */}
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Therapist</p>
                    {selectedTherapist ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            (selectedTherapist as any).avatar_url ||
                            '/assets/avatar-placeholder.png'
                          }
                          alt={(selectedTherapist as any).full_name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <p className="text-sm font-semibold text-foreground">
                          {(selectedTherapist as any).full_name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground/60">Not selected</p>
                    )}
                  </div>

                  <Separator className="opacity-50" />

                  {/* Date & Time */}
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Date & Time</p>
                    {selectedDate && selectedTime ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                          <HugeiconsIcon
                            icon={Calendar03Icon}
                            className="size-3.5 text-muted-foreground"
                          />
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                          {selectedTime}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground/60">Not selected</p>
                    )}
                  </div>
                </div>

                {/* Total */}
                {selectedService && (
                  <>
                    <Separator className="my-4 opacity-50" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-lg font-bold text-foreground">
                        $
                        {(
                          (selectedService as any).price_cents / 100
                        ).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
