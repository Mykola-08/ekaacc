import * as React from 'react'
import { cn } from '@/lib/platform/utils/css-utils'

export interface MinimalLayoutProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const MinimalLayout = React.forwardRef<HTMLDivElement, MinimalLayoutProps>(
  ({ children, className, centered = true, maxWidth = 'lg', padding = 'md', ...props }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl'
    };
    
    const paddingClasses = {
      none: '',
      sm: 'px-4 py-6',
      md: 'px-6 py-8',
      lg: 'px-8 py-12'
    };
    
    return (
      <div
        className={cn(
          'min-h-screen',
          centered && 'flex items-center justify-center',
          className
        )}
        ref={ref}
        {...props}
      >
        <div className={cn(
          'w-full',
          maxWidthClasses[maxWidth],
          paddingClasses[padding]
        )}>
          {children}
        </div>
      </div>
    );
  }
);

MinimalLayout.displayName = 'MinimalLayout';

/* Grid Layout for content organization */
export interface MinimalGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
}

const MinimalGrid = React.forwardRef<HTMLDivElement, MinimalGridProps>(
  ({ children, className, columns = 1, gap = 'md', ...props }, ref) => {
    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
    };
    
    const gapClasses = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    };
    
    return (
      <div
        className={cn(
          'grid',
          gridClasses[columns],
          gapClasses[gap],
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

MinimalGrid.displayName = 'MinimalGrid';

/* Section for content grouping */
export interface MinimalSectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const MinimalSection = React.forwardRef<HTMLDivElement, MinimalSectionProps>(
  ({ children, className, title, subtitle, ...props }, ref) => {
    return (
      <section
        className={cn('space-y-6', className)}
        ref={ref}
        {...props}
      >
        {(title || subtitle) && (
          <div className="space-y-2">
            {title && (
              <h2 className="text-2xl font-semibold text-foreground">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </section>
    );
  }
);

MinimalSection.displayName = 'MinimalSection';

export { MinimalLayout, MinimalGrid, MinimalSection };