import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle } from 'lucide-react';

export default async function UserAssignmentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <div>Please login</div>;

  // Assuming user_id in assignments links to profile.id which might differ from auth.uid()
  // In a real app, resolve profile first.
  // For this demo, assuming user_id matches or we query by auth user directly if table allows.
  // Let's first get profile id
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('user_id', profile?.id)
    .order('due_date', { ascending: true });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="">
        <h1 className="text-2xl font-bold tracking-tight">My Homework</h1>
        <p className="text-muted-foreground">Exercises and tasks assigned by your therapist.</p>
      </div>

      <div className="grid gap-4">
        {assignments?.map((a: any) => (
          <Card
            key={a.id}
            className={`transition-all ${a.status === 'completed' ? 'bg-muted/20 opacity-60' : 'border-l-primary border-l-4'}`}
          >
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div
                  className={`text-2xl ${a.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`}
                >
                  {a.status === 'completed' ? <CheckCircle2 /> : <Circle />}
                </div>
                <div>
                  <div className="line-through-if-completed text-lg font-semibold">{a.title}</div>
                  <div className="text-muted-foreground text-sm">{a.description}</div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    Due: {new Date(a.due_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {a.status !== 'completed' && <Button>Mark Complete</Button>}
            </CardContent>
          </Card>
        ))}

        {(!assignments || assignments.length === 0) && (
          <div className="text-muted-foreground py-12 text-center">
            No assignments due. Great job!
          </div>
        )}
      </div>
    </div>
  );
}
