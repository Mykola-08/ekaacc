'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, User, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/morphing-toaster';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface FamilyMember {
  id: string;
  full_name: string;
  relationship: string;
}

const familySchema = z.object({
  fullName: z.string().min(2),
  relationship: z.enum(['child', 'partner', 'parent', 'other']),
  email: z.string().email().optional().or(z.literal('')),
});

export function FamilyManager() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof familySchema>>({
    resolver: zodResolver(familySchema),
    defaultValues: {
      fullName: '',
      relationship: 'child',
      email: '',
    },
  });

  const onSubmit = (values: z.infer<typeof familySchema>) => {
    // Simulate API
    const newMember = {
      id: Math.random().toString(),
      full_name: values.fullName,
      relationship: values.relationship,
    };

    setMembers([...members, newMember]);
    setIsOpen(false);
    form.reset();
    toast.success('Family member added');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Family & Dependents</CardTitle>
            <CardDescription>Manage profiles you can book for.</CardDescription>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
                <DialogDescription>Create a profile for someone else.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <FormControl>
                          <select
                            className="border-input bg-background ring-offset-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                            {...field}
                          >
                            <option value="child">Child</option>
                            <option value="partner">Partner</option>
                            <option value="parent">Parent</option>
                            <option value="other">Other</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="jane@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save Profile</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-muted-foreground text-sm italic">No family members linked yet.</div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-muted/30 flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{member.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.full_name}</p>
                    <p className="text-muted-foreground text-xs capitalize">
                      {member.relationship}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
