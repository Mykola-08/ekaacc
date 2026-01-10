/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef, useEffect } from 'react';

interface UseDebouncedInputOptions {
  delay?: number;
  onCommit?: (value: string) => void;
  onChange?: (value: string) => void;
}

export function useDebouncedInput(
  initialValue: string = '',
  options: UseDebouncedInputOptions = {}
) {
  const { delay = 300, onCommit, onChange } = options;
  const [localValue, setLocalValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const commitRef = useRef(onCommit);
  const changeRef = useRef(onChange);

  // Update refs without causing re-renders
  useEffect(() => {
    commitRef.current = onCommit;
    changeRef.current = onChange;
  });

  const debouncedCommit = useCallback((value: string) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      commitRef.current?.(value);
    }, delay);
  }, [delay]);

  const handleChange = useCallback((value: string) => {
    setLocalValue(value);
    changeRef.current?.(value);
    debouncedCommit(value);
  }, [debouncedCommit]);

  const handleBlur = useCallback(() => {
    clearTimeout(timeoutRef.current);
    commitRef.current?.(localValue.trim());
  }, [localValue]);

  const setValue = useCallback((value: string) => {
    setLocalValue(value);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return {
    value: localValue,
    setValue,
    handleChange,
    handleBlur,
    inputProps: {
      value: localValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleChange(e.target.value),
      onBlur: handleBlur,
    },
  };
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args: Parameters<T>) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  }, [delay]);
}
