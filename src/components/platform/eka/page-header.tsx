import React from 'react';

export function PageHeader({
  title,
  description,
  actions,
  badge,
  icon: Icon,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: any;
  className?: string;
}) {
  return (
    <div className={`mb-4 flex items-center justify-between space-y-2 ${className || ''}`}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-6 w-6" />}
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            {title}
            {badge && <span className="bg-muted rounded px-2 py-1 text-sm">{badge}</span>}
          </h2>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}
