'use client';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon } from '@hugeicons/core-free-icons';

const STEP_LABELS = ['Service', 'Therapist', 'Date & Time', 'Details'];

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function BookingStepIndicator({
  currentStep,
  totalSteps,
  className,
}: BookingStepIndicatorProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1;
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div key={step} className="flex flex-1 items-center">
              {/* Step bubble + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ring-2 transition-all duration-300',
                    isCompleted && 'bg-primary ring-primary text-primary-foreground',
                    isCurrent &&
                      'bg-primary ring-primary/30 text-primary-foreground shadow-md ring-4',
                    isUpcoming &&
                      'bg-muted ring-border text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <HugeiconsIcon icon={Tick02Icon} className="size-4" />
                  ) : (
                    <span>{step}</span>
                  )}
                </div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    isCurrent && 'text-foreground',
                    isCompleted && 'text-primary',
                    isUpcoming && 'text-muted-foreground'
                  )}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>

              {/* Connector line between steps */}
              {step < totalSteps && (
                <div className="mx-2 h-px flex-1 transition-all duration-300"
                  style={{
                    background: isCompleted
                      ? 'var(--primary)'
                      : 'var(--border)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
