export default function GoalsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="space-y-1.5">
          <div className="bg-muted h-6 w-40 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
          <div className="bg-muted h-4 w-56 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
        </div>
        <div className="bg-muted h-9 w-28 animate-pulse rounded-full" />
      </div>
      <div className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted h-40 animate-pulse rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  );
}
