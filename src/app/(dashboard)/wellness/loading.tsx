import { Skeleton } from '@/components/ui/skeleton';

export default function WellnessLoading() {
  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-9 w-28 rounded-[calc(var(--radius)*0.8)]" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border/60 rounded-[var(--radius)] border p-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-7 w-12" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border/60 rounded-[var(--radius)] border p-4">
            <Skeleton className="mb-3 h-4 w-32" />
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 3 }).map((_, j) => (
                <Skeleton key={j} className="h-10 w-full rounded-[calc(var(--radius)*0.8)]" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
