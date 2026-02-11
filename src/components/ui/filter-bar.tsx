'use client';

import * as React from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface FilterBarProps {
  /** Current search value. */
  search: string;
  /** Called when search input changes. */
  onSearchChange: (value: string) => void;
  /** Placeholder text for search input. */
  searchPlaceholder?: string;
  /** Filter pills. The first item is always the "show all" option. */
  filters?: string[];
  /** Currently active filter. */
  activeFilter?: string;
  /** Called when a filter pill is clicked. */
  onFilterChange?: (filter: string) => void;
  /** Additional actions rendered at the end (e.g. "Add New" button). */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Standardized Search + Filter-pill bar used across admin lists,
 * booking tables, and anywhere that needs search-and-filter.
 *
 * ```tsx
 * <FilterBar
 *   search={search}
 *   onSearchChange={setSearch}
 *   searchPlaceholder="Search bookings..."
 *   filters={['all', 'scheduled', 'completed', 'canceled']}
 *   activeFilter={statusFilter}
 *   onFilterChange={setStatusFilter}
 * />
 * ```
 */
export function FilterBar({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  activeFilter,
  onFilterChange,
  actions,
  className,
}: FilterBarProps) {
  return (
    <Card className={cn('flex flex-col items-center gap-4 p-4 md:flex-row', className)}>
      {/* Search input */}
      <div className="relative w-full flex-1 md:w-auto">
        <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter pills */}
      {filters && filters.length > 0 && onFilterChange && (
        <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange(filter)}
              className={cn(
                'h-9 rounded-full px-5 capitalize',
                activeFilter !== filter && 'text-muted-foreground border-border'
              )}
            >
              {filter}
            </Button>
          ))}
        </div>
      )}

      {/* Extra actions */}
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </Card>
  );
}
