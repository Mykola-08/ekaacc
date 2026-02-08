import * as React from 'react';
import { Button } from '@/components/platform/ui/button';
import { cn } from '@/lib/platform/utils/css-utils';

export interface MinimalButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'size'
> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

function mapVariant(
  v: MinimalButtonProps['variant']
): React.ComponentProps<typeof Button>['variant'] {
  switch (v) {
    case 'secondary':
      return 'secondary';
    case 'outline':
      return 'outline';
    case 'ghost':
      return 'ghost';
    case 'primary':
    default:
      return 'default';
  }
}

function mapSize(s: MinimalButtonProps['size']): React.ComponentProps<typeof Button>['size'] {
  switch (s) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    case 'md':
    default:
      return 'default';
  }
}

const MinimalButton = React.forwardRef<HTMLButtonElement, MinimalButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={mapVariant(variant)}
        size={mapSize(size)}
        className={cn(className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 -ml-1 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </Button>
    );
  }
);

MinimalButton.displayName = 'MinimalButton';

export { MinimalButton };
