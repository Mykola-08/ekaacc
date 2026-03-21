'use client';
import { useState, useEffect } from 'react';
import { useBookingData } from './useBookingData';
import { BookingStepIndicator } from './BookingStepIndicator';
import { ServiceStep } from './ServiceStep';
import { TherapistStep } from './TherapistStep';
import { DateTimeStep } from './DateTimeStep';
import { ConfirmStep } from './ConfirmStep';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HugeiconsIcon } from '@hugeicons/react';
import {
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
  const { services, therapists, loading, error } = useBookingData();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    initialServiceId || null
  );
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedTherapist = therapists.find((t) => t.id === selectedTherapistId);

  useEffect(() => {
    if (selectedService && currentStep === 1) setCurrentStep(2);
  }, [selectedService]);

  useEffect(() => {
    if (selectedTherapist && currentStep === 2) setCurrentStep(3);
  }, [selectedTherapist]);

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
      <div className="bg-muted min-h-screen">
        <div className="border-border bg-background border-b px-4 py-4 md:px-8">
          <div className="mx-auto max-w-6xl">
            <Skeleton className="mb-1 h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="min-w-0 flex-1">
              <Card className="overflow-hidden rounded-[var(--radius)] border-none shadow-sm">
                <div className="space-y-4 p-6 sm:p-8">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                  <div className="grid gap-3 pt-1 sm:grid-cols-2">
                    <Skeleton className="h-28 rounded-[var(--radius)]" />
                    <Skeleton className="h-28 rounded-[var(--radius)]" />
                    <Skeleton className="h-28 rounded-[var(--radius)]" />
                    <Skeleton className="h-28 rounded-[var(--radius)]" />
                  </div>
                </div>
              </Card>
            </div>
            <div className="w-full shrink-0 lg:w-72 xl:w-80">
              <Card className="rounded-[var(--radius)] border-none shadow-sm">
                <div className="space-y-4 p-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-muted flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-[var(--radius)] border-none p-6 text-center">
          <p className="text-destructive text-sm font-semibold">Could not load booking data</p>
          <p className="text-muted-foreground mt-1 text-sm">{error}</p>
          <Button className="mt-4 rounded-[calc(var(--radius)*0.8)]" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-muted flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md rounded-[var(--radius)] border-none p-6 text-center">
          <p className="text-foreground text-sm font-semibold">No services available right now</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Please check back soon or contact support.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted min-h-screen">
      {/* Top bar */}
      <div className="border-border bg-background border-b px-4 py-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
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
            <Card className="border-border/60 bg-card overflow-hidden rounded-[var(--radius)] border-none shadow-sm">
              <div key={currentStep} className="animate-fade-in min-h-80 p-6 sm:p-8">
                {currentStep === 1 && (
                  <ServiceStep
                    services={services}
                    selectedServiceId={selectedServiceId}
                    onSelect={(id) => {
                      setSelectedServiceId(id);
                    }}
                  />
                )}
                {currentStep === 2 && (
                  <TherapistStep
                    therapists={therapists}
                    selectedTherapistId={selectedTherapistId}
                    onSelect={(id) => {
                      setSelectedTherapistId(id);
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
                    onSuccess={() => { }}
                  />
                )}
              </div>

              {/* Navigation footer */}
              {currentStep < 4 && (
                <div className="border-border bg-muted/30 flex items-center justify-between border-t px-6 py-4 sm:px-8">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    size="sm"
                    className="gap-1.5 rounded-[calc(var(--radius)*0.8)] px-5 font-medium disabled:opacity-30"
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    size="sm"
                    className="gap-1.5 rounded-[calc(var(--radius)*0.8)] px-6 font-semibold shadow-sm"
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
            <Card className="bg-card sticky top-6 rounded-[var(--radius)] border-none shadow-sm">
              <div className="p-6">
                <h3 className="text-muted-foreground mb-4 text-sm font-semibold tracking-wider uppercase">
                  Session Summary
                </h3>

                <div className="space-y-4">
                  {/* Service */}
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">Service</p>
                    {selectedService ? (
                      <div>
                        <p className="text-foreground text-sm font-semibold">
                          {selectedService.name}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {(selectedService as any).duration_minutes} min
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground/60 text-sm">Not selected</p>
                    )}
                  </div>

                  <Separator className="opacity-50" />

                  {/* Therapist */}
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">Therapist</p>
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
                        <p className="text-foreground text-sm font-semibold">
                          {(selectedTherapist as any).full_name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground/60 text-sm">Not selected</p>
                    )}
                  </div>

                  <Separator className="opacity-50" />

                  {/* Date & Time */}
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium">Date & Time</p>
                    {selectedDate && selectedTime ? (
                      <div className="space-y-1">
                        <div className="text-foreground flex items-center gap-1.5 text-sm font-semibold">
                          <HugeiconsIcon
                            icon={Calendar03Icon}
                            className="text-muted-foreground size-3.5"
                          />
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
                          {selectedTime}
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground/60 text-sm">Not selected</p>
                    )}
                  </div>
                </div>

                {/* Total */}
                {selectedService && (
                  <>
                    <Separator className="my-4 opacity-50" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">Total</span>
                      <span className="text-foreground text-lg font-bold">
                        ${((selectedService as any).price_cents / 100).toFixed(2)}
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
