import { fetchService } from "@/server/booking/service";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ServiceMarketingPage } from "@/components/booking/ServiceMarketingPage";
import { Service } from "@/types/database";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const { data: service, error } = await fetchService(slug);

 if (error || !service) {
  notFound();
 }

 const supabase = await createClient();
 const { data: { user } } = await supabase.auth.getUser();
 
 let canEdit = false;
 if (user) {
  const { data: hasPerm } = await supabase.rpc('has_permission', { 
    check_user_id: user.id, 
    check_perm_key: 'manage_services' 
  });
  const isAdmin = user.user_metadata?.role === 'Admin';
  canEdit = !!hasPerm || isAdmin;
 }

 return <ServiceMarketingPage service={service as Service} canEdit={canEdit} />;
}
