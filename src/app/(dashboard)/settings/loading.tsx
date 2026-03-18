export default function SettingsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="h-6 w-28 animate-pulse rounded-lg bg-muted" />
        <div className="mt-1 h-4 w-64 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="px-4 lg:px-6">
        <div className="mb-6 h-10 w-80 animate-pulse rounded-xl bg-muted" />
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-2xl bg-muted" />
          <div className="h-72 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
