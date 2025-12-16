'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState, createContext, useContext, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  expandedValue: string | null;
  setExpandedValue: (value: string | null) => void;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

interface AccordionProps {
  children: ReactNode;
  className?: string;
  defaultValue?: string;
}

export function Accordion({ children, className, defaultValue }: AccordionProps) {
  const [expandedValue, setExpandedValue] = useState<string | null>(defaultValue || null);

  return (
    <AccordionContext.Provider value={{ expandedValue, setExpandedValue }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const context = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);
  
  if (!context || !itemContext) return null;

  const isExpanded = context.expandedValue === itemContext.value;

  return (
    <button
      onClick={() => context.setExpandedValue(isExpanded ? null : itemContext.value)}
      className={cn(
        'w-full px-4 py-3 text-left font-medium hover:bg-accent/50 transition-colors flex items-center justify-between',
        className
      )}
    >
      {children}
      <motion.svg
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </motion.svg>
    </button>
  );
}

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

const AccordionItemContext = createContext<{ value: string } | undefined>(undefined);

export function AccordionContent({ children, className }: AccordionContentProps) {
  const context = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  if (!context || !itemContext) return null;

  const isExpanded = context.expandedValue === itemContext.value;

  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? height : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div ref={contentRef} className={cn('px-4 py-3', className)}>
        {children}
      </div>
    </motion.div>
  );
}

// Wrapper to provide item context
export function AccordionItemWithContext({ value, children, className }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <AccordionItem value={value} className={className}>
        {children}
      </AccordionItem>
    </AccordionItemContext.Provider>
  );
}
