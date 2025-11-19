'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// This would typically fetch from your API
const GROUPS = [
  { id: 'all-users', name: 'All Users' }, // You'd need to handle this ID specifically in backend
  { id: 'newsletter', name: 'Newsletter' },
  { id: 'beta', name: 'Beta Testers' },
];

export function BroadcastForm() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!subject || !content || !groupId) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, groupId }),
      });

      if (!res.ok) throw new Error('Failed to send');

      const data = await res.json();
      toast.success(`Broadcast sent to ${data.count} users`);
      setSubject('');
      setContent('');
    } catch (error) {
      toast.error('Failed to send broadcast');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send Email Broadcast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Group</label>
          <Select onValueChange={setGroupId} value={groupId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a group" />
            </SelectTrigger>
            <SelectContent>
              {GROUPS.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subject</label>
          <Input
            placeholder="Email Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content (Markdown supported)</label>
          <Textarea
            placeholder="Write your message here... Use **bold** or *italics*."
            className="min-h-[200px]"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <Button onClick={handleSend} disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send Broadcast'}
        </Button>
      </CardContent>
    </Card>
  );
}
