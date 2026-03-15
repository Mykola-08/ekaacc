import { createClient } from '@/lib/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default async function PatientManagerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Get current therapist profile
  const { data: therapist } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();
  if (!therapist) return <div>Access Denied</div>;

  // 2. Fetch Patients (unique clients from bookings)
  // Note: In a real app, use a dedicated 'relationships' table. Here we derive from bookings.
  const { data: bookings } = await supabase
    .from('bookings')
    .select('client_id, profiles:client_id(id, full_name, email, phone, created_at)')
    .eq('therapist_id', therapist.id);

  // Deduplicate
  const uniquePatients = Array.from(
    new Map(bookings?.map((b) => [b.client_id, b.profiles])).values()
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="flex items-center justify-between px-4 lg:px-6">
        <p className="text-sm text-muted-foreground">Manage your active caseload.</p>
        <Button size="sm">Add New Patient</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {uniquePatients.map((patient: any) => (
          <Link key={patient.id} href={`/therapist/patients/${patient.id}`} className="group">
            <Card className="transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12 border">
                      <AvatarFallback>{patient.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {patient.full_name}
                      </h3>
                      <p className="text-muted-foreground text-xs">{patient.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Active
                  </Badge>
                </div>
                <div className="mt-6 flex gap-2">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Journal
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Assign Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {uniquePatients.length === 0 && (
          <div className="text-muted-foreground col-span-full rounded-lg border-2 border-dashed py-12 text-center text-sm">
            No patients found associated with your account.
          </div>
        )}
      </div>
    </div>
  );
}
