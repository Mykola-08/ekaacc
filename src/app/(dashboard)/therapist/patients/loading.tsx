export default function PatientsLoading() {
  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="space-y-1.5">
          <div className="bg-muted h-6 w-24 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
          <div className="bg-muted h-4 w-44 animate-pulse rounded-[calc(var(--radius)*0.8)]" />
        </div>
        <div className="bg-muted h-9 w-32 animate-pulse rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-3 px-4 lg:px-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-muted h-20 animate-pulse rounded-[var(--radius)]" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-muted h-44 animate-pulse rounded-[var(--radius)]" />
        ))}
      </div>
    </div>
  );
}
