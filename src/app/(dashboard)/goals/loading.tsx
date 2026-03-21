export default function GoalsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="space-y-1.5">
          <div className="h-6 w-40 animate-pulse rounded-[calc(var(--radius)*0.8)] bg-muted" />
          <div className="h-4 w-56 animate-pulse rounded-[calc(var(--radius)*0.8)] bg-muted" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="grid gap-4 px-4 lg:px-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-[var(--radius)] bg-muted" />
        ))}
      </div>
    </div>
  );
}
