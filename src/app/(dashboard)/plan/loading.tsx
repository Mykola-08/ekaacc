import { Skeleton } from '@/components/ui/skeleton';

export default function PlanLoading() {
  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <Skeleton className="h-7 w-40" />
      <div className="rounded-[var(--radius)] border border-border/60 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[calc(var(--radius)*0.8)] border border-border/60 p-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-1.5 h-6 w-12" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius)] border border-border/60 p-4">
            <Skeleton className="mb-2 h-4 w-36" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-1 h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
