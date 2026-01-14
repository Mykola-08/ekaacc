import { createClient } from "@/lib/supabase/server";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
 const { id } = await params;
 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();

 if (!user) redirect("/login");

 // Fetch service
 const { data: service, error } = await supabase
  .from('service')
  .select('*')
  .eq('id', id)
  .single();

 if (error || !service) {
  notFound();
 }

 return (
  <div className="w-full bg-[#FDFBF9] min-h-screen p-6 md:p-12">
   <div className="max-w-3xl mx-auto space-y-8">
    <Link href="/admin/services" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
     <ArrowLeft className="w-4 h-4 mr-2" />
     Back to Services
    </Link>
    
    <div>
        <h1 className="text-3xl font-serif text-slate-900">Edit Service</h1>
        <p className="text-slate-500 mt-1">Update service details and settings.</p>
    </div>

    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl">
     <ServiceForm initialData={service} serviceId={service.id} />
    </div>
   </div>
  </div>
 );
}
