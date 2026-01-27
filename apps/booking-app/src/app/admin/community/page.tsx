import { MessageSquare } from "lucide-react";

export default function AdminCommunityPage() {
  return (
   <div className="w-full bg-background min-h-screen p-6 md:p-12">
     <div className="max-w-4xl mx-auto space-y-8">
       <div>
         <h1 className="text-3xl font-serif text-foreground">Community Management</h1>
         <p className="text-muted-foreground mt-1">Moderate forums and user content.</p>
       </div>
       
       <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-4xl border border-border/60 shadow-xl border-dashed">
         <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-muted-foreground/50" />
         </div>
         <h3 className="text-xl font-bold text-foreground mb-2">Coming Soon</h3>
         <p className="text-muted-foreground max-w-sm">The community module is currently under development.</p>
       </div>
     </div>
   </div>
  );
 }
