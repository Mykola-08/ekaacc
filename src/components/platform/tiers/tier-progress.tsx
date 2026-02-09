import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUp, CheckCircle, Circle, Lock } from 'lucide-react';

export interface TierProgressProps {
  currentProgress: number;
  targetProgress: number;
  requirements: string[];
  nextRequirements?: string[];
  tierName: string;
  className?: string;
  showDetails?: boolean;
  animated?: boolean;
}

export function TierProgressIndicator({
  currentProgress,
  targetProgress,
  requirements,
  nextRequirements = [],
  tierName,
  className,
  showDetails = true,
  animated = true,
}: TierProgressProps) {
  const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);
  const isComplete = currentProgress >= targetProgress;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-foreground/90 text-sm font-medium">Progress to {tierName}</span>
          <span className="text-muted-foreground text-sm">
            {currentProgress} / {targetProgress}
          </span>
        </div>

        <div
          className="relative h-3 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={currentProgress}
          aria-valuemin={0}
          aria-valuemax={targetProgress}
        >
          <div
            className={cn(
              'absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out',
              isComplete ? 'bg-green-500' : 'bg-linear-to-r from-blue-500 to-purple-500',
              animated && 'animate-pulse'
            )}
            style={{ width: `${progressPercentage}%` }}
          />

          {isComplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 animate-bounce text-white" />
            </div>
          )}
        </div>

        <div className="text-muted-foreground flex justify-between text-xs">
          <span>0%</span>
          <span className={cn('font-semibold', isComplete ? 'text-green-600' : 'text-blue-600')}>
            {Math.round(progressPercentage)}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Requirements List */}
      {showDetails && (
        <div className="space-y-3">
          <h4 className="text-foreground text-sm font-semibold">Requirements:</h4>

          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 rounded-lg border p-3 transition-all duration-200',
                  index < Math.ceil(requirements.length * (currentProgress / targetProgress))
                    ? 'border-green-200 bg-green-50'
                    : 'bg-muted/30 border-border'
                )}
              >
                {index < Math.ceil(requirements.length * (currentProgress / targetProgress)) ? (
                  <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
                ) : (
                  <Circle className="text-muted-foreground/80 h-4 w-4 shrink-0" />
                )}

                <span
                  className={cn(
                    'text-sm',
                    index < Math.ceil(requirements.length * (currentProgress / targetProgress))
                      ? 'text-green-700 line-through'
                      : 'text-foreground/90'
                  )}
                >
                  {requirement}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Requirements Preview */}
      {nextRequirements.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-foreground flex items-center gap-2 text-sm font-semibold">
            <ArrowUp className="h-4 w-4" />
            Next Level Requirements:
          </h4>

          <div className="space-y-1">
            {nextRequirements.slice(0, 3).map((requirement, index) => (
              <div
                key={index}
                className="bg-muted border-border flex items-center gap-3 rounded-lg border p-2"
              >
                <Lock className="text-muted-foreground/80 h-3 w-3 shrink-0" />
                <span className="text-muted-foreground text-xs">{requirement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className="rounded-lg border border-green-200 bg-green-100 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Congratulations! You've met all requirements for {tierName} tier.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export interface CircularTierProgressProps {
  progress: number;
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function CircularTierProgress({
  progress,
  size = 'md',
  strokeWidth = 4,
  className,
  showPercentage = true,
  animated = true,
}: CircularTierProgressProps) {
  const sizeConfig = {
    sm: { diameter: 60, fontSize: 'text-sm' },
    md: { diameter: 80, fontSize: 'text-base' },
    lg: { diameter: 120, fontSize: 'text-lg' },
  };

  const { diameter, fontSize } = sizeConfig[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={diameter}
        height={diameter}
        className={cn('-rotate-90 transform', animated && 'animate-pulse')}
      >
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-1000 ease-out', animated && 'animate-pulse')}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--chart-5))" />
          </linearGradient>
        </defs>
      </svg>

      {showPercentage && (
        <div className={cn('absolute inset-0 flex items-center justify-center', fontSize)}>
          <span className="text-foreground/90 font-semibold">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );
}

export interface TierBenefitsListProps {
  benefits: Array<{
    name: string;
    description: string;
    available: boolean;
    icon?: React.ReactNode;
  }>;
  className?: string;
  showUnavailable?: boolean;
}

export function TierBenefitsList({
  benefits,
  className,
  showUnavailable = false,
}: TierBenefitsListProps) {
  const availableBenefits = benefits.filter((b) => b.available);
  const unavailableBenefits = benefits.filter((b) => !b.available);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Available Benefits */}
      <div className="space-y-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-green-700">
          <CheckCircle className="h-4 w-4" />
          Available Benefits
        </h4>

        <div className="space-y-2">
          {availableBenefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-3"
            >
              <div className="mt-0.5 shrink-0">
                {benefit.icon || <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-green-800">{benefit.name}</p>
                <p className="mt-1 text-xs text-green-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unavailable Benefits */}
      {showUnavailable && unavailableBenefits.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
            <Lock className="h-4 w-4" />
            Locked Benefits
          </h4>

          <div className="space-y-2">
            {unavailableBenefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-muted/30 border-border flex items-start gap-3 rounded-lg border p-3 opacity-60"
              >
                <div className="mt-0.5 shrink-0">
                  <Lock className="text-muted-foreground/80 h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground text-sm font-medium">{benefit.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
