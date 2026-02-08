import { Skeleton } from '../ui/skeleton';

/**
 * Used for project grids and dashboard items.
 * Mimics the shape of the content that is about to load.
 */
export function CardSkeleton() {
  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
      <div className="flex flex-col space-y-3 p-6">
        <Skeleton className="h-31.25 w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-62.5" />
          <Skeleton className="h-4 w-50" />
        </div>
      </div>
    </div>
  );
}

/**
 * A specialized placeholder for the analytics grid.
 */
export function ProjectStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-30 w-full rounded-xl" />
      ))}
    </div>
  );
}

/**
 * Generic text-line placeholders for paragraphs.
 */
export function LoadingSkeleton() {
  return (
    <div className="w-full space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  );
}
