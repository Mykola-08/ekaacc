export default function WalletLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="space-y-1.5">
          <div className="bg-muted h-6 w-20 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
          <div className="bg-muted h-4 w-52 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
        </div>
        <div className="bg-muted h-9 w-28 animate-pulse rounded-full" />
      </div>
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-36 animate-pulse rounded-[var(--radius)]" />
      </div>
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-64 animate-pulse rounded-[var(--radius)]" />
      </div>
    </div>
  );
}
