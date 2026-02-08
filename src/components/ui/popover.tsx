'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'motion/react';
import { popoverTransition } from '@/lib/motion';
import { cn } from '@/lib/utils';

const PopoverContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

type PopoverContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

function Popover({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [isOpenInner, setIsOpenInner] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : isOpenInner;

  const handleOpenChange = (val: boolean) => {
    if (!isControlled) {
      setIsOpenInner(val);
    }
    onOpenChange?.(val);
  };

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} {...props}>
        {children}
      </PopoverPrimitive.Root>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  const context = React.useContext(PopoverContext);

  if (!context) {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          data-slot="popover-content"
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'bg-popover text-popover-foreground z-50 w-72 rounded-[20px] border-none p-4 shadow-lg outline-none',
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }

  return (
    <PopoverPrimitive.Portal forceMount>
      <AnimatePresence>
        {context.isOpen && (
          <PopoverPrimitive.Content
            data-slot="popover-content"
            align={align}
            sideOffset={sideOffset}
            asChild
          >
            <motion.div
              variants={popoverTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'bg-popover text-popover-foreground z-50 w-72 rounded-[20px] border-none p-4 shadow-lg outline-none',
                className
              )}
              {...(props as any)}
            />
          </PopoverPrimitive.Content>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({ ...props }: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
