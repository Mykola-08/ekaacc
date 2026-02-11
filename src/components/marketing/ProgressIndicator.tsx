import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  variant?: 'horizontal' | 'vertical';
  showLabels?: boolean;
  className?: string;
}

export default function ProgressIndicator({
  steps,
  currentStep,
  variant = 'horizontal',
  showLabels = true,
  className = '',
}: ProgressIndicatorProps) {
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStep(currentStep);
    }, 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {steps.map((step, index) => {
          const isCompleted = index < animatedStep;
          const isCurrent = index === animatedStep;

          return (
            <div key={step.id} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 transform items-center justify-center rounded-full transition-all duration-500 ${
                    isCompleted
                      ? 'scale-110 bg-success text-success-foreground'
                      : isCurrent
                        ? 'animate-pulse bg-primary text-primary-foreground ring-4 ring-info/30'
                        : 'text-muted-foreground bg-muted'
                  } `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mt-2 h-12 w-0.5 transition-all duration-500 ${isCompleted ? 'bg-success' : 'bg-muted'} `}
                  />
                )}
              </div>

              {showLabels && (
                <div className="flex-1 pb-8">
                  <h3
                    className={`font-medium transition-colors duration-300 ${
                      isCompleted
                        ? 'text-success-foreground'
                        : isCurrent
                          ? 'text-info-foreground'
                          : 'text-muted-foreground'
                    } `}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-muted-foreground mt-1 text-sm">{step.description}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < animatedStep;
        const isCurrent = index === animatedStep;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 transform items-center justify-center rounded-full transition-all duration-500 ${
                  isCompleted
                    ? 'scale-110 bg-success text-success-foreground'
                    : isCurrent
                      ? 'animate-pulse bg-primary text-primary-foreground ring-4 ring-info/30'
                      : 'text-muted-foreground bg-muted'
                } `}
              >
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>

              {showLabels && (
                <div className="mt-2 max-w-24 text-center">
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isCompleted
                        ? 'text-success-foreground'
                        : isCurrent
                          ? 'text-info-foreground'
                          : 'text-muted-foreground'
                    } `}
                  >
                    {step.title}
                  </p>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 flex-1 transition-all duration-500 ${isCompleted ? 'bg-success' : 'bg-muted'} `}
                style={{
                  background: isCompleted ? 'var(--chart-2)' : 'var(--border)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Circular progress indicator
interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  className?: string;
}

export function CircularProgress({
  percentage,
  size = 120,
  strokeWidth = 8,
  color = 'var(--primary)',
  backgroundColor = 'var(--border)',
  showPercentage = true,
  className = '',
}: CircularProgressProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90 transform">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-foreground/90 text-2xl font-bold">
            {Math.round(animatedPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
