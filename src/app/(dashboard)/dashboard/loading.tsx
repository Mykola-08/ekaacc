export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Welcome banner */}
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-6 w-48 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
        <div className="bg-muted mt-1 h-4 w-32 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
      </div>
      {/* Mood widget */}
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-20 animate-pulse rounded-[var(--radius)]" />
      </div>
      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <div className="bg-muted h-72 animate-pulse rounded-[var(--radius)] lg:col-span-2" />
        <div className="flex flex-col gap-4">
          <div className="bg-muted h-48 animate-pulse rounded-[var(--radius)]" />
          <div className="bg-muted h-28 animate-pulse rounded-[var(--radius)]" />
        </div>
      </div>
    </div>
  );
}
