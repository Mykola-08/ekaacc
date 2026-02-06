import { ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LoadingButtonProps {
  children: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  variant?: 'default' | 'softBg' | 'outline' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  loadingText?: string;
}

export default function LoadingButton({
  children,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  color = 'primary',
  variant = 'default',
  size = 'md',
  className = '',
  loadingText,
}: LoadingButtonProps) {
  const isDisabled = disabled || loading;

  let mappedVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" = "default";
  let colorClass = "";

  if (color === 'error') {
    mappedVariant = "destructive";
  } else if (color === 'secondary') {
    mappedVariant = "secondary";
  } else if (color === 'success') {
    colorClass = "bg-green-600 hover:bg-green-700 text-white";
  } else if (variant === 'outline') {
    mappedVariant = "outline";
  } else if (variant === 'link') {
    mappedVariant = "link";
  } else if (variant === 'softBg') {
    mappedVariant = "secondary";
  }

  let mappedSize: "default" | "sm" | "lg" | "icon" = "default";
  if (size === 'xs' || size === 'sm') mappedSize = "sm";
  else if (size === 'lg' || size === 'xl' || size === '2xl') mappedSize = "lg";

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      variant={mappedVariant}
      size={mappedSize}
      className={cn(loading ? 'cursor-wait' : '', colorClass, className)}
    >
      {loading && (
        <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 mr-2 animate-spin" />
      )}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}

export function SaveButton({ 
  loading, 
  saved, 
  ...props 
}: LoadingButtonProps & { saved?: boolean }) {
  return (
    <LoadingButton
      {...props}
      color={saved ? 'success' : (props.color || 'primary')}
      loading={loading}
      loadingText="Saving..."
    >
      {saved ? 'Saved' : (props.children || 'Save')}
    </LoadingButton>
  );
}

export function SubmitButton({ loading, ...props }: LoadingButtonProps) {
  return (
    <LoadingButton
      {...props}
      type="submit"
      loading={loading}
      loadingText="Sending..."
    >
      {props.children || 'Submit'}
    </LoadingButton>
  );
}

export function DeleteButton({ loading, ...props }: LoadingButtonProps) {
  return (
    <LoadingButton
      {...props}
      color="error"
      loading={loading}
      loadingText="Deleting..."
    >
      {props.children || 'Delete'}
    </LoadingButton>
  );
}
