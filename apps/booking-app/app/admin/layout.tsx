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
  <div className="flex min-h-screen bg-neutral-50/50">
   {/* Desktop Sidebar - hidden on mobile via CSS in component */}
   <AdminSidebar />
   
   <div className="flex-1 flex flex-col min-w-0">
     <AdminHeader />
     <main className="flex-1 p-4 md:p-8 overflow-auto">
      {children}
     </main>
   </div>
  </div>
 );
}
