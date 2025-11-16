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
  Warning
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/keep';

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
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    defaultMessage: 'Access restricted',
    defaultReason: 'Insufficient permissions'
  },
  role: {
    icon: Shield,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    defaultMessage: 'Role restricted',
    defaultReason: 'Requires specific role'
  },
  subscription: {
    icon: EyeOff,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    defaultMessage: 'Subscription required',
    defaultReason: 'Premium subscription needed'
  },
  beta: {
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    defaultMessage: 'Beta feature',
    defaultReason: 'Feature in development'
  },
  time: {
    icon: Clock,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    defaultMessage: 'Time restricted',
    defaultReason: 'Not available at this time'
  },
  location: {
    icon: Ban,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    defaultMessage: 'Location restricted',
    defaultReason: 'Not available in your region'
  }
};

const severityConfig = {
  info: {
    icon: Info,
    color: 'text-blue-500'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-500'
  },
  error: {
    icon: XCircle,
    color: 'text-red-500'
  },
  critical: {
    icon: Warning,
    color: 'text-red-700'
  }
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
  variant = 'badge'
}: RestrictionIndicatorProps) {
  const config = restrictionConfig[type];
  const severityIcon = severityConfig[severity].icon;
  const RestrictionIcon = config.icon;
  const SeverityIcon = severityIcon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
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
    <div className={cn(
      'flex items-center space-x-2',
      onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
      className
    )} onClick={onClick}>
      {showIcon && (
        <div className="flex items-center space-x-1">
          <RestrictionIcon className={cn('h-4 w-4', config.color)} />
          <SeverityIcon className={cn('h-3 w-3', severityConfig[severity].color)} />
        </div>
      )}
      {showLabel && (
        <span className={cn('font-medium', config.color)}>
          {getDisplayMessage()}
        </span>
      )}
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
      <div className={cn(
        'w-full p-4 rounded-lg border',
        config.bgColor,
        config.borderColor,
        className
      )}>
        <div className="flex items-start space-x-3">
          <RestrictionIcon className={cn('h-5 w-5 mt-0.5', config.color)} />
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <SeverityIcon className={cn('h-4 w-4', severityConfig[severity].color)} />
              <span className={cn('font-semibold', config.color)}>
                {getDisplayMessage()}
              </span>
            </div>
            {reason && (
              <p className={cn('text-sm mt-1', config.color)}>
                {reason}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={cn(
        'absolute inset-0 flex items-center justify-center',
        'bg-black bg-opacity-50 backdrop-blur-sm',
        'rounded-lg',
        className
      )}>
        <div className={cn(
          'p-6 rounded-lg border text-center',
          config.bgColor,
          config.borderColor
        )}>
          <RestrictionIcon className={cn('h-12 w-12 mx-auto mb-3', config.color)} />
          <h3 className={cn('font-semibold mb-2', config.color)}>
            {getDisplayMessage()}
          </h3>
          {reason && (
            <p className={cn('text-sm', config.color)}>
              {reason}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Inline variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {renderContent()}
        </TooltipTrigger>
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
  className
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
        <RestrictionIndicator
          {...mostSevereRestriction}
          variant="overlay"
          className="z-10"
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <RestrictionIndicator
        {...mostSevereRestriction}
        variant="banner"
      />
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
  className
}: PermissionRequiredIndicatorProps) {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>Required Permissions:</span>
      </div>
      
      <div className="space-y-1">
        {requiredPermissions.map((permission, index) => (
          <div 
            key={index} 
            className={cn(
              'flex items-center justify-between p-2 rounded-md border text-sm',
              'bg-orange-50 border-orange-200'
            )}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span className="font-mono text-orange-700">
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

export function RoleBadge({
  role,
  size = 'md',
  showIcon = true,
  className
}: RoleBadgeProps) {
  const roleColors = {
    'Admin': 'bg-red-100 text-red-800 border-red-200',
    'Therapist': 'bg-blue-100 text-blue-800 border-blue-200',
    'Patient': 'bg-green-100 text-green-800 border-green-200',
    'VIP Patient': 'bg-purple-100 text-purple-800 border-purple-200',
    'Reception': 'bg-orange-100 text-orange-800 border-orange-200',
    'Content Manager': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'Marketing': 'bg-pink-100 text-pink-800 border-pink-200',
    'Accountant': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Corporate Client': 'bg-teal-100 text-teal-800 border-teal-200',
    'Custom': 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
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
      {showIcon && <Shield className="h-3 w-3 mr-1" />}
      {role}
    </Badge>
  );
}