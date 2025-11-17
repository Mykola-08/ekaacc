import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Search, Eye, EyeOff, Check, AlertCircle, Loader2 } from 'lucide-react'

const premiumInputVariants = cva(
  'peer relative w-full appearance-none rounded-xl border bg-white/5 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20 text-neutral-900 placeholder:text-neutral-400',
        outlined: 'border-2 border-neutral-300 hover:border-neutral-400 focus:border-primary-500 focus:ring-primary-500/20 bg-transparent',
        filled: 'border-0 bg-neutral-100 hover:bg-neutral-200 focus:bg-neutral-100 focus:ring-primary-500/20',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/15 focus:bg-white/10 focus:border-white/40 text-white placeholder:text-white/60',
        minimal: 'border-0 border-b-2 border-neutral-300 rounded-none bg-transparent hover:border-neutral-400 focus:border-primary-500 focus:ring-0 focus:ring-offset-0',
        premium: 'border-neutral-200 bg-gradient-to-br from-white/90 to-white/70 hover:from-white/95 hover:to-white/80 focus:border-primary-500 focus:ring-primary-500/30 shadow-sm',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-6 py-4 text-lg',
        xl: 'px-8 py-5 text-xl',
      },
      state: {
        default: '',
        success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
        error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        warning: 'border-amber-500 focus:border-amber-500 focus:ring-amber-500/20',
      },
      shape: {
        default: 'rounded-xl',
        pill: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      state: 'default',
      shape: 'default',
    },
  }
)

const premiumInputGroupVariants = cva(
  'relative group',
  {
    variants: {
      attached: {
        true: 'flex',
        false: 'block',
      },
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col',
      },
    },
    defaultVariants: {
      attached: false,
      orientation: 'horizontal',
    },
  }
)

export interface PremiumInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof premiumInputVariants> {
  label?: string
  helperText?: string
  errorMessage?: string
  successMessage?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loading?: boolean
  clearable?: boolean
  passwordToggle?: boolean
  search?: boolean
  floatingLabel?: boolean
  characterCount?: boolean
  maxLength?: number
  showStates?: boolean
  autoComplete?: string
}

const PremiumInput = React.forwardRef<HTMLInputElement, PremiumInputProps>(
  ({ 
    className, 
    variant, 
    size, 
    state, 
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
    search,
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
  }, ref) => {
    const [inputValue, setInputValue] = React.useState(value || '')
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [isHovered, setIsHovered] = React.useState(false)
    const [characterCountValue, setCharacterCountValue] = React.useState(0)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current!)

    // Handle value changes
    React.useEffect(() => {
      setInputValue(value || '')
      if (characterCount && value) {
        setCharacterCountValue(value.toString().length)
      }
    }, [value, characterCount])

    const handleClear = () => {
      setInputValue('')
      inputRef.current?.focus()
      onChange?.({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      if (characterCount) {
        setCharacterCountValue(newValue.length)
      }
      onChange?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = () => setIsHovered(false)

    // Determine current state
    const currentState = state === 'default' && errorMessage ? 'error' : 
                        state === 'default' && successMessage ? 'success' : state

    // Icon components
    const SearchIcon = search ? <Search className="w-4 h-4" /> : null
    const PasswordToggleIcon = passwordToggle ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    ) : null

    const ClearIcon = clearable && inputValue && !disabled ? (
      <button
        type="button"
        onClick={handleClear}
        className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
        tabIndex={-1}
      >
        <div className="w-4 h-4 rounded-full bg-neutral-400 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-white rounded-full" />
        </div>
      </button>
    ) : null

    const LoadingIcon = loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null

    const StateIcon = showStates && currentState !== 'default' ? (
      currentState === 'success' ? <Check className="w-4 h-4 text-green-500" /> :
      currentState === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> : null
    ) : null

    // Combine all right icons
    const rightIcons = [
      StateIcon,
      LoadingIcon,
      ClearIcon,
      PasswordToggleIcon,
      rightIcon,
      SearchIcon
    ].filter(Boolean)

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && !floatingLabel && (
          <label className={cn(
            "block text-sm font-medium transition-colors",
            disabled ? "text-neutral-400" : "text-neutral-700",
            currentState === 'error' && "text-red-600",
            currentState === 'success' && "text-green-600"
          )}>
            {label}
          </label>
        )}

        {/* Input Container */}
        <div 
          className={cn(
            "relative group",
            isFocused && "z-10"
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Left Icon */}
          {leftIcon && (
            <div className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
              disabled ? "text-neutral-300" : "text-neutral-400 group-hover:text-neutral-500",
              currentState === 'error' && "text-red-400",
              currentState === 'success' && "text-green-400"
            )}>
              {leftIcon}
            </div>
          )}

          {/* Floating Label */}
          {label && floatingLabel && (
            <label className={cn(
              "absolute left-4 transition-all duration-200 pointer-events-none",
              "bg-white px-1 -translate-y-1/2",
              (isFocused || inputValue) 
                ? "top-2 text-xs text-primary-600" 
                : "top-1/2 text-base text-neutral-400 -translate-y-1/2",
              leftIcon && "left-10",
              currentState === 'error' && (isFocused || inputValue) && "text-red-600",
              currentState === 'success' && (isFocused || inputValue) && "text-green-600"
            )}>
              {label}
            </label>
          )}

          {/* Input */}
          <input
            ref={inputRef}
            type={passwordToggle ? (showPassword ? 'text' : 'password') : type}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled || loading}
            maxLength={maxLength}
            className={cn(
              premiumInputVariants({ variant, size, state: currentState, shape }),
              leftIcon && "pl-10",
              rightIcons.length > 0 && "pr-10",
              floatingLabel && "pt-6",
              className
            )}
            placeholder={floatingLabel ? (isFocused ? placeholder : '') : placeholder}
            {...props}
          />

          {/* Right Icons */}
          {rightIcons.length > 0 && (
            <div className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1",
              disabled ? "text-neutral-300" : "text-neutral-400"
            )}>
              {rightIcons}
            </div>
          )}

          {/* Focus Ring Animation */}
          <div className={cn(
            "absolute inset-0 rounded-xl ring-2 ring-offset-2 transition-all duration-200 pointer-events-none",
            isFocused ? "ring-primary-500/20 ring-offset-2" : "ring-transparent ring-offset-0"
          )} />
        </div>

        {/* Helper/Error/Success Text */}
        <div className="space-y-1">
          {helperText && currentState === 'default' && (
            <p className="text-sm text-neutral-500">{helperText}</p>
          )}
          {errorMessage && currentState === 'error' && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errorMessage}
            </p>
          )}
          {successMessage && currentState === 'success' && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="w-3 h-3" />
              {successMessage}
            </p>
          )}
          {characterCount && maxLength && (
            <p className={cn(
              "text-xs text-right transition-colors",
              characterCountValue > maxLength * 0.9 ? "text-red-500" : "text-neutral-400"
            )}>
              {characterCountValue}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

PremiumInput.displayName = 'PremiumInput'

export { PremiumInput, premiumInputVariants }