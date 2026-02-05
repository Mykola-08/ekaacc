import { ReactNode } from 'react';
import { CircleNotch } from 'phosphor-react';
import { Button } from '@ekaacc/shared-ui';
import { cn } from '@/lib/utils';

// Redefining interface to maintain compatibility but map internally
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

  // Map Keep Props to Shared UI Props
  let mappedVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" = "default";
  let colorClass = "";
  
  // Logic for Mapping
  if (color === 'error') {
    mappedVariant = "destructive";
  } else if (color === 'secondary') {
    mappedVariant = "secondary";
  } else if (color === 'success') {
     // Shared UI doesn't have success variant, use custom class
     colorClass = "bg-green-600 hover:bg-green-700 text-white";
  } else if (variant === 'outline') {
    mappedVariant = "outline";
  } else if (variant === 'link') {
    mappedVariant = "link";
  } else if (variant === 'softBg') {
    mappedVariant = "secondary"; 
  }

  // Map Size
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
        <CircleNotch className="w-4 h-4 mr-2 animate-spin" />
      )}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}

// Specialized buttons using Keep React
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
      loadingText="Desant..."
    >
      {saved ? '✓ Desat' : (props.children || 'Desar')}
    </LoadingButton>
  );
}

export function SubmitButton({ loading, ...props }: LoadingButtonProps) {
  return (
    <LoadingButton
      {...props}
      type="submit"
      loading={loading}
      loadingText="Enviant..."
    >
      {props.children || 'Enviar'}
    </LoadingButton>
  );
}

export function DeleteButton({ loading, ...props }: LoadingButtonProps) {
  return (
    <LoadingButton
      {...props}
      color="error"
      loading={loading}
      loadingText="Eliminant..."
    >
      {props.children || 'Eliminar'}
    </LoadingButton>
  );
}
