import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const premiumCardVariants = cva(
  'relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 bg-white',
        elevated: 'border-neutral-200 bg-white shadow-lg hover:shadow-xl',
        outlined: 'border-2 border-neutral-300 bg-white',
        filled: 'border-neutral-200 bg-neutral-50',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md',
        minimal: 'border-neutral-100 bg-white',
        premium: 'border-primary-200 bg-gradient-to-br from-white to-neutral-50 shadow-xl',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      interactive: {
        true: 'cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      interactive: false,
    },
  }
)

/* Premium Card Header */
interface PremiumCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PremiumCardHeader = React.forwardRef<HTMLDivElement, PremiumCardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCardHeader.displayName = 'PremiumCardHeader';

/* Premium Card Title */
interface PremiumCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

const PremiumCardTitle = React.forwardRef<HTMLParagraphElement, PremiumCardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold leading-none tracking-tight', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

PremiumCardTitle.displayName = 'PremiumCardTitle';

/* Premium Card Description */
interface PremiumCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

const PremiumCardDescription = React.forwardRef<HTMLParagraphElement, PremiumCardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-neutral-500', className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

PremiumCardDescription.displayName = 'PremiumCardDescription';

/* Premium Card Content */
interface PremiumCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PremiumCardContent = React.forwardRef<HTMLDivElement, PremiumCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('pt-0', className)} {...props}>
        {children}
      </div>
    );
  }
);

PremiumCardContent.displayName = 'PremiumCardContent';

/* Premium Card Footer */
interface PremiumCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const PremiumCardFooter = React.forwardRef<HTMLDivElement, PremiumCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center pt-0', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCardFooter.displayName = 'PremiumCardFooter';

/* Premium Card Badge */
interface PremiumCardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

const PremiumCardBadge = React.forwardRef<HTMLDivElement, PremiumCardBadgeProps>(
  ({ className, children, variant = 'primary', size = 'sm', ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-blue-50 text-blue-700 border border-blue-200',
      success: 'bg-green-50 text-green-700 border border-green-200',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200',
      error: 'bg-red-50 text-red-700 border border-red-200',
      neutral: 'bg-slate-100 text-slate-700 border border-slate-200'
    };

    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-sm'
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PremiumCardBadge.displayName = 'PremiumCardBadge';

export interface PremiumCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof premiumCardVariants> {
  hoverEffect?: 'lift' | 'scale' | 'glow' | 'shadow';
  loading?: boolean;
  shimmer?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ 
    className, 
    variant, 
    padding, 
    interactive = false,
    hoverEffect = 'lift',
    loading = false,
    shimmer = false,
    pulse = false,
    children,
    onClick,
    onMouseEnter,
    onMouseLeave,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(true);
      onMouseEnter?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsHovered(false);
      setIsPressed(false);
      onMouseLeave?.(e);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        setIsPressed(true);
      }
      props.onMouseDown?.(e);
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsPressed(false);
      props.onMouseUp?.(e);
    };

    const getHoverClasses = () => {
      if (!interactive) return '';
      
      const effects = {
        lift: 'hover:-translate-y-1',
        scale: 'hover:scale-[1.02]',
        glow: 'hover:shadow-2xl hover:shadow-blue-500/10',
        shadow: 'hover:shadow-2xl'
      };
      
      return effects[hoverEffect];
    };

    return (
      <div
        ref={ref}
        className={cn(
          premiumCardVariants({ variant, padding, interactive }),
          getHoverClasses(),
          isPressed && 'scale-[0.98]',
          loading && 'animate-pulse',
          pulse && 'animate-pulse',
          className
        )}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        {...props}
      >
        {/* Shimmer Effect */}
        {shimmer && (
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        )}
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        {/* Interactive Glow Effect */}
        {interactive && variant === 'premium' && (
          <div 
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 transition-opacity duration-300',
              isHovered && 'opacity-100'
            )}
          />
        )}
        
        {/* Content */}
        <div className={cn(
          'relative z-10',
          loading && 'opacity-50'
        )}>
          {children}
        </div>
      </div>
    );
  }
);

PremiumCard.displayName = 'PremiumCard';

// Attach sub-components to PremiumCard
PremiumCard.Header = PremiumCardHeader;
PremiumCard.Title = PremiumCardTitle;
PremiumCard.Description = PremiumCardDescription;
PremiumCard.Content = PremiumCardContent;
PremiumCard.Footer = PremiumCardFooter;
PremiumCard.Badge = PremiumCardBadge;

export {
  PremiumCard,
  PremiumCardHeader,
  PremiumCardTitle,
  PremiumCardDescription,
  PremiumCardContent,
  PremiumCardFooter,
  PremiumCardBadge,
  premiumCardVariants
}