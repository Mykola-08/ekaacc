import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export default function Loading() {
  return (
    <div className="container max-w-4xl py-10 space-y-8">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        <Separator className="bg-border-subtle" />
        <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                     <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                     </div>
                     <div className="pt-2">
                        <Skeleton className="h-3 w-24" />
                     </div>
                </div>
            ))}
        </div>
    </div>
  )
}
