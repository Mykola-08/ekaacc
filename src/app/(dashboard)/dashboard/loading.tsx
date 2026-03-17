export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      {/* Welcome banner */}
      <div className="px-4 lg:px-6">
        <div className="h-6 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-1 h-4 w-32 animate-pulse rounded-lg bg-muted" />
      </div>
      {/* Mood widget */}
      <div className="px-4 lg:px-6">
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
      </div>
      {/* Main grid */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-3 lg:px-6">
        <div className="h-72 animate-pulse rounded-2xl bg-muted lg:col-span-2" />
        <div className="flex flex-col gap-4">
          <div className="h-48 animate-pulse rounded-2xl bg-muted" />
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
