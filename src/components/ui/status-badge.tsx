import * as React from 'react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import {
  CheckmarkCircle02Icon,
  Clock01Icon,
  Cancel01Icon,
  Alert02Icon,
  CancelCircleIcon,
  CircleIcon,
  Loading03Icon,
  ShieldCheck,
} from '@hugeicons/core-free-icons';

/**
 * Canonical status → badge variant + icon mapping.
 * Every component that needs to render a status should use
 * `<StatusBadge status="confirmed" />` instead of hand-rolling
 * switch statements with inline Tailwind classes.
 */

type StatusKey =
  | 'active'
  | 'confirmed'
  | 'completed'
  | 'success'
  | 'healthy'
  | 'approved'
  | 'paid'
  | 'pending'
  | 'scheduled'
  | 'processing'
  | 'warning'
  | 'medium'
  | 'cancelled'
  | 'canceled'
  | 'failed'
  | 'error'
  | 'critical'
  | 'suspended'
  | 'rejected'
  | 'unpaid'
  | 'inactive'
  | 'expired'
  | 'info'
  | 'draft'
  | 'unknown';

interface StatusConfig {
  variant: BadgeProps['variant'];
  icon: IconSvgElement;
  label?: string;
}

const STATUS_MAP: Record<StatusKey, StatusConfig> = {
  // Success family
  active: { variant: 'success', icon: CheckmarkCircle02Icon },
  confirmed: { variant: 'success', icon: CheckmarkCircle02Icon },
  completed: { variant: 'success', icon: CheckmarkCircle02Icon },
  success: { variant: 'success', icon: CheckmarkCircle02Icon },
  healthy: { variant: 'success', icon: ShieldCheck },
  approved: { variant: 'success', icon: CheckmarkCircle02Icon },
  paid: { variant: 'success', icon: CheckmarkCircle02Icon },

  // Warning family
  pending: { variant: 'warning', icon: Clock01Icon },
  scheduled: { variant: 'warning', icon: Clock01Icon },
  processing: { variant: 'warning', icon: Loading03Icon },
  warning: { variant: 'warning', icon: Alert02Icon },
  medium: { variant: 'warning', icon: Alert02Icon },

  // Destructive family
  cancelled: { variant: 'destructive', icon: Cancel01Icon },
  canceled: { variant: 'destructive', icon: Cancel01Icon },
  failed: { variant: 'destructive', icon: Cancel01Icon },
  error: { variant: 'destructive', icon: Cancel01Icon },
  critical: { variant: 'destructive', icon: Cancel01Icon },
  suspended: { variant: 'destructive', icon: CancelCircleIcon },
  rejected: { variant: 'destructive', icon: Cancel01Icon },
  unpaid: { variant: 'destructive', icon: Alert02Icon },

  // Neutral family
  inactive: { variant: 'secondary', icon: CircleIcon },
  expired: { variant: 'secondary', icon: CircleIcon },
  info: { variant: 'info', icon: CircleIcon },
  draft: { variant: 'secondary', icon: CircleIcon },
  unknown: { variant: 'outline', icon: CircleIcon },
};

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** The semantic status key. */
  status: string;
  /** Override the auto-resolved label (defaults to capitalized status). */
  label?: string;
  /** Show icon before the label. @default true */
  showIcon?: boolean;
  /** Override the icon. */
  icon?: IconSvgElement;
  /** Override the variant. */
  variant?: BadgeProps['variant'];
}

export function StatusBadge({
  status,
  label,
  showIcon = true,
  icon: IconOverride,
  variant: variantOverride,
  className,
  ...props
}: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/\s+/g, '-') as StatusKey;
  const config = STATUS_MAP[key] ?? STATUS_MAP.unknown;
  const Icon = IconOverride ?? config.icon;
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1);
  const badgeVariant = variantOverride ?? config.variant;

  return (
    <Badge variant={badgeVariant} className={cn('gap-1.5 capitalize', className)} {...props}>
      {showIcon && <HugeiconsIcon icon={Icon} className="h-3 w-3" />}
      {displayLabel}
    </Badge>
  );
}

/**
 * Utility to get the variant for a given status string.
 * Useful when you need just the variant without rendering a badge.
 */
export function getStatusVariant(status: string): BadgeProps['variant'] {
  const key = status.toLowerCase().replace(/\s+/g, '-') as StatusKey;
  return (STATUS_MAP[key] ?? STATUS_MAP.unknown).variant;
}
