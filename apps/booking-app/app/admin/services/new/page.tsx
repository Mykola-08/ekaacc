import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewServicePage() {
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) redirect("/login");

 return (
  <div className="p-8 max-w-4xl mx-auto">
   <Link href="/admin/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-black mb-6">
    <ArrowLeft className="w-4 h-4 mr-2" />
    Back to Services
   </Link>
   <h1 className="text-3xl font-bold mb-8">Create New Service</h1>
   <div className="bg-white p-8 rounded-[32px] border-none shadow-sm">
    <ServiceForm />
   </div>
  </div>
 );
}
