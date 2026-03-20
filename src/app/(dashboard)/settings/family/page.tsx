'use client';

import { useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { addFamilyLink, getFamilyLinks } from '@/app/actions/settings-actions';

type FamilyLink = {
  id: string;
  linked_email: string;
  relationship: string;
  status: string;
  created_at: string;
};

export default function FamilySettingsPage() {
  const [links, setLinks] = useState<FamilyLink[]>([]);
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('parent');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getFamilyLinks().then((res) => {
      if (!res.error) setLinks(res.data as FamilyLink[]);
    });
  }, []);

  const onAdd = () => {
    if (!email.trim()) return;
    startTransition(async () => {
      const result = await addFamilyLink({ linked_email: email.trim(), relationship });
      if (result.success) {
        const latest = await getFamilyLinks();
        if (!latest.error) setLinks(latest.data as FamilyLink[]);
        setEmail('');
      }
    });
  };

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <Card className="rounded-[var(--radius)]">
        <CardHeader>
          <CardTitle>Family Accounts</CardTitle>
          <CardDescription>
            Link guardians, dependents, or partner accounts for shared coordination.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label>Family member email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Relationship</Label>
              <Input value={relationship} onChange={(e) => setRelationship(e.target.value)} placeholder="parent / child / partner" />
            </div>
          </div>

          <div className="space-y-2">
            {links.length === 0 ? (
              <p className="text-sm text-muted-foreground">No linked accounts yet.</p>
            ) : (
              links.map((link) => (
                <div key={link.id} className="flex items-center justify-between rounded-[var(--radius)] border border-border/60 p-3">
                  <div>
                    <p className="text-sm font-medium">{link.linked_email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{link.relationship}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{link.status}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={onAdd} disabled={isPending} className="rounded-[calc(var(--radius)*0.8)]">
            {isPending ? 'Adding…' : 'Add family link'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
