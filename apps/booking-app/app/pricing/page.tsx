import { listServices } from "@/server/booking/service";
import { PricingPage } from "@/components/booking/PricingPage";

export const dynamic = 'force-dynamic';

export default async function Page() {
 const { data: services } = await listServices();

 return <PricingPage services={services || []} />;
}