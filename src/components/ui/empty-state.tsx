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
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

/**
 * One-liner empty state component. Replaces 15+ ad-hoc empty state blocks.
 *
 * ```tsx
 * <EmptyState
 *   icon={Calendar}
 *   title="No bookings found"
 *   description="Create your first booking to get started."
 *   action={<Button>Create Booking</Button>}
 * />
 * ```
 */
export interface EmptyStateProps {
  /** Icon displayed in the center. @default Inbox */
  icon?: LucideIcon;
  /** Main heading text. */
  title: string;
  /** Optional supporting description. */
  description?: string;
  /** Optional CTA rendered below the text. */
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Empty className={cn('border-2 py-16', className)}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      {action && <EmptyContent>{action}</EmptyContent>}
    </Empty>
  );
}
