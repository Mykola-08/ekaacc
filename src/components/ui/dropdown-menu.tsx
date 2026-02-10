'use client';

import * as React from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { HugeiconsIcon } from '@hugeicons/react';
import { Tick02Icon, ArrowRight01Icon, CircleIcon } from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '@/lib/utils';
import { dropdownTransition } from '@/lib/motion';

const DropdownMenuContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const DropdownMenu = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => {
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
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} {...props}>
        {children}
      </DropdownMenuPrimitive.Root>
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

const DropdownMenuGroup = DropdownMenuPrimitive.Group;

const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

const DropdownMenuSubContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const DropdownMenuSub = ({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) => {
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
    <DropdownMenuSubContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <DropdownMenuPrimitive.Sub open={isOpen} onOpenChange={handleOpenChange} {...props}>
        {children}
      </DropdownMenuPrimitive.Sub>
    </DropdownMenuSubContext.Provider>
  );
};

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

type DropdownMenuContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>,
  'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'focus:bg-accent data-[state=open]:bg-accent flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <HugeiconsIcon icon={ArrowRight01Icon} className="ml-auto size-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => {
  const context = React.useContext(DropdownMenuSubContext);

  return (
    <AnimatePresence>
      {context?.isOpen && (
        <DropdownMenuPrimitive.SubContent
          ref={ref}
          forceMount
          asChild
          className={cn(
            'bg-popover text-popover-foreground z-50 min-w-32 overflow-hidden rounded-lg ring-foreground/10 ring-1 p-1 shadow-md',
            className
          )}
          {...props}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownTransition}
          />
        </DropdownMenuPrimitive.SubContent>
      )}
    </AnimatePresence>
  );
});
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset = 4, ...props }, ref) => {
  const context = React.useContext(DropdownMenuContext);

  if (!context) {
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'bg-popover text-popover-foreground z-50 min-w-32 overflow-hidden rounded-lg ring-foreground/10 ring-1 p-1 shadow-md duration-200',
            className
          )}
          {...props}
        />
      </DropdownMenuPrimitive.Portal>
    );
  }

  return (
    <DropdownMenuPrimitive.Portal forceMount>
      <AnimatePresence>
        {context.isOpen && (
          <DropdownMenuPrimitive.Content ref={ref} sideOffset={sideOffset} asChild>
            <motion.div
              variants={dropdownTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'bg-popover text-popover-foreground z-50 min-w-32 overflow-hidden rounded-lg ring-foreground/10 ring-1 p-1 shadow-md',
                className
              )}
              {...(props as any)}
            />
          </DropdownMenuPrimitive.Content>
        )}
      </AnimatePresence>
    </DropdownMenuPrimitive.Portal>
  );
});
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-md py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <HugeiconsIcon icon={Tick02Icon} className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center rounded-md py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <HugeiconsIcon icon={CircleIcon} className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('bg-muted -mx-1 my-1 h-px', className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
  );
};
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
