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
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform
                    ${isCompleted 
                      ? 'bg-green-500 text-white scale-110' 
                      : isCurrent 
                        ? 'bg-blue-500 text-white ring-4 ring-blue-200 animate-pulse' 
                        : 'bg-gray-200 text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-0.5 h-12 mt-2 transition-all duration-500
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
              
              {showLabels && (
                <div className="flex-1 pb-8">
                  <h3
                    className={`
                      font-medium transition-colors duration-300
                      ${isCompleted 
                        ? 'text-green-700' 
                        : isCurrent 
                          ? 'text-blue-700' 
                          : 'text-muted-foreground'
                      }
                    `}
                  >
                    {step.title}
                  </h3>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
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
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 transform
                  ${isCompleted 
                    ? 'bg-green-500 text-white scale-110' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200 animate-pulse' 
                      : 'bg-gray-200 text-muted-foreground'
                  }
                `}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              
              {showLabels && (
                <div className="mt-2 text-center max-w-24">
                  <p
                    className={`
                      text-sm font-medium transition-colors duration-300
                      ${isCompleted 
                        ? 'text-green-700' 
                        : isCurrent 
                          ? 'text-blue-700' 
                          : 'text-muted-foreground'
                      }
                    `}
                  >
                    {step.title}
                  </p>
                </div>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-4 transition-all duration-500
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                `}
                style={{
                  background: isCompleted 
                    ? 'hsl(var(--chart-2))' 
                    : 'hsl(var(--border))',
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
  color = 'hsl(var(--primary))',
  backgroundColor = 'hsl(var(--border))',
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
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
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
          <span className="text-2xl font-bold text-foreground/90">
            {Math.round(animatedPercentage)}%
          </span>
        </div>
      )}
    </div>
  );
}
