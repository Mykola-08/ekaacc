'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'motion/react';

import { cn } from '@/lib/utils';
import { sheetVariants as sheetMotionVariants } from '@/lib/motion';

const SheetContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

function Sheet({
  children,
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Root>) {
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
    <SheetContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <SheetPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} {...props}>
        {children}
      </SheetPrimitive.Root>
    </SheetContext.Provider>
  );
}

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay asChild>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('fixed inset-0 z-50 bg-black/10 backdrop-blur-xs', className)}
      {...(props as any)}
      ref={ref}
    />
  </SheetPrimitive.Overlay>
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva('fixed z-50 gap-4 bg-background p-6 shadow-sm', {
  variants: {
    side: {
      top: 'inset-x-0 top-0 border-b',
      bottom: 'inset-x-0 bottom-0 border-t',
      left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm rounded-r-3xl border-none',
      right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm rounded-l-3xl border-none',
    },
  },
  defaultVariants: {
    side: 'right',
  },
});

interface SheetContentProps
  extends
    React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, ...props }, ref) => {
  const context = React.useContext(SheetContext);

  if (!context) {
    return (
      <SheetPortal>
        <SheetOverlay />
        <SheetPrimitive.Content
          ref={ref}
          className={cn(
            sheetVariants({ side }),
            className,
            'm-0 max-h-[calc(100vh-2rem)] rounded-none md:m-4 md:rounded-lg'
          )}
          {...props}
        >
          {children}
          <SheetPrimitive.Close className="ring-offset-background hover:bg-secondary focus:ring-ring data-[state=open]:bg-secondary absolute top-6 right-6 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
            <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" strokeWidth={2.5} />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  }

  return (
    <SheetPortal forceMount>
      <AnimatePresence>
        {context.isOpen && (
          <>
            <SheetOverlay key="overlay" />
            <SheetPrimitive.Content ref={ref} asChild>
              <motion.div
                key="content"
                custom={side}
                variants={sheetMotionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  sheetVariants({ side }),
                  className,
                  'm-0 max-h-[calc(100vh-2rem)] rounded-none md:m-4 md:rounded-lg'
                )}
                {...(props as any)}
              >
                {children}
                <SheetPrimitive.Close className="ring-offset-background hover:bg-secondary focus:ring-ring data-[state=open]:bg-secondary absolute top-6 right-6 rounded-full p-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
                  <HugeiconsIcon icon={Cancel01Icon} className="h-5 w-5" strokeWidth={2.5} />
                  <span className="sr-only">Close</span>
                </SheetPrimitive.Close>
              </motion.div>
            </SheetPrimitive.Content>
          </>
        )}
      </AnimatePresence>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-foreground text-base font-medium', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
