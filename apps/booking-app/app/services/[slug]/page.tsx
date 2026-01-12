import { fetchService } from "@/server/booking/service";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock, Euro, Pencil } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const { data: service, error } = await fetchService(slug);

 if (error || !service) {
  notFound();
 }

 // Check permissions
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

 // Placeholder image if image_url is missing
 const heroImage = service.image_url || "/placeholder-service.jpg";

 return (
  <div className="min-h-screen bg-background relative">
   {canEdit && (
    <div className="fixed top-24 right-4 z-50">
      <Button asChild className="shadow-xl bg-black hover:bg-gray-800 text-white gap-2">
        <Link href={`/admin/services/${service.id}`}>
         <Pencil className="w-4 h-4" />
         Edit Service
        </Link>
      </Button>
    </div>
   )}
   {/* Hero Section */}
   <div className="relative h-[60vh] w-full overflow-hidden">
    {/* In production, ensure placeholder-service.jpg exists or use a remote placeholder */}
    <div className="absolute inset-0 bg-slate-900/40 z-10" />
     {service.image_url ? (
      <Image 
        src={service.image_url} 
        alt={service.name} 
        fill 
        className="object-cover"
        priority
      />
     ) : (
      <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
        (Image Placeholder for {service.name})
      </div>
     )}
    
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-4">
     <h1 className="text-5xl md:text-7xl font-serif mb-6">{service.name}</h1>
     <div className="flex items-center gap-6 text-lg md:text-xl font-medium backdrop-blur-sm bg-white/10 px-6 py-2 rounded-full">
       <div className="flex items-center gap-2">
        <Clock className="w-5 h-5" />
        {service.duration} mins
       </div>
       <div className="h-4 w-px bg-white/40" />
       <div className="flex items-center gap-2">
        from €{service.price}
       </div>
     </div>
    </div>
   </div>

   <div className="container mx-auto px-4 py-16 -mt-20 relative z-30">
    <div className="bg-card shadow-xl rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border">
      <Link href="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to all treatments
      </Link>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <p className="whitespace-pre-wrap leading-relaxed">{service.description}</p>
      </div>

      <h3 className="text-2xl font-serif mb-6">Choose an Option</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {service.variants?.map((variant: any) => (
          <div key={variant.id} className="border-none rounded-[32px] p-6 hover:border-primary transition-colors flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-lg">{variant.name}</h4>
                <p className="text-sm text-muted-foreground">{variant.duration} minutes</p>
              </div>
              <div className="text-xl font-medium">
                €{variant.price}
              </div>
            </div>
            {variant.description && (
              <p className="text-sm text-muted-foreground mb-6 flex-1">{variant.description}</p>
            )}
            <Button asChild className="w-full">
              <Link href={`/book/${service.slug}?variant=${variant.id}`}>Book This Option</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
   </div>
  </div>
 );
}
