export default function AIInsightsLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-6 w-36 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
        <div className="bg-muted mt-1 h-4 w-60 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
      </div>
      <div className="grid grid-cols-2 gap-3 px-4 lg:grid-cols-4 lg:px-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted h-28 animate-pulse rounded-[var(--radius)]" />
        ))}
      </div>
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-48 animate-pulse rounded-[var(--radius)]" />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <div className="bg-muted h-64 animate-pulse rounded-[var(--radius)]" />
        <div className="bg-muted h-64 animate-pulse rounded-[var(--radius)]" />
      </div>
    </div>
  );
}
