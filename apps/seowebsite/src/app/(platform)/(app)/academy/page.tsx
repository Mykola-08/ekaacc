import { Card, CardHeader, CardTitle, CardContent } from "@/components/platform/ui/card"
import { Button } from "@/components/platform/ui/button"
import { BookOpen, Award, GraduationCap } from "lucide-react"

export default function AcademyPage() {
 return (
  <div className="space-y-6 max-w-6xl mx-auto animate-slide-up">
   <div className="flex flex-col gap-2">
     <h1 className="text-3xl font-bold tracking-tight">Academy</h1>
     <p className="text-muted-foreground">Access your courses and certificates.</p>
   </div>

   <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Placeholder for Course Catalog */}
    <Card className="hover:shadow-md transition-shadow group cursor-pointer border-0 shadow-sm bg-white/80 backdrop-blur-sm">
     <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">Course Catalog</CardTitle>
      <BookOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
     </CardHeader>
     <CardContent>
       <p className="text-sm text-muted-foreground">Browse and enroll in new courses.</p>
     </CardContent>
    </Card>

    {/* Placeholder for My Certificates */}
    <Card className="hover:shadow-md transition-shadow group cursor-pointer border-0 shadow-sm bg-white/80 backdrop-blur-sm">
     <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">My Certificates</CardTitle>
      <Award className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
     </CardHeader>
     <CardContent>
       <p className="text-sm text-muted-foreground">View your earned certifications.</p>
     </CardContent>
    </Card>

    {/* Placeholder for Learning Path */}
    <Card className="hover:shadow-md transition-shadow group cursor-pointer border-0 shadow-sm bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">Learning Path</CardTitle>
      <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
     </CardHeader>
      <CardContent>
       <p className="text-sm text-muted-foreground">Continue where you left off.</p>
      </CardContent>
    </Card>
   </div>
  </div>
 )
}
