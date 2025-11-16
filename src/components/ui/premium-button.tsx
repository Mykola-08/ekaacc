import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const premiumButtonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform',
  {
    variants: {
      variant: {
        primary: [
          'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
          'hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:shadow-blue-500/25',
          'focus:ring-blue-500',
          'active:scale-[0.98] active:shadow-md',
          'shadow-sm'
        ],
        secondary: [
          'bg-white text-slate-700 border-2 border-slate-200',
          'hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50',
          'focus:ring-blue-500',
          'active:scale-[0.98]',
          'shadow-sm'
        ],
        ghost: [
          'bg-transparent text-slate-700',
          'hover:bg-slate-100 hover:text-slate-900',
          'focus:ring-slate-500',
          'active:scale-[0.98]'
        ],
        outline: [
          'bg-transparent text-blue-600 border-2 border-blue-200',
          'hover:bg-blue-50 hover:border-blue-300',
          'focus:ring-blue-500',
          'active:scale-[0.98]'
        ],
        premium: [
          'bg-gradient-to-r from-slate-900 to-slate-800 text-white',
          'hover:from-slate-800 hover:to-slate-700 hover:shadow-xl',
          'focus:ring-slate-500',
          'active:scale-[0.98] active:shadow-lg',
          'shadow-lg'
        ],
        glass: [
          'bg-white/80 backdrop-blur-lg text-slate-800 border border-white/20',
          'hover:bg-white/90 hover:shadow-lg',
          'focus:ring-white/50',
          'active:scale-[0.98]',
          'shadow-lg'
        ]
      },
      size: {
        sm: 'px-4 py-2 text-xs font-semibold',
        md: 'px-6 py-3 text-sm font-semibold',
        lg: 'px-8 py-4 text-base font-bold',
        xl: 'px-10 py-5 text-lg font-bold'
      },
      shape: {
        default: '',
        pill: 'rounded-full',
        square: 'rounded-none'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'default'
    }
  }
);

export interface PremiumButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof premiumButtonVariants> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  asChild?: boolean;
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    shape,
    loading = false, 
    loadingText,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    onClick,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(true);
      props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsPressed(false);
      props.onMouseUp?.(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(true);
      props.onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsHovered(false);
      setIsPressed(false);
      props.onMouseLeave?.(e);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
    };

    const renderIcon = () => {
      if (!icon) return null;
      
      return (
        <span 
          className={cn(
            'transition-transform duration-200',
            isHovered && !loading && 'scale-110',
            loading && 'animate-spin'
          )}
        >
          {loading ? (
            <svg 
              className="animate-spin" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : icon}
        </span>
      );
    };

    return (
      <button
        className={cn(
          premiumButtonVariants({ variant, size, shape }),
          'group relative overflow-hidden',
          isPressed && 'scale-[0.98]',
          loading && 'cursor-wait',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {/* Ripple Effect */}
        <span className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {iconPosition === 'left' && renderIcon()}
          <span className={cn(
            'transition-all duration-200',
            loading && 'opacity-50'
          )}>
            {loading && loadingText ? loadingText : children}
          </span>
          {iconPosition === 'right' && renderIcon()}
        </span>
      </button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

export { PremiumButton, premiumButtonVariants };