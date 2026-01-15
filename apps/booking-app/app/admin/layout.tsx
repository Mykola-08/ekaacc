import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default async function AdminLayout({ children }: { children: ReactNode }) {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) {
  redirect("/login");
 }

 return (
  <div className="flex h-screen bg-background p-4 gap-4 overflow-hidden">
   {/* Desktop Sidebar - hidden on mobile via CSS in component */}
   <AdminSidebar />
   
   <div className="flex-1 flex flex-col min-w-0 bg-card rounded-[36px] border border-border shadow-sm overflow-hidden relative">
     <AdminHeader />
     <main className="flex-1 overflow-auto p-6 md:p-8">
      {children}
     </main>
   </div>
  </div>
 );
}
