export default function AIInsightsLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="h-6 w-36 animate-pulse rounded-lg bg-muted" />
        <div className="mt-1 h-4 w-60 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 lg:px-6 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="px-4 lg:px-6">
        <div className="h-48 animate-pulse rounded-2xl bg-muted" />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
