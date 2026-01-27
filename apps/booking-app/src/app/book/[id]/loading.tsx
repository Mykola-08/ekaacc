import { Skeleton } from "@ekaacc/shared-ui"

export default function Loading() {
 return (
  <div className="min-h-screen bg-background-dark text-slate-200 font-display">
   <div className="layout-container flex flex-col max-w-5xl mx-auto px-6 py-12">
    <Skeleton className="h-6 w-32 mb-8 bg-surface-highlight" />

    {/* Header Section */}
    <div className="mb-8 space-y-4">
      <Skeleton className="h-12 w-3/4 max-w-lg bg-surface-highlight" />
      <div className="flex items-center gap-3">
       <Skeleton className="h-6 w-24 bg-surface-highlight" />
       <Skeleton className="h-6 w-20 bg-surface-highlight" />
      </div>
    </div>

    <div className="bg-surface border-none border-border-subtle rounded-[32px] p-6 md:p-10 shadow-2xl">
     <div className="flex flex-col lg:flex-row gap-12">
      
      {/* Main Content Column */}
      <div className="flex-1 space-y-8">
       {/* Image Gallery Skeleton */}
       <div className="aspect-video w-full rounded-xl overflow-hidden bg-surface-highlight border border-border-subtle relative">
         <Skeleton className="absolute inset-0 w-full h-full bg-surface-highlight/50" />
       </div>

       {/* Description Skeleton */}
       <div className="space-y-4">
        <Skeleton className="h-4 w-full bg-surface-highlight" />
        <Skeleton className="h-4 w-full bg-surface-highlight" />
        <Skeleton className="h-4 w-2/3 bg-surface-highlight" />
       </div>

        {/* Variants Skeleton */}
        <div className="space-y-4">
         <Skeleton className="h-8 w-48 bg-surface-highlight" />
         <Skeleton className="h-20 w-full rounded-xl bg-surface-highlight" />
         <Skeleton className="h-20 w-full rounded-xl bg-surface-highlight" />
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="w-full lg:w-96 shrink-0">
        <div className="bg-surface-highlight rounded-2xl p-6 border border-border-subtle">
         <Skeleton className="h-8 w-40 mb-6 bg-surface" />
         <div className="space-y-4 mb-8">
           <Skeleton className="h-6 w-full bg-surface" />
           <Skeleton className="h-6 w-full bg-surface" />
           <Skeleton className="h-6 w-full bg-surface" />
         </div>
         <Skeleton className="h-14 w-full rounded-xl bg-surface" />
        </div>
      </div>

     </div>
    </div>
   </div>
  </div>
 )
}
