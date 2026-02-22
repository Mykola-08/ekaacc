import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

export default async function AssignmentManagerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch assignments created by this therapist
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*, profiles:user_id(full_name)')
    .eq('assigned_by', user?.id) // Assuming therapist profile linked or auth_id used directly
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assignments & Homework</h1>
          <p className="text-muted-foreground">Track patient progress on assigned tasks.</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Create Assignment</Button>
      </div>

      <div className="grid gap-4">
        {assignments?.map((a: any) => (
          <Card key={a.id} className="group hover:border-primary/50 transition-colors">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm text-muted-foreground">
                  Assigned to <span className="font-medium text-foreground">{a.profiles?.full_name}</span> • Due {new Date(a.due_date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={a.status === 'completed' ? 'default' : 'secondary'} className="capitalize">
                  {a.status}
                </Badge>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {(!assignments || assignments.length === 0) && (
          <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
            No active assignments. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
