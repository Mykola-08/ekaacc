'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, ArrowDown01Icon, ArrowUp01Icon } from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'motion/react';
import { dropdownTransition } from '@/lib/motion';

import { cn } from '@/lib/utils';

const SelectContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const Select = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) => {
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
    <SelectContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <SelectPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} {...props}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'border-input data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive gap-1.5 rounded-lg border bg-transparent py-2 pr-2 pl-2.5 text-sm transition-colors select-none focus-visible:ring-3 h-8 flex w-fit items-center justify-between whitespace-nowrap outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 [&_svg]:pointer-events-none [&_svg]:shrink-0',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 opacity-50" strokeWidth={2.5} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <HugeiconsIcon icon={ArrowUp01Icon} className="h-4 w-4" strokeWidth={2.5} />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('flex cursor-default items-center justify-center py-1', className)}
    {...props}
  >
    <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4" strokeWidth={2.5} />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

type SelectContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectContentProps
>(({ className, children, position = 'popper', ...props }, ref) => {
  const context = React.useContext(SelectContext);

  if (!context) {
    return (
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          ref={ref}
          className={cn(
            'bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg ring-foreground/10 ring-1 shadow-md',
            position === 'popper' &&
              'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
            className
          )}
          position={position}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.Viewport
            className={cn(
              'p-2',
              position === 'popper' &&
                'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
          <SelectScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    );
  }

  return (
    <SelectPrimitive.Portal>
      <AnimatePresence>
        {context.isOpen && (
          <SelectPrimitive.Content ref={ref} position={position} asChild>
            <motion.div
              variants={dropdownTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg ring-foreground/10 ring-1 shadow-md',
                position === 'popper' &&
                  'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
                className
              )}
              {...(props as any)}
            >
              <SelectScrollUpButton />
              <SelectPrimitive.Viewport
                className={cn(
                  'p-2',
                  position === 'popper' &&
                    'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
                )}
              >
                {children}
              </SelectPrimitive.Viewport>
              <SelectScrollDownButton />
            </motion.div>
          </SelectPrimitive.Content>
        )}
      </AnimatePresence>
    </SelectPrimitive.Portal>
  );
});
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('text-muted-foreground px-1.5 py-1 text-xs', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center rounded-md py-1 pr-8 pl-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <HugeiconsIcon icon={Tick02Icon} className="h-4 w-4" strokeWidth={2.5} />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('bg-muted -mx-1 my-1 h-px', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
