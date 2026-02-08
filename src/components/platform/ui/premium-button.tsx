import * as React from 'react';
import { Button } from '@/components/platform/ui/button';
import { cn } from '@/lib/platform/utils/css-utils';

export interface PremiumButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'size'
> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'premium' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'default' | 'pill' | 'square';
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

function mapVariant(
  v: PremiumButtonProps['variant']
): React.ComponentProps<typeof Button>['variant'] {
  switch (v) {
    case 'secondary':
      return 'secondary';
    case 'outline':
      return 'outline';
    case 'ghost':
      return 'ghost';
    case 'premium':
    case 'glass':
    case 'primary':
    default:
      return 'default';
  }
}

function mapSize(s: PremiumButtonProps['size']): React.ComponentProps<typeof Button>['size'] {
  switch (s) {
    case 'sm':
      return 'sm';
    case 'lg':
      return 'lg';
    case 'xl':
      return 'lg';
    case 'md':
    default:
      return 'default';
  }
}

const PremiumButton = React.forwardRef<HTMLButtonElement, PremiumButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      shape = 'default',
      loading = false,
      loadingText,
      icon,
      iconPosition = 'left',
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const shapeClass =
      shape === 'pill' ? 'rounded-full' : shape === 'square' ? 'rounded-none' : undefined;
    const content = (
      <span className={cn('inline-flex items-center gap-2', loading && 'opacity-90')}>
        {icon && iconPosition === 'left' ? icon : null}
        <span>{loading && loadingText ? loadingText : children}</span>
        {icon && iconPosition === 'right' ? icon : null}
      </span>
    );

    return (
      <Button
        ref={ref}
        variant={mapVariant(variant)}
        size={mapSize(size)}
        disabled={disabled || loading}
        className={cn(shapeClass, className)}
        {...props}
      >
        {content}
      </Button>
    );
  }
);

PremiumButton.displayName = 'PremiumButton';

export { PremiumButton };
