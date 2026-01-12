import { Skeleton } from '@/components/platform/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/platform/ui/card';

/**
 * Loading skeleton for community routes
 */
export default function CommunityLoading() {
 return (
  <div className="container mx-auto p-6 space-y-6">
   <Skeleton className="h-10 w-64 mb-6" />

   <div className="grid gap-6 lg:grid-cols-3">
    <div className="lg:col-span-2 space-y-4">
     {[1, 2, 3].map((i) => (
      <Card key={i}>
       <CardHeader>
        <div className="flex items-center gap-3">
         <Skeleton className="h-10 w-10 rounded-full" />
         <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
         </div>
        </div>
       </CardHeader>
       <CardContent className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-3">
         <Skeleton className="h-8 w-20" />
         <Skeleton className="h-8 w-20" />
        </div>
       </CardContent>
      </Card>
     ))}
    </div>

    <div className="space-y-4">
     <Card>
      <CardHeader>
       <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="space-y-3">
       {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-center gap-2">
         <Skeleton className="h-8 w-8 rounded" />
         <Skeleton className="h-4 w-32" />
        </div>
       ))}
      </CardContent>
     </Card>
    </div>
   </div>
  </div>
 );
}
