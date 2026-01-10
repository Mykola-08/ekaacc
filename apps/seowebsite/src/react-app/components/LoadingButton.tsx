import { ReactNode } from 'react';
import { CircleNotch } from 'phosphor-react';
import { Button } from 'keep-react';

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

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      color={color}
      variant={variant}
      size={size}
      className={`${loading ? 'cursor-wait' : ''} ${className}`}
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
