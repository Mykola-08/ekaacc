import { Skeleton } from "@ekaacc/shared-ui"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

export default function Loading() {
 return (
  <div className="space-y-6">
   <div className="space-y-2">
     <Skeleton className="h-10 w-64" />
     <Skeleton className="h-4 w-96" />
   </div>

   <Card className="border-border-subtle">
     <CardHeader>
       <Skeleton className="h-6 w-48 mb-2" />
       <Skeleton className="h-4 w-72" />
     </CardHeader>
     <CardContent>
       <div className="space-y-4">
         {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
         ))}
       </div>
     </CardContent>
   </Card>
  </div>
 )
}
