import React from 'react';
import {
  Lock,
  Shield,
  AlertTriangle,
  EyeOff,
  Ban,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type RestrictionType = 'permission' | 'role' | 'subscription' | 'beta' | 'time' | 'location';
export type RestrictionSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface RestrictionIndicatorProps {
  type: RestrictionType;
  severity?: RestrictionSeverity;
  message?: string;
  reason?: string;
  showIcon?: boolean;
  showLabel?: boolean;
  className?: string;
  onClick?: () => void;
  tooltipContent?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'badge' | 'banner' | 'overlay' | 'inline';
}

const restrictionConfig = {
  permission: {
    icon: Lock,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive',
    defaultMessage: 'Access restricted',
    defaultReason: 'Insufficient permissions',
  },
  role: {
    icon: Shield,
    color: 'text-warning',
    bgColor: 'bg-warning',
    borderColor: 'border-warning',
    defaultMessage: 'Role restricted',
    defaultReason: 'Requires specific role',
  },
  subscription: {
    icon: EyeOff,
    color: 'text-chart-4',
    bgColor: 'bg-accent',
    borderColor: 'border-accent',
    defaultMessage: 'Subscription required',
    defaultReason: 'Premium subscription needed',
  },
  beta: {
    icon: Clock,
    color: 'text-info',
    bgColor: 'bg-info',
    borderColor: 'border-info',
    defaultMessage: 'Beta feature',
    defaultReason: 'Feature in development',
  },
  time: {
    icon: Clock,
    color: 'text-warning',
    bgColor: 'bg-warning',
    borderColor: 'border-warning/30',
    defaultMessage: 'Time restricted',
    defaultReason: 'Not available at this time',
  },
  location: {
    icon: Ban,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
    borderColor: 'border-border',
    defaultMessage: 'Location restricted',
    defaultReason: 'Not available in your region',
  },
};

const severityConfig = {
  info: {
    icon: Info,
    color: 'text-info',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
  },
  error: {
    icon: XCircle,
    color: 'text-destructive',
  },
  critical: {
    icon: AlertCircle,
    color: 'text-destructive',
  },
};

export function RestrictionIndicator({
  type,
  severity = 'warning',
  message,
  reason,
  showIcon = true,
  showLabel = true,
  className,
  onClick,
  tooltipContent,
  size = 'md',
  variant = 'badge',
}: RestrictionIndicatorProps) {
  const config = restrictionConfig[type];
  const severityIcon = severityConfig[severity].icon;
  const RestrictionIcon = config.icon;
  const SeverityIcon = severityIcon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  const getDisplayMessage = () => {
    if (message) return message;
    if (reason) return `${config.defaultMessage}: ${reason}`;
    return config.defaultMessage;
  };

  const getTooltipContent = () => {
    if (tooltipContent) return tooltipContent;
    return `${getDisplayMessage()}${reason ? ` - ${reason}` : ''}`;
  };

  const renderContent = () => (
    <div
      className={cn(
        'flex items-center space-x-2',
        onClick && 'cursor-pointer transition-opacity hover:opacity-80',
        className
      )}
      onClick={onClick}
    >
      {showIcon && (
        <div className="flex items-center space-x-1">
          <RestrictionIcon className={cn('h-4 w-4', config.color)} />
          <SeverityIcon className={cn('h-3 w-3', severityConfig[severity].color)} />
        </div>
      )}
      {showLabel && <span className={cn('font-medium', config.color)}>{getDisplayMessage()}</span>}
    </div>
  );

  if (variant === 'badge') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={cn(
                config.bgColor,
                config.borderColor,
                config.color,
                sizeClasses[size],
                'border'
              )}
            >
              {renderContent()}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'w-full rounded-lg border p-4',
          config.bgColor,
          config.borderColor,
          className
        )}
      >
        <div className="flex items-start space-x-3">
          <RestrictionIcon className={cn('mt-0.5 h-5 w-5', config.color)} />
          <div className="flex-1">
            <div className="mb-1 flex items-center space-x-2">
              <SeverityIcon className={cn('h-4 w-4', severityConfig[severity].color)} />
              <span className={cn('font-semibold', config.color)}>{getDisplayMessage()}</span>
            </div>
            {reason && <p className={cn('mt-1 text-sm', config.color)}>{reason}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          'bg-opacity-50 bg-foreground backdrop-blur-sm',
          'rounded-lg',
          className
        )}
      >
        <div
          className={cn('rounded-lg border p-6 text-center', config.bgColor, config.borderColor)}
        >
          <RestrictionIcon className={cn('mx-auto mb-3 h-12 w-12', config.color)} />
          <h3 className={cn('mb-2 font-semibold', config.color)}>{getDisplayMessage()}</h3>
          {reason && <p className={cn('text-sm', config.color)}>{reason}</p>}
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{renderContent()}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs">{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export interface RestrictedContentWrapperProps {
  children: React.ReactNode;
  restrictions: Array<{
    type: RestrictionType;
    severity?: RestrictionSeverity;
    message?: string;
    reason?: string;
  }>;
  showRestriction?: boolean;
  overlay?: boolean;
  className?: string;
}

export function RestrictedContentWrapper({
  children,
  restrictions,
  showRestriction = true,
  overlay = false,
  className,
}: RestrictedContentWrapperProps) {
  if (!showRestriction || restrictions.length === 0) {
    return <>{children}</>;
  }

  const mostSevereRestriction = restrictions.reduce((prev, current) => {
    const severityOrder = { info: 1, warning: 2, error: 3, critical: 4 };
    return severityOrder[current.severity || 'warning'] > severityOrder[prev.severity || 'warning']
      ? current
      : prev;
  });

  if (overlay) {
    return (
      <div className={cn('relative', className)}>
        {children}
        <RestrictionIndicator {...mostSevereRestriction} variant="overlay" className="z-10" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <RestrictionIndicator {...mostSevereRestriction} variant="banner" />
      {children}
    </div>
  );
}

export interface PermissionRequiredIndicatorProps {
  requiredPermissions: Array<{
    group: string;
    action: string;
  }>;
  userRole?: string;
  showDetailed?: boolean;
  className?: string;
}

export function PermissionRequiredIndicator({
  requiredPermissions,
  userRole,
  showDetailed = false,
  className,
}: PermissionRequiredIndicatorProps) {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="text-muted-foreground flex items-center space-x-2 text-sm">
        <Lock className="h-4 w-4" />
        <span>Required Permissions:</span>
      </div>

      <div className="space-y-1">
        {requiredPermissions.map((permission, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center justify-between rounded-md border p-2 text-sm',
              'border-warning bg-warning'
            )}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-warning" />
              <span className="font-mono text-warning-foreground">
                {permission.group}:{permission.action}
              </span>
            </div>
            {userRole && showDetailed && (
              <Badge variant="outline" className="text-xs">
                Check for {userRole}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export interface RoleBadgeProps {
  role: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function RoleBadge({ role, size = 'md', showIcon = true, className }: RoleBadgeProps) {
  const roleColors = {
    Admin: 'bg-destructive/20 text-destructive border-destructive',
    Therapist: 'bg-info/20 text-info-foreground border-info',
    Patient: 'bg-success/20 text-success border-success',
    'VIP Patient': 'bg-accent/20 text-accent-foreground border-accent',
    Reception: 'bg-warning/20 text-warning border-warning',
    'Content Manager': 'bg-accent/20 text-accent-foreground border-accent/30',
    Marketing: 'bg-accent/20 text-accent-foreground border-accent/30',
    Accountant: 'bg-warning/20 text-warning-foreground border-warning/30',
    'Corporate Client': 'bg-info/20 text-info-foreground border-info',
    Custom: 'bg-muted text-foreground border-border',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        roleColors[role as keyof typeof roleColors] || roleColors['Custom'],
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Shield className="mr-1 h-3 w-3" />}
      {role}
    </Badge>
  );
}
