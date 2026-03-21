import { Button, ButtonProps } from '@/marketing/components/ui/button';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon } from '@hugeicons/core-free-icons';

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export default function LoadingButton({
  loading,
  children,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      className={cn('relative transition duration-200', className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <HugeiconsIcon icon={Loading03Icon} className="mr-2 size-5 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// Specialized buttons using standard ShadCN
export function SaveButton({
  loading,
  saved,
  children,
  ...props
}: LoadingButtonProps & { saved?: boolean }) {
  return (
    <LoadingButton
      {...props}
      variant={saved ? 'outline' : props.variant || 'default'}
      loading={loading}
    >
      {saved ? '✓ Desat' : loading ? 'Desant...' : children || 'Desar'}
    </LoadingButton>
  );
}

export function SubmitButton({ loading, children, ...props }: LoadingButtonProps) {
  return (
    <LoadingButton type="submit" loading={loading} {...props}>
      {loading ? 'Enviant...' : children || 'Enviar'}
    </LoadingButton>
  );
}

export function DeleteButton({ loading, children, ...props }: LoadingButtonProps) {
  return (
    <LoadingButton variant="destructive" loading={loading} {...props}>
      {loading ? 'Eliminant...' : children || 'Eliminar'}
    </LoadingButton>
  );
}
