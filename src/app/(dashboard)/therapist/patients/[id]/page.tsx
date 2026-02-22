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
  const { data: journals } = await supabase.from('journal_entries').select('*').eq('user_id', patient.auth_id).order('created_at', { ascending: false });
  const { data: assignments } = await supabase.from('assignments').select('*').eq('user_id', id).order('created_at', { ascending: false });

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-6 pb-6 border-b">
        <Avatar className="h-20 w-20">
          <AvatarFallback>{patient.full_name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{patient.full_name}</h1>
          <div className="flex gap-3 text-muted-foreground mt-1">
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
          <TabsTrigger value="history">Session History</TabsTrigger>
        </TabsList>

        <TabsContent value="journal" className="space-y-4 mt-4">
          {journals?.map((entry: any) => (
            <Card key={entry.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div className="font-semibold">{new Date(entry.created_at).toLocaleDateString()}</div>
                  <Badge variant={entry.mood >= 7 ? 'default' : 'secondary'}>Mood: {entry.mood}/10</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4 mt-4">
           {/* Assignment List */}
           <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg">
             <span>Quick Assign:</span>
             <div className="flex gap-2">
               <Button size="sm" variant="outline">Breathing Exercise</Button>
               <Button size="sm" variant="outline">Mood Log</Button>
             </div>
           </div>
           {assignments?.map((a: any) => (
             <div key={a.id} className="border p-4 rounded-lg flex justify-between items-center">
               <div>
                 <div className="font-medium">{a.title}</div>
                 <div className="text-xs text-muted-foreground">Due: {new Date(a.due_date).toLocaleDateString()}</div>
               </div>
               <Badge variant={a.status === 'completed' ? 'default' : 'outline'}>{a.status}</Badge>
             </div>
           ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
