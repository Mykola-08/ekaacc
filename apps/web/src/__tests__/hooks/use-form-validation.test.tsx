import { renderHook, act, waitFor } from '@testing-library/react';
import { useFormValidation, createFieldConfig } from '../../hooks/use-form-validation';

describe('useFormValidation', () => {
  describe('Basic Validation', () => {
    it('validates required fields', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { name: '', email: '' },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          }
        )
      );

      let isNameValid;
      let isEmailValid;
      await act(async () => {
        isNameValid = await result.current.validateField('name');
        isEmailValid = await result.current.validateField('email');
      });

      expect(isNameValid).toBe(false);
      expect(isEmailValid).toBe(false);
      expect(result.current.errors.name).toBe('Name is required');
      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.isValid).toBe(false);
    });

    it('validates email format', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { email: '' },
          {
            fields: {
              email: createFieldConfig([
                { 
                  required: true, 
                  message: 'Email is required' 
                },
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('email', 'invalid-email');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('email');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.email).toBe('Invalid email format');

      act(() => {
        result.current.setFieldValue('email', 'valid@email.com');
      });

      await act(async () => {
        isValid = await result.current.validateField('email');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.email).toBeUndefined();
    });

    it('validates minimum length', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { password: '' },
          {
            fields: {
              password: createFieldConfig([
                {
                  minLength: 8,
                  message: 'Password must be at least 8 characters'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('password', 'short');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('password');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.password).toBe('Password must be at least 8 characters');

      act(() => {
        result.current.setFieldValue('password', 'longenoughpassword');
      });

      await act(async () => {
        isValid = await result.current.validateField('password');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.password).toBeUndefined();
    });

    it('validates maximum length', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { username: '' },
          {
            fields: {
              username: createFieldConfig([
                {
                  maxLength: 10,
                  message: 'Username must be at most 10 characters'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('username', 'thisisaverylongusername');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('username');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.username).toBe('Username must be at most 10 characters');

      act(() => {
        result.current.setFieldValue('username', 'short');
      });

      await act(async () => {
        isValid = await result.current.validateField('username');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.username).toBeUndefined();
    });
  });

  describe('Custom Validation', () => {
    it('validates with custom function', async () => {
      const customValidator = (value: string) => {
        if (value.length < 3) return 'Must be at least 3 characters';
        if (value.length > 10) return 'Must be at most 10 characters';
        return true;
      };

      const { result } = renderHook(() => 
        useFormValidation(
          { field: '' },
          {
            fields: {
              field: createFieldConfig([
                {
                  custom: customValidator
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('field', 'ab');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.field).toBe('Must be at least 3 characters');

      act(() => {
        result.current.setFieldValue('field', 'valid');
      });

      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.field).toBeUndefined();

      act(() => {
        result.current.setFieldValue('field', 'thisistoolong');
      });

      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.field).toBe('Must be at most 10 characters');
    });

    it('validates with async custom function', async () => {
      const asyncValidator = async (value: string) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (value === 'taken') return 'Username is already taken';
        return true;
      };

      const { result } = renderHook(() => 
        useFormValidation(
          { username: '' },
          {
            fields: {
              username: createFieldConfig([
                {
                  custom: asyncValidator
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('username', 'taken');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('username');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.username).toBe('Username is already taken');

      act(() => {
        result.current.setFieldValue('username', 'available');
      });

      await act(async () => {
        isValid = await result.current.validateField('username');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.username).toBeUndefined();
    });
  });

  describe('Form State Management', () => {
    it('updates form data', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { name: '', email: '' },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('name', 'John Doe');
        result.current.setFieldValue('email', 'john@example.com');
      });

      expect(result.current.data.name).toBe('John Doe');
      expect(result.current.data.email).toBe('john@example.com');
    });

    it('validates on change when validateOnChange is true', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { email: '' },
          {
            fields: {
              email: createFieldConfig([
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              ], { validateOnChange: true })
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('email', 'invalid');
      });

      // Wait for validation to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(result.current.errors.email).toBe('Invalid email format');

      act(() => {
        result.current.setFieldValue('email', 'valid@email.com');
      });

      // Wait for validation to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('does not validate on change by default', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { email: '' },
          {
            fields: {
              email: createFieldConfig([
                {
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email format'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('email', 'invalid');
      });

      expect(result.current.errors.email).toBeUndefined();
    });

    it('validates entire form', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { name: '', email: '' },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('name', 'John');
        result.current.setFieldValue('email', 'john@example.com');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateForm();
      });

      expect(isValid).toBe(true);
      expect(result.current.errors).toEqual({});
    });

    it('shows all validation errors when validating entire form', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { name: '', email: '', age: '' },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ]),
              age: createFieldConfig([
                { required: true, message: 'Age is required' }
              ])
            }
          }
        )
      );

      let isValid;
      await act(async () => {
        isValid = await result.current.validateForm();
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.name).toBe('Name is required');
      expect(result.current.errors.email).toBe('Email is required');
      expect(result.current.errors.age).toBe('Age is required');
    });
  });

  describe('Reset and Clear', () => {
    it('resets form to initial state', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { name: 'Initial', email: 'initial@example.com' },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('name', 'Updated');
        result.current.setFieldValue('email', 'updated@example.com');
        result.current.setFieldError('name', 'Custom error');
      });

      expect(result.current.data.name).toBe('Updated');
      expect(result.current.data.email).toBe('updated@example.com');
      expect(result.current.errors.name).toBe('Custom error');

      act(() => {
        result.current.reset();
      });

      expect(result.current.data.name).toBe('Initial');
      expect(result.current.data.email).toBe('initial@example.com');
      expect(result.current.errors).toEqual({});
      expect(result.current.isValid).toBe(true);
    });

    it('clears errors without resetting data', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { name: '', email: '' },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldError('name', 'Name is required');
        result.current.setFieldError('email', 'Email is required');
      });

      expect(result.current.errors.name).toBe('Name is required');
      expect(result.current.errors.email).toBe('Email is required');

      act(() => {
        result.current.clearAllErrors();
      });

      expect(result.current.errors).toEqual({});
      expect(result.current.data).toEqual({ name: '', email: '' });
    });

    it('clears specific field error', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { name: '', email: '' },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldError('name', 'Name is required');
        result.current.setFieldError('email', 'Email is required');
      });

      expect(result.current.errors.name).toBe('Name is required');
      expect(result.current.errors.email).toBe('Email is required');

      act(() => {
        result.current.clearFieldError('name');
      });

      expect(result.current.errors.name).toBeUndefined();
      expect(result.current.errors.email).toBe('Email is required');
    });
  });

  describe('Async Validation', () => {
    it('handles async validation loading state', async () => {
      const asyncValidator = async (value: string) => {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (value === 'taken') return 'Username is already taken';
        return true;
      };

      const { result } = renderHook(() => 
        useFormValidation(
          { username: '' },
          {
            fields: {
              username: createFieldConfig([
                {
                  custom: asyncValidator
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('username', 'taken');
      });

      let validationPromise;
      act(() => {
        validationPromise = result.current.validateField('username');
      });

      expect(result.current.isValidating).toBe(true);

      let isValid;
      await act(async () => {
        isValid = await validationPromise;
      });

      expect(result.current.isValidating).toBe(false);
      expect(isValid).toBe(false);
      expect(result.current.errors.username).toBe('Username is already taken');
    });

    it('cancels previous async validation', async () => {
      let resolveFirst: (value: boolean | string) => void;
      let resolveSecond: (value: boolean | string) => void;

      const asyncValidator = async (value: string) => {
        if (value === 'first') {
          await new Promise<boolean | string>(resolve => { resolveFirst = resolve; });
          return 'First validation failed';
        } else {
          await new Promise<boolean | string>(resolve => { resolveSecond = resolve; });
          return true;
        }
      };



      const { result } = renderHook(() => 
        useFormValidation(
          { username: '' },
          {
            fields: {
              username: createFieldConfig([
                {
                  custom: asyncValidator
                }
              ])
            }
          }
        )
      );

      // Start first validation
      let firstValidation;
      act(() => {
        result.current.setFieldValue('username', 'first');
        firstValidation = result.current.validateField('username', 'first', { username: 'first' });
      });

      // Start second validation before first completes
      let secondValidation;
      act(() => {
        result.current.setFieldValue('username', 'second');
        secondValidation = result.current.validateField('username', 'second', { username: 'second' });
      });

      // Complete first validation (should be ignored)
      act(() => {
        resolveFirst!(true);
      });

      // Complete second validation
      act(() => {
        resolveSecond!(true);
      });

      await firstValidation;
      await secondValidation;

      // Should not show first validation error
      expect(result.current.errors.username).toBeUndefined();
    });
  });

  describe('Built-in Validation Rules', () => {
    it('validates phone numbers', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { phone: '' },
          {
            fields: {
              phone: createFieldConfig([
                {
                  pattern: /^\+?[\d\s\-\(\)]+$/,
                  message: 'Invalid phone number'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('phone', 'invalid');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('phone');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.phone).toBe('Invalid phone number');

      act(() => {
        result.current.setFieldValue('phone', '+1 (555) 123-4567');
      });

      await act(async () => {
        isValid = await result.current.validateField('phone');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.phone).toBeUndefined();
    });

    it('validates URLs', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { website: '' },
          {
            fields: {
              website: createFieldConfig([
                {
                  pattern: /^https?:\/\/.+/,
                  message: 'Invalid URL'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('website', 'not-a-url');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('website');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.website).toBe('Invalid URL');

      act(() => {
        result.current.setFieldValue('website', 'https://example.com');
      });

      await act(async () => {
        isValid = await result.current.validateField('website');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.website).toBeUndefined();
    });

    it('validates numeric ranges', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { age: '' },
          {
            fields: {
              age: createFieldConfig([
                {
                  min: 18,
                  message: 'Must be at least 18'
                },
                {
                  max: 65,
                  message: 'Must be at most 65'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('age', 10);
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('age');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.age).toBe('Must be at least 18');

      act(() => {
        result.current.setFieldValue('age', 70);
      });

      await act(async () => {
        isValid = await result.current.validateField('age');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.age).toBe('Must be at most 65');

      act(() => {
        result.current.setFieldValue('age', 25);
      });

      await act(async () => {
        isValid = await result.current.validateField('age');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.age).toBeUndefined();
    });
  });

  describe('Field Dependencies', () => {
    it('validates dependent fields', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { password: '', confirmPassword: '' },
          {
            fields: {
              password: createFieldConfig([
                { required: true, message: 'Password is required' }
              ]),
              confirmPassword: createFieldConfig([
                {
                  custom: (value, allValues) => {
                    if (value !== allValues.password) return 'Passwords do not match';
                    return true;
                  }
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('password', 'password123');
        result.current.setFieldValue('confirmPassword', 'different');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('confirmPassword');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.confirmPassword).toBe('Passwords do not match');

      act(() => {
        result.current.setFieldValue('confirmPassword', 'password123');
      });

      await act(async () => {
        isValid = await result.current.validateField('confirmPassword');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.confirmPassword).toBeUndefined();
    });
  });

  describe('Validation Events', () => {
    it('calls onValidationError callback', async () => {
      const onValidationError = jest.fn();
      const { result } = renderHook(() => 
        useFormValidation(
          { email: '' },
          {
            fields: {
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          },
          { onValidationError }
        )
      );

      await act(async () => {
        await result.current.validateField('email');
      });

      expect(onValidationError).toHaveBeenCalledWith([
        expect.objectContaining({
          field: 'email',
          message: 'Email is required',
          type: 'required'
        })
      ]);

      act(() => {
        result.current.setFieldValue('email', 'valid@email.com');
      });

      // Should not be called when validation succeeds
      expect(onValidationError).toHaveBeenCalledTimes(1);
    });

    it('calls onValidationSuccess callback', async () => {
      const onValidationSuccess = jest.fn();
      const { result } = renderHook(() => 
        useFormValidation(
          { email: 'valid@email.com' },
          {
            fields: {
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          },
          { onValidationSuccess }
        )
      );

      await act(async () => {
        await result.current.validateForm();
      });

      expect(onValidationSuccess).toHaveBeenCalledWith({ email: 'valid@email.com' });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('handles empty validation config', async () => {
      const { result } = renderHook(() => 
        useFormValidation({ field: 'value' }, { fields: {} })
      );

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(true);

      let formIsValid;
      await act(async () => {
        formIsValid = await result.current.validateForm();
      });

      expect(formIsValid).toBe(true);
      expect(result.current.errors).toEqual({});
      expect(result.current.isValid).toBe(true);
    });

    it('handles undefined field values', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { field: undefined as any },
          {
            fields: {
              field: createFieldConfig([
                { required: true, message: 'Field is required' }
              ])
            }
          }
        )
      );

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.field).toBe('Field is required');
    });

    it('handles null field values', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { field: null as any },
          {
            fields: {
              field: createFieldConfig([
                { required: true, message: 'Field is required' }
              ])
            }
          }
        )
      );

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.field).toBe('Field is required');
    });

    it('handles rapid field updates', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { field: '' },
          {
            fields: {
              field: createFieldConfig([
                { required: true, message: 'Field is required' }
              ], { validateOnChange: true })
            }
          }
        )
      );

      // Rapid updates
      for (let i = 0; i < 10; i++) {
        act(() => {
          result.current.setFieldValue('field', `value${i}`);
        });
      }

      expect(result.current.data.field).toBe('value9');
      expect(result.current.errors.field).toBeUndefined();
    });

    it('handles validation with special characters', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { field: '' },
          {
            fields: {
              field: createFieldConfig([
                {
                  pattern: /^[a-zA-Z0-9\s]+$/,
                  message: 'Only alphanumeric characters allowed'
                }
              ])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('field', 'special@chars!');
      });

      let isValid;
      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(false);
      expect(result.current.errors.field).toBe('Only alphanumeric characters allowed');

      act(() => {
        result.current.setFieldValue('field', 'normal text 123');
      });

      await act(async () => {
        isValid = await result.current.validateField('field');
      });

      expect(isValid).toBe(true);
      expect(result.current.errors.field).toBeUndefined();
    });
  });

  describe('Type Safety', () => {
    it('maintains type safety with generic types', () => {
      interface FormData {
        name: string;
        age: number;
        active: boolean;
      }

      const { result } = renderHook(() => 
        useFormValidation<FormData>(
          { name: '', age: 0, active: false },
          {
            fields: {
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ]),
              age: createFieldConfig([
                { min: 18, message: 'Must be at least 18' }
              ]),
              active: createFieldConfig([])
            }
          }
        )
      );

      act(() => {
        result.current.setFieldValue('name', 'John');
        result.current.setFieldValue('age', 25);
        result.current.setFieldValue('active', true);
      });

      expect(result.current.data.name).toBe('John');
      expect(result.current.data.age).toBe(25);
      expect(result.current.data.active).toBe(true);
    });
  });

  describe('Handle Functions', () => {
    it('provides handleChange function', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { email: '' },
          {
            fields: {
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ], { validateOnChange: true })
            }
          }
        )
      );

      const handleChange = result.current.handleChange('email');
      
      act(() => {
        handleChange('new@email.com');
      });

      expect(result.current.data.email).toBe('new@email.com');
    });

    it('provides handleBlur function', () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { email: '' },
          {
            fields: {
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ], { validateOnBlur: true })
            }
          }
        )
      );

      const handleBlur = result.current.handleBlur('email');
      
      act(() => {
        handleBlur();
      });

      expect(result.current.touched.email).toBe(true);
    });

    it('provides handleSubmit function', async () => {
      const onSubmit = jest.fn();
      const { result } = renderHook(() => 
        useFormValidation(
          { email: 'test@example.com' },
          {
            fields: {
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ])
            }
          }
        )
      );

      const handleSubmit = result.current.handleSubmit(onSubmit);
      
      await act(async () => {
        await handleSubmit();
      });

      expect(onSubmit).toHaveBeenCalledWith({ email: 'test@example.com' });
    });
  });

  describe('Validation Errors Array', () => {
    it('provides detailed validation errors array', async () => {
      const { result } = renderHook(() => 
        useFormValidation(
          { email: '', name: '' },
          {
            fields: {
              email: createFieldConfig([
                { required: true, message: 'Email is required' }
              ]),
              name: createFieldConfig([
                { required: true, message: 'Name is required' }
              ])
            }
          }
        )
      );

      await act(async () => {
        await result.current.validateField('email');
        await result.current.validateField('name');
      });

      expect(result.current.validationErrors).toHaveLength(2);
      expect(result.current.validationErrors).toEqual([
        expect.objectContaining({
          field: 'email',
          message: 'Email is required',
          type: 'required'
        }),
        expect.objectContaining({
          field: 'name',
          message: 'Name is required',
          type: 'required'
        })
      ]);
    });
  });
});