import { Skeleton } from '@/components/ui/skeleton';

export default function FinancesLoading() {
  return (
    <div className="flex flex-col gap-5 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-9 w-32 rounded-[calc(var(--radius)*0.8)]" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-border/60 rounded-[var(--radius)] border p-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-8 w-24" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="border-border/60 rounded-[var(--radius)] border p-4">
          <Skeleton className="mb-4 h-5 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-[calc(var(--radius)*0.8)] border p-3"
              >
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </div>
        <div className="border-border/60 rounded-[var(--radius)] border p-4">
          <Skeleton className="mb-4 h-5 w-28" />
          <Skeleton className="h-48 w-full rounded-[calc(var(--radius)*0.8)]" />
        </div>
      </div>
    </div>
  );
}
