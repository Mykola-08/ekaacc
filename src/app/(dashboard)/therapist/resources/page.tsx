import { getResources } from '@/server/resources/service';
import { HugeiconsIcon } from '@hugeicons/react';
import { BookOpen02Icon } from '@hugeicons/core-free-icons';
import { ResourceGrid } from './resource-grid';

export default async function TherapistResourcesPage() {
  const resources = await getResources();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      {/* Page header */}
      <div className="px-4 lg:px-6">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <HugeiconsIcon icon={BookOpen02Icon} className="size-5 text-muted-foreground" />
          Resources
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Therapeutic tools, protocols, and materials for your practice.
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="mx-4 flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center lg:mx-6">
          <div className="rounded-xl bg-muted p-4">
            <HugeiconsIcon icon={BookOpen02Icon} className="size-8 text-muted-foreground/40" />
          </div>
          <div>
            <p className="font-semibold text-foreground">No resources yet</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Resources will appear here once they are added to the platform.
            </p>
          </div>
        </div>
      ) : (
        <ResourceGrid resources={resources} />
      )}
    </div>
  );
}
