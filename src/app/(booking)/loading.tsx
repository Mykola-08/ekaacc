import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function BookingLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-8 px-4">
        {/* Progress Bar Skeleton */}
        <div className="mb-4 flex w-full items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="rouned-full h-2 w-full" />
      </div>

      <Card className="relative overflow-hidden rounded-[36px] border-2">
        <CardHeader className="space-y-2 p-6 md:p-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </CardHeader>
        <CardContent className="p-6 pt-0 md:p-8 md:pt-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Skeleton className="h-32 w-full rounded-[var(--radius)]" />
            <Skeleton className="h-32 w-full rounded-[var(--radius)]" />
            <Skeleton className="h-32 w-full rounded-[var(--radius)]" />
            <Skeleton className="h-32 w-full rounded-[var(--radius)]" />
          </div>
          <div className="mt-8 flex items-center justify-between">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
