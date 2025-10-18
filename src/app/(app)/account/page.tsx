'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser, useFirestore, useDoc, doc, setDocumentNonBlocking } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
});

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || '',
        email: userProfile.email || '',
      });
    }
  }, [userProfile, form]);

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (!userDocRef) return;
    
    setDocumentNonBlocking(userDocRef, {
        name: values.name,
    }, { merge: true });

    toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
    });
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-8 w-1/2" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
             <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!user || !userProfile) {
    return (
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-2xl font-semibold">Please log in</h1>
        <p className="text-muted-foreground mt-2">You need to be logged in to view your account details.</p>
        <Button asChild className="mt-4">
            <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold">Account Settings</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>This is how others will see you on the site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} />
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
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} readOnly disabled />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Manage your billing information and subscription plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                            <div>
                                <p className="font-semibold">EKA {userProfile.role || 'User'} Plan</p>
                                <p className="text-sm text-muted-foreground">Billed monthly. Next payment on Sep 1, 2024.</p>
                            </div>
                             <Button variant="outline" asChild>
                                <Link href="/account/vip">Manage Plan</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <Button type="submit">Update Profile</Button>
            </form>
        </Form>
    </div>
  );
}
