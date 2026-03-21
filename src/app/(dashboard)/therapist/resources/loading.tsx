export default function TherapistResourcesLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="bg-muted h-6 w-28 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
        <div className="bg-muted mt-1 h-4 w-64 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-muted h-52 animate-pulse rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  );
}
