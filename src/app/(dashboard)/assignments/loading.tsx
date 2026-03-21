export default function AssignmentsLoading() {
  return (
    <div className="flex flex-col gap-4 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="h-6 w-36 animate-pulse rounded-[calc(var(--radius)*0.8)] bg-muted" />
        <div className="mt-1 h-4 w-52 animate-pulse rounded-[calc(var(--radius)*0.8)] bg-muted" />
      </div>
      <div className="px-4 lg:px-6">
        <div className="mb-4 h-10 w-44 animate-pulse rounded-[var(--radius)] bg-muted" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-[var(--radius)] bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}
