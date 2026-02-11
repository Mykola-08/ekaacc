import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyMedia,
  EmptyContent,
} from '@/components/ui/empty';
import { HugeiconsIcon } from '@hugeicons/react';
import { InboxIcon } from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';

/**
 * One-liner empty state component. Replaces 15+ ad-hoc empty state blocks.
 *
 * ```tsx
 * <EmptyState
 *   icon={Calendar03Icon}
 *   title="No bookings found"
 *   description="Create your first booking to get started."
 *   action={<Button>Create Booking</Button>}
 * />
 * ```
 */
export interface EmptyStateProps {
  /** Hugeicons icon displayed in the center. @default InboxIcon */
  icon?: IconSvgElement;
  /** Main heading text. */
  title: string;
  /** Optional supporting description. */
  description?: string;
  /** Optional CTA rendered below the text. */
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = InboxIcon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={cn('border-dashed py-16', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={icon} className="h-6 w-6" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
