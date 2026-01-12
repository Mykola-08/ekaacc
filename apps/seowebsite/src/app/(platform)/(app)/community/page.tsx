import { Card, CardHeader, CardTitle, CardContent } from "@/components/platform/ui/card"
import { Button } from "@/components/platform/ui/button"
import { Calendar, MessageSquare } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-slide-up">
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-bold tracking-tight">Community</h1>
         <p className="text-muted-foreground">Connect with others on the same journey.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
             <div className="border-l-2 border-primary/20 pl-4 py-1">
                <p className="font-medium">Group Meditation</p>
                <p className="text-sm text-muted-foreground">Tomorrow, 10:00 AM</p>
             </div>
             <div className="border-l-2 border-primary/20 pl-4 py-1">
                <p className="font-medium">Wellness Workshop</p>
                <p className="text-sm text-muted-foreground">Nov 12, 14:00 PM</p>
             </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">Forum</CardTitle>
            <MessageSquare className="h-5 w-5 text-primary" />
          </CardHeader>
           <CardContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">Join the discussion on our dedicated forum.</p>
              <Button className="w-full">Access Forum</Button>
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
