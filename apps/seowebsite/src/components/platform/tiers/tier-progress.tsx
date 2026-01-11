import React from 'react';
import { cn } from '@/lib/platform/utils/css-utils';
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
  animated = true
}: TierProgressProps) {
  const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);
  const isComplete = currentProgress >= targetProgress;

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Progress to {tierName}
          </span>
          <span className="text-sm text-gray-500">
            {currentProgress} / {targetProgress}
          </span>
        </div>
        
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentProgress} aria-valuemin={0} aria-valuemax={targetProgress}>
          <div
            className={cn(
              'absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full',
              isComplete ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500',
              animated && 'animate-pulse'
            )}
            style={{ width: `${progressPercentage}%` }}
          />
          
          {isComplete && (
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white animate-bounce" />
            </div>
          )}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span className={cn(
            'font-semibold',
            isComplete ? 'text-green-600' : 'text-blue-600'
          )}>
            {Math.round(progressPercentage)}%
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Requirements List */}
      {showDetails && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800">Requirements:</h4>
          
          <div className="space-y-2">
            {requirements.map((requirement, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border transition-all duration-200',
                  index < Math.ceil(requirements.length * (currentProgress / targetProgress))
                    ? 'bg-green-50 border-green-200'
                    : 'bg-gray-50 border-gray-200'
                )}
              >
                {index < Math.ceil(requirements.length * (currentProgress / targetProgress)) ? (
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
                
                <span className={cn(
                  'text-sm',
                  index < Math.ceil(requirements.length * (currentProgress / targetProgress))
                    ? 'text-green-700 line-through'
                    : 'text-gray-700'
                )}>
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
          <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <ArrowUp className="h-4 w-4" />
            Next Level Requirements:
          </h4>
          
          <div className="space-y-1">
            {nextRequirements.slice(0, 3).map((requirement, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg bg-gray-100 border border-gray-200"
              >
                <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600">{requirement}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Message */}
      {isComplete && (
        <div className="p-4 bg-green-100 border border-green-200 rounded-lg">
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
  animated = true
}: CircularTierProgressProps) {
  const sizeConfig = {
    sm: { diameter: 60, fontSize: 'text-sm' },
    md: { diameter: 80, fontSize: 'text-base' },
    lg: { diameter: 120, fontSize: 'text-lg' }
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
        className={cn('transform -rotate-90', animated && 'animate-pulse')}
      >
        {/* Background circle */}
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="#e5e7eb"
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
          className={cn(
            'transition-all duration-1000 ease-out',
            animated && 'animate-pulse'
          )}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      
      {showPercentage && (
        <div className={cn('absolute inset-0 flex items-center justify-center', fontSize)}>
          <span className="font-semibold text-gray-700">
            {Math.round(progress)}%
          </span>
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
  showUnavailable = false
}: TierBenefitsListProps) {
  const availableBenefits = benefits.filter(b => b.available);
  const unavailableBenefits = benefits.filter(b => !b.available);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Available Benefits */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-green-700 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Available Benefits
        </h4>
        
        <div className="space-y-2">
          {availableBenefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                {benefit.icon || <CheckCircle className="h-4 w-4 text-green-500" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">{benefit.name}</p>
                <p className="text-xs text-green-600 mt-1">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unavailable Benefits */}
      {showUnavailable && unavailableBenefits.length > 0 && (
        <div className="space-y-2 mt-4">
          <h4 className="text-sm font-semibold text-gray-500 flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Locked Benefits
          </h4>
          
          <div className="space-y-2">
            {unavailableBenefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg opacity-60"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600">{benefit.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}