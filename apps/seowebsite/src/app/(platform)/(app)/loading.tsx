import { Skeleton } from "@ekaacc/shared-ui"

export default function Loading() {
 return (
  <div className="container mx-auto p-6 space-y-8">
   <div className="flex items-center justify-between">
    <div className="space-y-2">
     <Skeleton className="h-8 w-64" />
     <Skeleton className="h-4 w-75" />
    </div>
    <Skeleton className="h-10 w-10 rounded-full" />
   </div>
   
   <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <Skeleton className="h-50 rounded-xl" />
    <Skeleton className="h-50 rounded-xl" />
    <Skeleton className="h-50 rounded-xl" />
   </div>

   <div className="space-y-4">
    <Skeleton className="h-25 w-full rounded-xl" />
    <Skeleton className="h-25 w-full rounded-xl" />
   </div>
  </div>
 )
}
