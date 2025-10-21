'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import fxService from '@/lib/fx-service';
import { Input } from '@/components/ui/input';

export default function TherapistTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const list = await fxService.listTemplates();
      setTemplates(list || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const create = async () => {
    try {
      await fxService.createTemplate({ title, content });
      setTitle(''); setContent('');
      await load();
    } catch (e) { console.error(e); }
  };

  const remove = async (id: string) => {
    try {
      await fxService.deleteTemplate(id);
      await load();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Templates</h1>
      </div>

      <Card>
        <div className="p-4 space-y-3">
          <div className="flex gap-2">
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
            <Button onClick={create}>Create</Button>
          </div>

          <div>
            {loading && <p>Loading...</p>}
            {!loading && templates.map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 border rounded mb-2">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-muted-foreground">{t.content}</div>
                </div>
                <div>
                  <Button variant="ghost" onClick={() => remove(t.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
