export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-6 w-28 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
        <div className="bg-muted mt-1 h-4 w-64 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
      </div>
      <div className="px-4 lg:px-6">
        <div className="bg-muted mb-6 h-10 w-80 animate-pulse rounded-[var(--radius)]" />
        <div className="space-y-4">
          <div className="bg-muted h-32 animate-pulse rounded-[var(--radius)]" />
          <div className="bg-muted h-72 animate-pulse rounded-[var(--radius)]" />
        </div>
      </div>
    </div>
  );
}
