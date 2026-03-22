'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { BookmarkAdd01Icon } from 'hugeicons-react';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';

export type CheckpointProps = HTMLAttributes<HTMLDivElement>;

export const Checkpoint = ({ className, children, ...props }: CheckpointProps) => (
  <div
    className={cn('text-muted-foreground flex items-center gap-0.5 overflow-hidden', className)}
    {...props}
  >
    {children}
    <Separator />
  </div>
);

export type CheckpointIconProps = { className?: string; children?: ReactNode };

export const CheckpointIcon = ({ className, children }: CheckpointIconProps) =>
  children ?? <BookmarkAdd01Icon className={cn('size-4 shrink-0', className)} />;

export type CheckpointTriggerProps = ComponentProps<typeof Button> & {
  tooltip?: string;
};

export const CheckpointTrigger = ({
  children,
  variant = 'ghost',
  size = 'sm',
  tooltip,
  ...props
}: CheckpointTriggerProps) =>
  tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size={size} type="button" variant={variant} {...props}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start" side="bottom">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  ) : (
    <Button size={size} type="button" variant={variant} {...props}>
      {children}
    </Button>
  );
