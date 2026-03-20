export default function WalletLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="space-y-1.5">
          <div className="h-6 w-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-52 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="px-4 lg:px-6">
        <div className="h-36 animate-pulse rounded-xl bg-muted" />
      </div>
      <div className="px-4 lg:px-6">
        <div className="h-64 animate-pulse rounded-xl bg-muted" />
      </div>
    </div>
  );
}
