import { Skeleton } from '@/components/ui/skeleton';

export default function MarketingLoading() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96" />
      <Skeleton className="h-80 w-full rounded-[var(--radius)]" />
    </div>
  );
}
