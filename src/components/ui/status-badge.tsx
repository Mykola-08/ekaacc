import * as React from 'react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  Ban,
  Circle,
  Loader2,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';

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
  icon: LucideIcon;
  label?: string;
}

const STATUS_MAP: Record<StatusKey, StatusConfig> = {
  // Success family
  active: { variant: 'success', icon: CheckCircle },
  confirmed: { variant: 'success', icon: CheckCircle },
  completed: { variant: 'success', icon: CheckCircle },
  success: { variant: 'success', icon: CheckCircle },
  healthy: { variant: 'success', icon: ShieldCheck },
  approved: { variant: 'success', icon: CheckCircle },
  paid: { variant: 'success', icon: CheckCircle },

  // Warning family
  pending: { variant: 'warning', icon: Clock },
  scheduled: { variant: 'warning', icon: Clock },
  processing: { variant: 'warning', icon: Loader2 },
  warning: { variant: 'warning', icon: AlertTriangle },
  medium: { variant: 'warning', icon: AlertTriangle },

  // Destructive family
  cancelled: { variant: 'destructive', icon: XCircle },
  canceled: { variant: 'destructive', icon: XCircle },
  failed: { variant: 'destructive', icon: XCircle },
  error: { variant: 'destructive', icon: XCircle },
  critical: { variant: 'destructive', icon: XCircle },
  suspended: { variant: 'destructive', icon: Ban },
  rejected: { variant: 'destructive', icon: XCircle },
  unpaid: { variant: 'destructive', icon: AlertTriangle },

  // Neutral family
  inactive: { variant: 'secondary', icon: Circle },
  expired: { variant: 'secondary', icon: Circle },
  info: { variant: 'info', icon: Circle },
  draft: { variant: 'secondary', icon: Circle },
  unknown: { variant: 'outline', icon: Circle },
};

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  /** The semantic status key. */
  status: string;
  /** Override the auto-resolved label (defaults to capitalized status). */
  label?: string;
  /** Show icon before the label. @default true */
  showIcon?: boolean;
  /** Override the icon. */
  icon?: LucideIcon;
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
    <Badge
      variant={badgeVariant}
      className={cn('gap-1.5 capitalize', className)}
      {...props}
    >
      {showIcon && <Icon className="h-3 w-3" />}
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
