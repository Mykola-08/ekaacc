'use client';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn('dashboard-theme space-y-2', className)}>
      <div className="text-muted-foreground flex justify-between text-sm font-medium">
        <span>
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <Progress value={progress} className="h-2 rounded-full" />
    </div>
  );
}
