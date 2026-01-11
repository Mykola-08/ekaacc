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
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/admin/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-black mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Services
      </Link>
      <h1 className="text-3xl font-bold mb-8">Edit Service: {service.name}</h1>
      <div className="bg-white p-8 rounded-lg border shadow-sm">
        <ServiceForm initialData={service} serviceId={service.id} />
      </div>
    </div>
  );
}
