'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/marketing/shared/utils';

interface AccordionContextValue {
  value: string | string[] | undefined;
  onValueChange: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = React.createContext<AccordionContextValue | undefined>(undefined);

interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  defaultValue?: string | string[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
  children: React.ReactNode;
}

export function Accordion({ 
  type = 'single', 
  collapsible = false,
  defaultValue, 
  value: controlledValue,
  onValueChange,
  className,
  children 
}: AccordionProps) {
  // Simple internal state management for uncontrolled usage
  const [internalValue, setInternalValue] = React.useState<string | string[]>(
    defaultValue || (type === 'multiple' ? [] : '')
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (itemValue: string) => {
    if (type === 'single') {
      const newValue = value === itemValue ? (collapsible ? '' : itemValue) : itemValue;
      setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    } else {
      const currentValues = Array.isArray(value) ? value : [];
      const newValue = currentValues.includes(itemValue)
        ? currentValues.filter((v) => v !== itemValue)
        : [...currentValues, itemValue];
      setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    }
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, type }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function AccordionItem({ value, className, children }: AccordionItemProps) {
  // Removed hardcoded background and rounded corners for universal design
  return (
    <div className={cn('overflow-hidden transition-colors', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value } as React.Attributes & { value: string });
        }
        return child;
      })}
    </div>
  );
}

interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
  value?: string; // Injected by Item
}

export function AccordionTrigger({ children, className, value: itemValue }: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionTrigger must be used within Accordion');

  const isOpen = Array.isArray(context.value) 
    ? context.value.includes(itemValue!) 
    : context.value === itemValue;

  return (
    <button
      className={cn(
        'group flex w-full flex-1 items-center justify-between py-4 text-left font-medium transition focus:outline-none',
        className
      )}
      onClick={() => context.onValueChange(itemValue!)}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        className={cn(
          'h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-300',
          isOpen && 'rotate-180 text-blue-600'
        )}
      />
    </button>
  );
}

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  value?: string; // Injected by Item
}

export function AccordionContent({ children, className, value: itemValue }: AccordionContentProps) {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('AccordionContent must be used within Accordion');

  const isOpen = Array.isArray(context.value) 
    ? context.value.includes(itemValue!) 
    : context.value === itemValue;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden bg-transparent"
        >
          <div className={cn('pb-4 pt-0', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
