import * as React from 'react';
import { Input } from '@/components/platform/ui/input';
import { cn } from '@/lib/platform/utils/css-utils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export interface PremiumInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  variant?: 'default' | 'outlined' | 'filled' | 'glass' | 'minimal' | 'premium';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  validationState?: 'default' | 'success' | 'error' | 'warning';
  shape?: 'default' | 'pill' | 'square';
  label?: string;
  helperText?: string;
  errorMessage?: string;
  successMessage?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  clearable?: boolean;
  passwordToggle?: boolean;
  floatingLabel?: boolean;
  characterCount?: boolean;
  maxLength?: number;
  showStates?: boolean;
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  (
    {
      className,
      variant,
      size,
      validationState,
      shape,
      label,
      helperText,
      errorMessage,
      successMessage,
      leftIcon,
      rightIcon,
      loading,
      clearable,
      passwordToggle,
      floatingLabel,
      characterCount,
      maxLength,
      showStates,
      disabled,
      value,
      onChange,
      placeholder,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState<string>((value as string) || '');
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [characterCountValue, setCharacterCountValue] = React.useState(0);

    React.useEffect(() => {
      const v = (value as string) || '';
      setInputValue(v);
      if (characterCount) setCharacterCountValue(v.length);
    }, [value, characterCount]);

    const handleClear = () => {
      setInputValue('');
      onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setInputValue(v);
      if (characterCount) setCharacterCountValue(v.length);
      onChange?.(e);
    };

    const hasError = !!errorMessage;
    const hasSuccess = !!successMessage;
    const radiusClass =
      shape === 'pill' ? 'rounded-full' : shape === 'square' ? 'rounded-none' : undefined;

    return (
      <div className="space-y-2">
        {label && !floatingLabel && (
          <label className="text-foreground block text-sm font-medium">{label}</label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon}
            </div>
          )}

          {label && floatingLabel && (
            <label
              className={cn(
                'pointer-events-none absolute left-3 transition-all',
                isFocused || inputValue
                  ? 'text-muted-foreground top-1 text-xs'
                  : 'text-muted-foreground top-1/2 -translate-y-1/2'
              )}
            >
              {label}
            </label>
          )}

          <Input
            ref={ref}
            type={passwordToggle ? (showPassword ? 'text' : 'password') : type}
            value={inputValue}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={disabled || loading}
            maxLength={maxLength}
            placeholder={floatingLabel ? (isFocused ? placeholder : '') : placeholder}
            aria-invalid={hasError}
            className={cn(
              leftIcon && 'pl-10',
              (rightIcon || clearable || passwordToggle || loading) && 'pr-10',
              radiusClass,
              className
            )}
            {...props}
          />

          {(rightIcon || clearable || passwordToggle || loading) && (
            <div className="text-muted-foreground absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {clearable && inputValue && !disabled ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="hover:bg-accent rounded p-1"
                  tabIndex={-1}
                  aria-label="Clear input"
                >
                  <span className="block h-3 w-3 rotate-45">+</span>
                </button>
              ) : null}
              {passwordToggle ? (
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="hover:bg-accent rounded p-1"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              ) : null}
              {rightIcon}
            </div>
          )}
        </div>

        <div className="space-y-1">
          {helperText && !hasError && !hasSuccess ? (
            <p className="text-muted-foreground text-sm">{helperText}</p>
          ) : null}
          {hasError ? <p className="text-destructive text-sm">{errorMessage}</p> : null}
          {hasSuccess ? <p className="text-sm text-green-600">{successMessage}</p> : null}
          {characterCount && maxLength ? (
            <p
              className={cn(
                'text-right text-xs',
                characterCountValue > maxLength * 0.9 ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              {characterCountValue}/{maxLength}
            </p>
          ) : null}
        </div>
      </div>
    );
  }
);

PremiumInput.displayName = 'PremiumInput';

export { PremiumInput };
