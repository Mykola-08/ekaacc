import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MinimalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 shadow-sm',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus:ring-gray-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500'
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          'rounded-squircle',
          (loading || disabled) && 'opacity-60 cursor-not-allowed transform-none',
          'hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

MinimalButton.displayName = 'MinimalButton';

export { MinimalButton };