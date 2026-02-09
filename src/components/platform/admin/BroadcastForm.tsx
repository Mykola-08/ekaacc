'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [topic, setTopic] = useState('general');
  const [templateData, setTemplateData] = useState<any>({});
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
        body: JSON.stringify({
          subject,
          content,
          groupId,
          topic,
          templateData,
        }),
      });

      if (!res.ok) throw new Error('Failed to send');

      const data = await res.json();
      toast.success(`Broadcast sent to ${data.count} users`);
      setSubject('');
      setContent('');
      setTemplateData({});
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
        <CardTitle>Send Broadcast</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Target Group</label>
          <Select onValueChange={setGroupId} value={groupId}>
            <SelectTrigger>
              <SelectValue placeholder="Select audience" />
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
          <label className="text-sm font-medium">Topic / Template</label>
          <Select onValueChange={setTopic} value={topic}>
            <SelectTrigger>
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Update</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="product_launch">Product Launch</SelectItem>
              <SelectItem value="promotional">Promotional Offer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Subject Line</label>
          <Input
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {topic === 'product_launch' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <Input
              placeholder="e.g. Super Feature 2.0"
              value={templateData.productName || ''}
              onChange={(e) => setTemplateData({ ...templateData, productName: e.target.value })}
            />
          </div>
        )}

        {topic === 'promotional' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Promo Code (Optional)</label>
            <Input
              placeholder="e.g. SAVE20"
              value={templateData.promoCode || ''}
              onChange={(e) => setTemplateData({ ...templateData, promoCode: e.target.value })}
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Content / Description</label>
          <Textarea
            placeholder="Email body content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
        </div>

        <Button onClick={handleSend} disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send Broadcast'}
        </Button>
      </CardContent>
    </Card>
  );
}
