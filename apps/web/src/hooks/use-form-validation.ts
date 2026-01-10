'use client';

import { useState, useCallback, useRef } from 'react';
import { ValidationError, AppError } from '@/lib/error-handling';
import { logger } from '@/lib/logging';

export interface ValidationRule<T = any> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: T, formData: Record<string, any>) => boolean | string;
  message?: string;
}

export interface FieldConfig {
  rules: ValidationRule[];
  sanitize?: (value: any) => any;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface FormConfig {
  fields: Record<string, FieldConfig>;
  validateOnSubmit?: boolean;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  sanitizeOnSubmit?: boolean;
}

export interface ValidationErrorState {
  field: string;
  message: string;
  type: string;
  value?: any;
}

export interface UseFormValidationReturn<T extends Record<string, any>> {
  data: T;
  errors: Record<string, string>;
  validationErrors: ValidationErrorState[];
  isValid: boolean;
  isValidating: boolean;
  touched: Record<string, boolean>;
  setData: (data: T | ((prev: T) => T)) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearFieldError: (field: keyof T) => void;
  clearAllErrors: () => void;
  validateField: (field: keyof T, valueOverride?: any, dataOverride?: T) => Promise<boolean>;
  validateForm: () => Promise<boolean>;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (onSubmit: (data: T) => Promise<void> | void) => (e?: React.FormEvent) => Promise<void>;
  reset: () => void;
}

export function useFormValidation<T extends Record<string, any>>(
  initialData: T,
  config: FormConfig,
  options: {
    onValidationError?: (errors: ValidationErrorState[]) => void;
    onValidationSuccess?: (data: T) => void;
    sanitizeBeforeValidation?: boolean;
    logValidationErrors?: boolean;
  } = {}
) {
  const {
    onValidationError,
    onValidationSuccess,
    sanitizeBeforeValidation = true,
    logValidationErrors = true,
  } = options;

  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrorState[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const abortControllerRef = useRef<AbortController | null>(null);

  const sanitizeValue = useCallback((value: any, field: keyof T): any => {
    const fieldConfig = config.fields[field as string];
    if (fieldConfig?.sanitize) {
      return fieldConfig.sanitize(value);
    }

    // Default sanitization
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }, [config.fields]);

  const validateFieldValue = useCallback(async (
    field: keyof T,
    value: any,
    formData: T
  ): Promise<ValidationErrorState[]> => {
    const fieldConfig = config.fields[field as string];
    if (!fieldConfig) return [];

    const fieldErrors: ValidationErrorState[] = [];
    const sanitizedValue = sanitizeBeforeValidation ? sanitizeValue(value, field) : value;

    for (const rule of fieldConfig.rules) {
      // Required validation
      if (rule.required && (sanitizedValue === null || sanitizedValue === undefined || sanitizedValue === '')) {
        fieldErrors.push({
          field: field as string,
          message: rule.message || `${String(field)} is required`,
          type: 'required',
          value: sanitizedValue,
        });
        continue;
      }

      // Skip other validations if field is empty and not required
      if (sanitizedValue === null || sanitizedValue === undefined || sanitizedValue === '') {
        continue;
      }

      // String length validations
      if (typeof sanitizedValue === 'string') {
        if (rule.minLength && sanitizedValue.length < rule.minLength) {
          fieldErrors.push({
            field: field as string,
            message: rule.message || `${String(field)} must be at least ${rule.minLength} characters`,
            type: 'minLength',
            value: sanitizedValue,
          });
        }

        if (rule.maxLength && sanitizedValue.length > rule.maxLength) {
          fieldErrors.push({
            field: field as string,
            message: rule.message || `${String(field)} must be no more than ${rule.maxLength} characters`,
            type: 'maxLength',
            value: sanitizedValue,
          });
        }

        // Pattern validation
        if (rule.pattern && !rule.pattern.test(sanitizedValue)) {
          fieldErrors.push({
            field: field as string,
            message: rule.message || `${String(field)} format is invalid`,
            type: 'pattern',
            value: sanitizedValue,
          });
        }
      }

      // Number validations
      if (typeof sanitizedValue === 'number') {
        if (rule.min !== undefined && sanitizedValue < rule.min) {
          fieldErrors.push({
            field: field as string,
            message: rule.message || `${String(field)} must be at least ${rule.min}`,
            type: 'min',
            value: sanitizedValue,
          });
        }

        if (rule.max !== undefined && sanitizedValue > rule.max) {
          fieldErrors.push({
            field: field as string,
            message: rule.message || `${String(field)} must be no more than ${rule.max}`,
            type: 'max',
            value: sanitizedValue,
          });
        }
      }

      // Custom validation
      if (rule.custom) {
        try {
          const customResult = await Promise.resolve(rule.custom(sanitizedValue, formData));
          if (customResult !== true) {
            fieldErrors.push({
              field: field as string,
              message: typeof customResult === 'string' ? customResult : rule.message || `${String(field)} is invalid`,
              type: 'custom',
              value: sanitizedValue,
            });
          }
        } catch (error) {
          logger.error('Custom validation error', error as Error, { field, value: sanitizedValue });
          fieldErrors.push({
            field: field as string,
            message: 'Validation failed',
            type: 'custom_error',
            value: sanitizedValue,
          });
        }
      }
    }

    return fieldErrors;
  }, [config.fields, sanitizeBeforeValidation, sanitizeValue]);

  const validateField = useCallback(async (field: keyof T, valueOverride?: any, dataOverride?: T): Promise<boolean> => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsValidating(true);
    setTouched(prev => ({ ...prev, [field as string]: true }));

    try {
      const valueToValidate = valueOverride !== undefined ? valueOverride : data[field];
      const dataToUse = dataOverride || data;
      const fieldErrors = await validateFieldValue(field, valueToValidate, dataToUse);
      
      if (abortControllerRef.current.signal.aborted) {
        return false;
      }

      const fieldHasErrors = fieldErrors.length > 0;
      
      setErrors(prev => {
        const newErrors = { ...prev };
        if (fieldHasErrors) {
          newErrors[field as string] = fieldErrors[0].message;
        } else {
          delete newErrors[field as string];
        }
        return newErrors;
      });

      setValidationErrors(prev => [
        ...prev.filter(e => e.field !== field),
        ...fieldErrors,
      ]);

      if (fieldHasErrors) {
        if (logValidationErrors) {
          logger.warn(`Validation failed for field ${String(field)}`, {
            field,
            value: valueToValidate,
            errors: fieldErrors,
          });
        }
        onValidationError?.(fieldErrors);
      }

      return !fieldHasErrors;
    } catch (error) {
      logger.error('Field validation error', error as Error, { field });
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [data, validateFieldValue, logValidationErrors, onValidationError]);

  const validateForm = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      const allErrors: ValidationErrorState[] = [];
      
      for (const field of Object.keys(config.fields) as Array<keyof T>) {
        const fieldErrors = await validateFieldValue(field, data[field], data);
        allErrors.push(...fieldErrors);
      }

      const hasErrors = allErrors.length > 0;

      // Group errors by field
      const fieldErrors: Record<string, string> = {};
      allErrors.forEach(error => {
        if (!fieldErrors[error.field]) {
          fieldErrors[error.field] = error.message;
        }
      });

      setErrors(fieldErrors);
      setValidationErrors(allErrors);

      if (hasErrors) {
        if (logValidationErrors) {
          logger.warn('Form validation failed', {
            errors: allErrors,
            data,
          });
        }
        onValidationError?.(allErrors);
      } else {
        onValidationSuccess?.(data);
      }

      return !hasErrors;
    } catch (error) {
      logger.error('Form validation error', error as Error);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [data, config.fields, validateFieldValue, logValidationErrors, onValidationError, onValidationSuccess]);

  const setFieldValue = useCallback((field: keyof T, value: any) => {
    const sanitizedValue = sanitizeValue(value, field);
    setData(prev => ({ ...prev, [field]: sanitizedValue }));
    
    // Auto-validate on change if configured
    const fieldConfig = config.fields[field as string];
    if (fieldConfig?.validateOnChange ?? config.validateOnChange) {
      const newData = { ...data, [field]: sanitizedValue };
      validateField(field, sanitizedValue, newData);
    }
  }, [config.fields, config.validateOnChange, sanitizeValue, validateField, data]);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as string];
      return newErrors;
    });
    setValidationErrors(prev => prev.filter(e => e.field !== field));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
    setValidationErrors([]);
  }, []);

  const handleChange = useCallback((field: keyof T) => (value: any) => {
    setFieldValue(field, value);
  }, [setFieldValue]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field as string]: true }));
    
    // Auto-validate on blur if configured
    const fieldConfig = config.fields[field as string];
    if (fieldConfig?.validateOnBlur ?? config.validateOnBlur) {
      validateField(field);
    }
  }, [config.fields, config.validateOnBlur, validateField]);

  const handleSubmit = useCallback((onSubmit: (data: T) => Promise<void> | void) => 
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      const isValid = await validateForm();
      if (!isValid) {
        return;
      }

      try {
        // Sanitize data before submission if configured
        const sanitizedData = config.sanitizeOnSubmit
          ? Object.entries(data).reduce((acc, [key, value]) => {
              acc[key as keyof T] = sanitizeValue(value, key as keyof T);
              return acc;
            }, {} as T)
          : data;

        await onSubmit(sanitizedData);
      } catch (error) {
        logger.error('Form submission error', error as Error);
        const appError = error instanceof AppError ? error : new ValidationError('Submission failed');
        
        setErrors(prev => ({
          ...prev,
          _form: appError.message,
        }));
      }
    }, [data, config.sanitizeOnSubmit, sanitizeValue, validateForm]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
    setValidationErrors([]);
    setTouched({});
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [initialData]);

  return {
    data,
    errors,
    validationErrors,
    isValid: Object.keys(errors).length === 0,
    isValidating,
    touched,
    setData,
    setFieldValue,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    validateField,
    validateForm,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
  },
  phone: {
    pattern: /^\+?[\d\s\-()]+$/,
    message: 'Please enter a valid phone number',
  },
  url: {
    pattern: /^https?:\/\/.+/,
    message: 'Please enter a valid URL',
  },
  numeric: {
    pattern: /^\d+$/,
    message: 'Please enter only numbers',
  },
  alphabetic: {
    pattern: /^[a-zA-Z\s]+$/,
    message: 'Please enter only letters',
  },
  alphanumeric: {
    pattern: /^[a-zA-Z0-9\s]+$/,
    message: 'Please enter only letters and numbers',
  },
};

// Utility functions
export function createFieldConfig(rules: ValidationRule[], options: Partial<FieldConfig> = {}): FieldConfig {
  return {
    rules,
    validateOnChange: true,
    validateOnBlur: true,
    ...options,
  };
}

export function combineRules(...rules: ValidationRule[]): ValidationRule[] {
  return rules.flat();
}