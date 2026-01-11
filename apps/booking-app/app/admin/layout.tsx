import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Bell, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login"); // Fixed redirect path
  }

  // Permission check logic...

  return (
    <div className="flex min-h-screen bg-neutral-50/50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-background flex items-center justify-between px-8 sticky top-0 z-10">
              <h1 className="font-semibold text-lg">Dashboard</h1>
              <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                      <Sun className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                  </Button>
              </div>
          </header>
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
      </div>
    </div>
  );
}
