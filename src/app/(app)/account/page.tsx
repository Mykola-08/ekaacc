'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { allUsers } from '@/lib/data';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useUser, useFirestore, useDoc, doc, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { useUserContext } from '@/context/user-context';
import type { User } from '@/lib/types';


const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
});

type DashboardWidgets = {
    goalProgress: boolean;
    quickActions: boolean;
    nextSession: boolean;
    recentActivity: boolean;
}

export default function AccountPage() {
  const { user } = useUser();
  const { currentUser } = useUserContext();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  // We use the context for the most up-to-date data, but useDoc is fine for listening to direct changes
  const { data: currentUserData } = useDoc<User>(userRef);

  const [widgetConfig, setWidgetConfig] = useState<DashboardWidgets>({
      goalProgress: true,
      quickActions: true,
      nextSession: true,
      recentActivity: true
  });

  useEffect(() => {
    if (currentUser?.dashboardWidgets) {
        setWidgetConfig(currentUser.dashboardWidgets);
    }
  }, [currentUser]);


  const handleWidgetToggle = (widget: keyof DashboardWidgets) => {
      if (!userRef) return;
      const newConfig = {...widgetConfig, [widget]: !widgetConfig[widget]};
      setWidgetConfig(newConfig);
      updateDocumentNonBlocking(userRef, {
          dashboardWidgets: newConfig
      });
      toast({
          title: "Dashboard Updated",
          description: "Your preferences have been saved.",
      });
  };

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        name: currentUser.name || '',
        email: currentUser.email || '',
      });
    }
  }, [currentUser, form]);

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (userRef) {
        updateDocumentNonBlocking(userRef, { name: values.name });
    }
    toast({
        title: "Profile Updated",
        description: "Your changes have been saved.",
    });
  };
  
  if (!currentUser) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Please log in</h1>
        <p className="text-muted-foreground mt-2">You need to be logged in to view your account details.</p>
        <Button asChild className="mt-4">
            <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  const linkedAccounts = allUsers.filter(u => u.id !== currentUser.id).slice(0,2);


  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>This is how others will see you on the site.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 grid gap-4">
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
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Avatar className="w-24 h-24 text-4xl">
                                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                                <AvatarFallback>{currentUser.initials}</AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm">Change Avatar</Button>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Dashboard Preferences</CardTitle>
                        <CardDescription>Customize which widgets are visible on your home dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                           <FormLabel htmlFor="goal-progress">Goal Roadmap</FormLabel>
                           <Switch id="goal-progress" checked={widgetConfig.goalProgress} onCheckedChange={() => handleWidgetToggle('goalProgress')} />
                        </div>
                         <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                           <FormLabel htmlFor="quick-actions">Quick Actions</FormLabel>
                           <Switch id="quick-actions" checked={widgetConfig.quickActions} onCheckedChange={() => handleWidgetToggle('quickActions')} />
                        </div>
                         <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                           <FormLabel htmlFor="next-session">Next Session</FormLabel>
                           <Switch id="next-session" checked={widgetConfig.nextSession} onCheckedChange={() => handleWidgetToggle('nextSession')} />
                        </div>
                         <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                           <FormLabel htmlFor="recent-activity">Recent Activity</FormLabel>
                           <Switch id="recent-activity" checked={widgetConfig.recentActivity} onCheckedChange={() => handleWidgetToggle('recentActivity')} />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Linked Accounts</CardTitle>
                        <CardDescription>Manage parent/child or caregiver profiles connected to your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <div className="border rounded-lg">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px]">User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className='text-right'>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {linkedAccounts.map(account => (
                                    <TableRow key={account.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={account.avatarUrl} alt={account.name} />
                                                    <AvatarFallback>{account.initials}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium whitespace-nowrap">{account.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className='text-muted-foreground'>{account.role}</span>
                                        </TableCell>
                                        <TableCell className='text-right'>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                    <DropdownMenuItem>Remove Link</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </div>
                         <Button variant="outline" className="mt-4 w-full sm:w-auto">Add Linked Account</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Manage your billing information and subscription plan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted rounded-lg">
                            <div>
                                <p className="font-semibold">EKA {currentUser.role} Plan</p>
                                <p className="text-sm text-muted-foreground">Billed monthly. Next payment on Sep 1, 2024.</p>
                            </div>
                             <Button variant="outline" asChild className='w-full sm:w-auto'>
                                <Link href="/account/vip">Manage Plan</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Data Export</CardTitle>
                        <CardDescription>Download all your data as a PDF or CSV file.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4">
                       <Button variant="secondary" className='w-full sm:w-auto'>Export as PDF</Button>
                       <Button variant="secondary" className='w-full sm:w-auto'>Export as CSV</Button>
                    </CardContent>
                </Card>

                <div className='flex justify-end'>
                    <Button type="submit" className='w-full sm:w-auto'>Update Profile</Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
