import * as React from 'react'
import { cn } from '@/lib/utils'

export interface MinimalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'ghost';
  interactive?: boolean;
}

const MinimalCard = React.forwardRef<HTMLDivElement, MinimalCardProps>(
  ({ className, variant = 'default', interactive = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-lg transition-all duration-200';
    
    const variantClasses = {
      default: 'bg-card border border-border shadow-sm',
      outline: 'border border-border bg-card',
      ghost: 'bg-transparent'
    };
    
    const interactiveClasses = interactive ? 'hover:shadow-md hover:scale-[1.01] cursor-pointer' : '';
    
    return (
      <div
        className={cn(
          baseClasses,
          variantClasses[variant],
          interactiveClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MinimalCard.displayName = 'MinimalCard';

/* Card Header */
export interface MinimalCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const MinimalCardHeader = React.forwardRef<HTMLDivElement, MinimalCardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col space-y-2 p-6', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MinimalCardHeader.displayName = 'MinimalCardHeader';

/* Card Title */
export interface MinimalCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

const MinimalCardTitle = React.forwardRef<HTMLParagraphElement, MinimalCardTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
        ref={ref}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

MinimalCardTitle.displayName = 'MinimalCardTitle';

/* Card Description */
export interface MinimalCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const MinimalCardDescription = React.forwardRef<HTMLParagraphElement, MinimalCardDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        className={cn('text-sm text-gray-600', className)}
        ref={ref}
        {...props}
      >
        {children}
      </p>
    );
  }
);

MinimalCardDescription.displayName = 'MinimalCardDescription';

/* Card Content */
export interface MinimalCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const MinimalCardContent = React.forwardRef<HTMLDivElement, MinimalCardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn('p-6 pt-0', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

MinimalCardContent.displayName = 'MinimalCardContent';

/* Card Footer */
export interface MinimalCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const MinimalCardFooter = React.forwardRef<HTMLDivElement, MinimalCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center p-6 pt-0', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MinimalCardFooter.displayName = 'MinimalCardFooter';

// Attach sub-components to MinimalCard
const MinimalCardWithSubComponents = Object.assign(MinimalCard, {
  Header: MinimalCardHeader,
  Title: MinimalCardTitle,
  Description: MinimalCardDescription,
  Content: MinimalCardContent,
  Footer: MinimalCardFooter,
});

export { MinimalCardWithSubComponents as MinimalCard };