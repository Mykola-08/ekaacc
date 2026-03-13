import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default async function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: patient } = await supabase.from('profiles').select('*').eq('id', id).single();
  const { data: journals } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', patient.auth_id)
    .order('created_at', { ascending: false });
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="flex items-center gap-6 border-b pb-6">
        <Avatar className="h-20 w-20">
          <AvatarFallback>{patient.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{patient.full_name}</h1>
          <div className="text-muted-foreground mt-1 flex gap-3">
            <span>{patient.email}</span>
            <span>•</span>
            <span>{patient.phone}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">Message</Button>
          <Button>Book Session</Button>
        </div>
      </div>

      <Tabs defaultValue="journal">
        <TabsList>
          <TabsTrigger value="journal">Journal Entries</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="intake">Intake & Assessments</TabsTrigger>
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="mt-4">
          {journals?.map((entry: any) => (
            <Card key={entry.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="font-semibold">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </div>
                  <Badge variant={entry.mood >= 7 ? 'default' : 'secondary'}>
                    Mood: {entry.mood}/10
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          {/* Assignment List */}
          <div className="bg-muted/20 flex items-center justify-between rounded-lg p-4">
            <span>Quick Assign:</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                Breathing Exercise
              </Button>
              <Button size="sm" variant="outline">
                Mood Log
              </Button>
            </div>
          </div>
          {assignments?.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-muted-foreground text-xs">
                  Due: {new Date(a.due_date).toLocaleDateString()}
                </div>
              </div>
              <Badge variant={a.status === 'completed' ? 'default' : 'outline'}>{a.status}</Badge>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="intake" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pre-Session Intake & Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Initial Intake Questionnaire</h4>
                    <p className="text-muted-foreground text-sm">Completed: Oct 12, 2026</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    View Answers
                  </Button>
                </div>
                <div className="ring-primary/20 bg-primary/5 flex items-center justify-between rounded-lg border p-4 ring-1">
                  <div>
                    <h4 className="font-medium">PHQ-9 Depression Screener</h4>
                    <p className="text-muted-foreground text-sm">Status: Pending</p>
                  </div>
                  <Button size="sm">Send Reminder</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
