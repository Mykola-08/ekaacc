export default function BookingsLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="flex items-start justify-between px-4 lg:px-6">
        <div className="space-y-1.5">
          <div className="h-6 w-28 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-44 animate-pulse rounded-lg bg-muted" />
        </div>
        <div className="h-9 w-32 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid grid-cols-3 gap-3 px-4 lg:px-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="space-y-3 px-4 lg:px-6">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-muted" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
