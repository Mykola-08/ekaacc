import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Standardized page header used across all pages.
 * Replaces inline `<h1>` + `<p>` + action button patterns.
 *
 * ```tsx
 * <PageSection
 *   title="Reservations"
 *   description="Manage all platform sessions."
 *   actions={<Button>Add New</Button>}
 * />
 * ```
 */
export interface PageSectionProps {
  title: string;
  description?: string;
  /** Action buttons rendered on the right side. */
  actions?: React.ReactNode;
  /** Badge rendered next to the title. */
  badge?: React.ReactNode;
  /** Icon component rendered before the title. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Heading level: 'h1' (page), 'h2' (section), 'h3' (subsection). @default 'h1' */
  level?: 'h1' | 'h2' | 'h3';
  className?: string;
  children?: React.ReactNode;
}

const headingStyles = {
  h1: 'text-3xl font-semibold tracking-tight',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold tracking-tight',
} as const;

export function PageSection({
  title,
  description,
  actions,
  badge,
  icon: Icon,
  level = 'h1',
  className,
  children,
}: PageSectionProps) {
  const Heading = level;

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              <Icon className="text-foreground h-5 w-5" />
            </div>
          )}
          <div>
            <Heading className={cn('text-foreground flex items-center gap-2', headingStyles[level])}>
              {title}
              {badge}
            </Heading>
            {description && (
              <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
