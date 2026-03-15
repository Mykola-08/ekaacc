import { getClinicalProtocols } from '@/server/resources/service';
import ActiveSessionClient from './ActiveSessionClient';

export default async function ActiveSessionPage({ params }: { params: { bookingId: string } }) {
  // Fetch protocols server-side so we bypass RLS issues cleanly here
  // Fallbacks will kick in if DB is empty
  const protocols = await getClinicalProtocols();

  return <ActiveSessionClient bookingId={params.bookingId} protocols={protocols} />;
}
