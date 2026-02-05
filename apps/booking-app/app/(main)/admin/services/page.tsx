import { getAdminServices } from "@/server/admin/actions";
import { ServicesList } from "@/components/admin/services/ServicesList";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
    const services = await getAdminServices();

    return <ServicesList services={services} />;
}
