import { Skeleton } from "../ui/skeleton"

/**
 * Used for project grids and dashboard items.
 * Mimics the shape of the content that is about to load.
 */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    </div>
  )
}

/**
 * A specialized placeholder for the analytics grid.
 */
export function ProjectStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
      ))}
    </div>
  )
}

/**
 * Generic text-line placeholders for paragraphs.
 */
export function LoadingSkeleton() {
  return (
    <div className="space-y-2 w-full">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[80%]" />
    </div>
  )
}
