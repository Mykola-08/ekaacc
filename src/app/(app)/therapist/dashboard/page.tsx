'use client';

import { useState, useMemo, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Calendar, CheckCircle, Clock, Users, Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useData } from '@/context/unified-data-context';
import { mockBookings } from '@/lib/mock-bookings';
import { mockCurrentUser, mockTherapistUser } from '@/lib/mock-data';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import type { User, Service, Session as AppSession } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestTools } from '@/components/eka/test-tools';
import { USE_MOCK_DATA } from '@/services/data-service';
import { useIsAdmin } from '@/components/eka/role-guard';
import { ClientBilling } from '@/components/eka/client-billing';
import { ClientActivityTimeline } from '@/components/eka/client-activity-timeline';

const mapBookingToSession = (booking: any): AppSession => {
    const serviceName = booking.appointment_segments?.[0]?.service_variation_data?.name || 'Unknown Service';
    const therapistName = 'EKA Therapist'; // Placeholder

    return {
        id: booking.id,
        therapist: therapistName,
        therapistAvatarUrl: 'https://i.pravatar.cc/150?u=square', // Placeholder
        date: booking.start_at,
        time: new Date(booking.start_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: 0, // Not easily available in this context without more data
        status: 'Upcoming', // Assuming we only query for upcoming
        type: serviceName,
        userId: booking.customer_id
    };
};

const reportTags = ["on time", "late", "cooperative", "resistant", "new issue", "follow-up"];

const initialServiceFormState: Omit<Service, 'id'> = {
    name: '',
    category: 'Core',
    descriptionShort: '',
    descriptionLong: '',
    durationMinutes: 60,
    priceEUR: 0,
    benefits: [],
    tags: [],
    active: true,
};

export default function TherapistDashboardPage() {
    // Use mock therapist user and mock data
    const { currentUser } = useData();
    const isAdmin = useIsAdmin();
    const allUsers = [mockCurrentUser, mockTherapistUser];
    const isLoadingUsers = false;
    const services: Service[] = []; // Mock services - to be implemented
    const isLoadingServices = false;
    const upcomingBookings = mockBookings.filter(b => b.therapistId === (currentUser?.uid || 'therapist1') && b.status === 'confirmed');
    const isLoadingBookings = false;
    const upcomingSessions = upcomingBookings.map(b => ({
        id: b.id,
        therapist: 'EKA Therapist',
        therapistAvatarUrl: 'https://i.pravatar.cc/150?u=square',
        date: b.date,
        time: new Date(b.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: 60,
        status: b.status === 'confirmed' ? 'Upcoming' : b.status === 'cancelled' ? 'Canceled' : 'Completed',
        type: 'Therapy Session',
        userId: b.userId,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const [activeTab, setActiveTab] = useState<'appointments' | 'clients' | 'sessions' | 'billing' | 'settings' | 'test-tools'>('appointments');

    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
    const [isSessionNotesDialogOpen, setIsSessionNotesDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
    const [selectedSession, setSelectedSession] = useState<typeof upcomingSessions[0] | null>(null);
    const [sessionNotes, setSessionNotes] = useState('');
    const [clientTags, setClientTags] = useState<Record<string, string[]>>({});
    const [clientSearch, setClientSearch] = useState('');
    const [selectedTagFilter, setSelectedTagFilter] = useState<string>('all');
    
    const [serviceForm, setServiceForm] = useState<Partial<Service>>(initialServiceFormState);

    const [goalDescription, setGoalDescription] = useState('');
    const [targetSessions, setTargetSessions] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    
    const [reportState, setReportState] = useState({
        pain: 5,
        mood: 5,
        energy: 5,
        objective: '',
        issues: '',
        nextSteps: '',
        tags: [] as string[]
    });

    const { toast } = useToast();

    const handleOpenGoalDialog = (patient: User) => {
        setSelectedPatient(patient);
        setGoalDescription(patient.goal?.description || '');
        setTargetSessions(patient.goal?.targetSessions?.toString() || '');
        setIsGoalDialogOpen(true);
    };
    
    const handleOpenReportDialog = (patient: User) => {
        setSelectedPatient(patient);
        setIsReportDialogOpen(true);
    };

    const handleOpenServiceDialog = (service: Service | null) => {
        if (service) {
            setServiceForm(service);
        } else {
            setServiceForm(initialServiceFormState);
        }
        setIsServiceDialogOpen(true);
    }
    
    const handleServiceFormChange = (field: keyof Service, value: any) => {
        setServiceForm((prev: Partial<Service>) => ({ ...prev, [field]: value }));
    };
    
    const handleSaveService = () => {
        if (!serviceForm.name || !serviceForm.durationMinutes || serviceForm.priceEUR === undefined) {
             toast({ variant: 'destructive', title: "Please fill all required fields." });
            return;
        }

        const dataToSave = {
            ...serviceForm,
            // Ensure benefits and tags are arrays of strings
            benefits: Array.isArray(serviceForm.benefits) ? serviceForm.benefits : [],
            tags: Array.isArray(serviceForm.tags) ? serviceForm.tags : [],
        };
        
        if (serviceForm.id) {
            // Editing existing service
            toast({ title: "Service Updated", description: `${serviceForm.name} has been updated.` });
            console.log('Update service:', dataToSave);
        } else {
            // Adding new service
            toast({ title: "Service Added", description: `${serviceForm.name} has been added to the catalog.` });
            console.log('Add service:', dataToSave);
        }
        setIsServiceDialogOpen(false);
    };


    const handleSetGoal = () => {
        if (!selectedPatient || !goalDescription || !targetSessions) {
            toast({
                variant: 'destructive',
                title: "Incomplete Form",
                description: "Please fill out all fields to set a goal.",
            });
            return;
        }

        // Update patient goal using unified data service
        console.log('Set goal for patient:', {
            patientId: selectedPatient.id,
            goal: {
                description: goalDescription,
                targetSessions: parseInt(targetSessions, 10),
            }
        });

        toast({
            title: "Goal Set Successfully!",
            description: `A goal of ${targetSessions} sessions has been set for ${selectedPatient.name}.`,
        });

        setIsGoalDialogOpen(false);
        setGoalDescription('');
        setTargetSessions('');
        setSelectedPatient(null);
    };

    const handleGenerateReport = async () => {
        if (!selectedPatient) return;
        setIsGeneratingReport(true);
        toast({ title: 'Generating AI Report...', description: 'Please wait a moment.' });
        try {
            const { autoGenerateReport } = await import('@/ai/flows/auto-generate-report');
            const input = {
                sessionTags: reportState.tags.join(', '),
                painRating: reportState.pain,
                moodRating: reportState.mood,
                energyRating: reportState.energy,
                objectiveNotes: reportState.objective,
                issuesNotes: reportState.issues,
                nextStepsNotes: reportState.nextSteps
            };
            const result = await autoGenerateReport(input);

            // Save report using unified data service
            console.log('Generated report for patient:', {
                patientId: selectedPatient.id,
                report: result.report,
                date: new Date().toISOString(),
                type: 'Therapist Report',
            });

            toast({ title: 'Report Generated & Saved', description: `A new session report for ${selectedPatient.name} has been created.` });
            setIsReportDialogOpen(false);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Report Generation Failed', description: 'There was an error communicating with the AI.' });
        } finally {
            setIsGeneratingReport(false);
        }
    };
    
    const handleReportTagClick = (tag: string) => {
        setReportState(prev => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
        }));
    };
    
    const handleOpenSessionNotes = (session: typeof upcomingSessions[0]) => {
        setSelectedSession(session);
        setSessionNotes(''); // Notes would be loaded from database in real implementation
        setIsSessionNotesDialogOpen(true);
    };

    const handleSaveSessionNotes = () => {
        if (!selectedSession) return;
        // In real implementation, this would update the session in the database
        console.log('Saving session notes:', {
            sessionId: selectedSession.id,
            notes: sessionNotes,
        });
        toast({ title: 'Session Notes Saved', description: 'Notes have been saved successfully.' });
        setIsSessionNotesDialogOpen(false);
    };

    const handleAddClientTag = (clientId: string, tag: string) => {
        setClientTags(prev => ({
            ...prev,
            [clientId]: [...(prev[clientId] || []), tag]
        }));
        toast({ title: 'Tag Added', description: `Tag "${tag}" added to client.` });
    };

    const handleRemoveClientTag = (clientId: string, tag: string) => {
        setClientTags(prev => ({
            ...prev,
            [clientId]: (prev[clientId] || []).filter(t => t !== tag)
        }));
        toast({ title: 'Tag Removed', description: `Tag "${tag}" removed from client.` });
    };
    
    const patients = useMemo(() => allUsers?.filter(u => u.role !== 'Therapist'), [allUsers]);

    const filteredPatients = useMemo(() => {
        let filtered = patients || [];
        
        // Filter by search
        if (clientSearch) {
            filtered = filtered.filter(p => 
                p.name?.toLowerCase().includes(clientSearch.toLowerCase()) ||
                p.email?.toLowerCase().includes(clientSearch.toLowerCase())
            );
        }
        
        // Filter by tag
        if (selectedTagFilter !== 'all') {
            filtered = filtered.filter(p => 
                clientTags[p.id]?.includes(selectedTagFilter)
            );
        }
        
        return filtered;
    }, [patients, clientSearch, selectedTagFilter, clientTags]);

    return (
        <>
            {/* Role Indicator */}
            {isAdmin && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium text-primary flex items-center gap-2">
                        <Badge variant="default">Admin Access</Badge>
                        You have full administrative access to all clients, sessions, and forms.
                    </p>
                </div>
            )}
            
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    {USE_MOCK_DATA && <TabsTrigger value="test-tools">Test Tools</TabsTrigger>}
                </TabsList>

                <TabsContent value="appointments" className="space-y-6">
                    <div className="flex flex-col gap-8 md:gap-12">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{isLoadingBookings ? '...' : upcomingSessions.length}</div>
                                    <p className="text-xs text-muted-foreground">in the next 7 days</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{isLoadingUsers ? '...' : patients?.length}</div>
                                    <p className="text-xs text-muted-foreground">+2 from last month</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Reports to Review</CardTitle>
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">3</div>
                                    <p className="text-xs text-muted-foreground">due this week</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Next Appointments Section - Enhanced */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Next Appointments</CardTitle>
                                <CardDescription>Your upcoming scheduled sessions with detailed information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isLoadingBookings && <p>Loading sessions...</p>}
                                {!isLoadingBookings && upcomingSessions.slice(0, 5).map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-12 w-12 border">
                                                <AvatarFallback>{'C'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">Session with Client</p>
                                                <p className="text-sm text-muted-foreground">{session.type}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{format(new Date(session.date), "PPp")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenSessionNotes(session)}>
                                                Add Notes
                                            </Button>
                                            <Button variant="secondary" size="sm">
                                                Start Session
                                                <ArrowUpRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {!isLoadingBookings && upcomingSessions.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-muted-foreground mb-4">No upcoming sessions.</p>
                                        <Button asChild>
                                            <Link href="/sessions/booking">Book a New Session</Link>
                                        </Button>
                                    </div>
                                )}
                                {upcomingSessions.length > 5 && (
                                    <Button variant="outline" className="w-full" asChild>
                                        <Link href="/sessions">View All Sessions</Link>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="clients" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>My Clients</CardTitle>
                                    <CardDescription>Manage all your assigned clients and their data.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Search clients..." 
                                        value={clientSearch}
                                        onChange={(e) => setClientSearch(e.target.value)}
                                        className="w-64"
                                    />
                                    <Select value={selectedTagFilter} onValueChange={setSelectedTagFilter}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Filter by tag" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Tags</SelectItem>
                                            <SelectItem value="VIP">VIP</SelectItem>
                                            <SelectItem value="chronic pain">Chronic Pain</SelectItem>
                                            <SelectItem value="emotional focus">Emotional Focus</SelectItem>
                                            <SelectItem value="new client">New Client</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="min-w-[180px]">Client</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Tags</TableHead>
                                        <TableHead>Sessions</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingUsers && (
                                        [...Array(3)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-5 w-24" /></div></TableCell>
                                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                                <TableCell className="text-right"><Skeleton className="h-8 w-32" /></TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                    {filteredPatients?.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                                        <AvatarFallback>{patient.initials}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium whitespace-nowrap">{patient.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-muted-foreground">{patient.email}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-1 flex-wrap">
                                                    {clientTags[patient.id]?.map(tag => (
                                                        <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveClientTag(patient.id, tag)}>
                                                            {tag} ×
                                                        </Badge>
                                                    ))}
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-6 px-2"
                                                        onClick={() => handleAddClientTag(patient.id, 'VIP')}
                                                    >
                                                        + Tag
                                                    </Button>
                                                </div>
                                            </TableCell>
                                            <TableCell>{patient.goal?.currentSessions || 0}</TableCell>
                                            <TableCell className="text-right space-x-2 whitespace-nowrap">
                                                <Button variant="outline" size="sm" onClick={() => handleOpenReportDialog(patient)}>Write Report</Button>
                                                <Button variant="outline" size="sm" onClick={() => handleOpenGoalDialog(patient)}>Set Goal</Button>
                                                <Button variant="ghost" size="sm">Profile</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sessions" className="space-y-6">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>My Patients</CardTitle>
                                <CardDescription>An overview of your currently managed patients.</CardDescription>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[180px]">Patient</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {isLoadingUsers && (
                                            [...Array(3)].map((_, i) => (
                                                <TableRow key={i}>
                                                     <TableCell><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-5 w-24" /></div></TableCell>
                                                     <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                     <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                                     <TableCell className="text-right"><Skeleton className="h-8 w-32" /></TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                        {patients?.map((patient) => (
                                            <TableRow key={patient.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                                            <AvatarFallback>{patient.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium whitespace-nowrap">{patient.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="whitespace-nowrap text-muted-foreground">{patient.email}</TableCell>
                                                <TableCell>{patient.role}</TableCell>
                                                <TableCell className="text-right space-x-2 whitespace-nowrap">
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenReportDialog(patient)}>Write Report</Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenGoalDialog(patient)}>Set Goal</Button>
                                                    <Button variant="ghost" size="sm">Profile</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Sessions</CardTitle>
                                <CardDescription>Your next two scheduled appointments.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isLoadingBookings && <p>Loading sessions...</p>}
                                {!isLoadingBookings && upcomingSessions.slice(0, 2).map(session => (
                                    <div key={session.id} className="space-y-3">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarFallback>{'P'}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">Session with a client</p> 
                                                <p className="text-sm text-muted-foreground">{session.type}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-sm bg-muted p-3 rounded-lg">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{format(new Date(session.date), "p, MMM d")}</span>
                                            </div>
                                            <Button variant="secondary" size="sm">
                                                Start Session
                                                <ArrowUpRight className="h-4 w-4 ml-2" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                 {!isLoadingBookings && upcomingSessions.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No upcoming sessions.</p>
                                )}
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/sessions">View All Sessions</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="billing" className="space-y-6">
                    {selectedPatient ? (
                        <div className="space-y-4">
                            <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                                ← Back to Client List
                            </Button>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div className="space-y-6">
                                    <ClientBilling client={selectedPatient} isAdmin={isAdmin} />
                                </div>
                                <div>
                                    <ClientActivityTimeline client={selectedPatient} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Client Billing & Accounts</CardTitle>
                                <CardDescription>Manage client balances, transactions, and payment packages.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Client</TableHead>
                                            <TableHead>Account Balance</TableHead>
                                            <TableHead>Active Packages</TableHead>
                                            <TableHead>Last Transaction</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {patients?.map((patient) => (
                                            <TableRow key={patient.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                                            <AvatarFallback>{patient.initials}</AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium">{patient.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-primary">€150.00</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">1 Active</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">2 days ago</TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={() => setSelectedPatient(patient)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                    {isAdmin ? (
                        <Card>
                             <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Service Management</CardTitle>
                                    <CardDescription>Add, edit, or deactivate services and VIP plans offered.</CardDescription>
                                </div>
                                <Button onClick={() => handleOpenServiceDialog(null)}>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Add Service
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Service Name</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Duration</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                         {isLoadingServices && (
                                            [...Array(4)].map((_, i) => (
                                                <TableRow key={i}>
                                                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                                    <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                        {services?.map((service: Service) => (
                                            <TableRow key={service.id}>
                                                <TableCell className="font-medium">{service.name}</TableCell>
                                                <TableCell>{service.category}</TableCell>
                                                <TableCell>{service.durationMinutes} min</TableCell>
                                                <TableCell>€{service.priceEUR}</TableCell>
                                                <TableCell>
                                                    <Badge variant={service.active ? 'secondary' : 'outline'}>
                                                        {service.active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenServiceDialog(service)}>
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>Your personal preferences and settings.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Standard therapist settings coming soon. Service management is available for administrators only.</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {USE_MOCK_DATA && (
                    <TabsContent value="test-tools" className="space-y-6">
                        <TestTools isTestMode={USE_MOCK_DATA} />
                        <Card>
                            <CardHeader>
                                <CardTitle>Test Mode Information</CardTitle>
                                <CardDescription>
                                    You are currently in test mode using mock data. This tab is only visible when USE_MOCK_DATA is enabled.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 border rounded-lg bg-muted">
                                    <p className="font-semibold mb-2">Features Available in Test Mode:</p>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                        <li>Change user roles dynamically without authentication</li>
                                        <li>Simulate VIP and Loyal subscription states</li>
                                        <li>Add virtual balance to internal accounts</li>
                                        <li>Test donation seeker functionality</li>
                                        <li>View pages and features even with no data</li>
                                    </ul>
                                </div>
                                <div className="p-4 border border-yellow-500 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                                    <p className="font-semibold text-yellow-700 dark:text-yellow-500 mb-2">⚠️ Production Mode</p>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                                        In production mode (USE_MOCK_DATA = false), this tab will be hidden and all features will work with real Firebase data. Pages with no data will not be displayed.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
            
            {/* Session Notes Dialog */}
            <Dialog open={isSessionNotesDialogOpen} onOpenChange={setIsSessionNotesDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Session Notes</DialogTitle>
                        <DialogDescription>
                            {selectedSession && `Add or edit notes for session on ${format(new Date(selectedSession.date), "PPp")}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="session-notes">Notes</Label>
                            <Textarea 
                                id="session-notes"
                                placeholder="Enter session notes, observations, and action items..."
                                value={sessionNotes}
                                onChange={(e) => setSessionNotes(e.target.value)}
                                className="min-h-[200px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSaveSessionNotes}>Save Notes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set Goal for {selectedPatient?.name}</DialogTitle>
                        <DialogDescription>Define a clear, session-based goal to guide the patient's therapy journey.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="goal-description">Goal Description</Label>
                            <Textarea 
                                id="goal-description"
                                placeholder="e.g., 'Achieve 80% pain reduction in lower back'"
                                value={goalDescription}
                                onChange={(e) => setGoalDescription(e.target.value)} 
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="target-sessions">Target Sessions</Label>
                            <Input 
                                id="target-sessions" 
                                type="number" 
                                placeholder="e.g., '10'"
                                value={targetSessions}
                                onChange={(e) => setTargetSessions(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSetGoal}>Set Goal</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Session Report for {selectedPatient?.name}</DialogTitle>
                        <DialogDescription>Fill in the patient's ratings and your notes, then let AI generate the full report.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div>
                             <Label className="mb-3 block">Session Tags</Label>
                             <div className="flex flex-wrap gap-2">
                                {reportTags.map(tag => (
                                    <Badge 
                                        key={tag}
                                        variant={reportState.tags.includes(tag) ? 'default' : 'secondary'}
                                        onClick={() => handleReportTagClick(tag)}
                                        className="cursor-pointer"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                                <Label htmlFor="pain-rating">Pain Rating: {reportState.pain}</Label>
                                <Slider id="pain-rating" min={0} max={10} step={1} value={[reportState.pain]} onValueChange={([val]) => setReportState(s => ({...s, pain: val}))} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="mood-rating">Mood Rating: {reportState.mood}</Label>
                                <Slider id="mood-rating" min={0} max={10} step={1} value={[reportState.mood]} onValueChange={([val]) => setReportState(s => ({...s, mood: val}))} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="energy-rating">Energy Rating: {reportState.energy}</Label>
                                <Slider id="energy-rating" min={0} max={10} step={1} value={[reportState.energy]} onValueChange={([val]) => setReportState(s => ({...s, energy: val}))} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="objective-notes">Objective (O)</Label>
                            <Textarea id="objective-notes" placeholder="Objective observations and measurements..." value={reportState.objective} onChange={e => setReportState(s => ({...s, objective: e.target.value}))} />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="issues-notes">Assessment / Issues (A)</Label>
                            <Textarea id="issues-notes" placeholder="Your professional assessment of the key issues..." value={reportState.issues} onChange={e => setReportState(s => ({...s, issues: e.target.value}))} />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="next-steps-notes">Plan / Next Steps (P)</Label>
                            <Textarea id="next-steps-notes" placeholder="Plan for the next session, homework for the client..." value={reportState.nextSteps} onChange={e => setReportState(s => ({...s, nextSteps: e.target.value}))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleGenerateReport} disabled={isGeneratingReport}>
                            {isGeneratingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate & Save Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{serviceForm.id ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                        <DialogDescription>
                            {serviceForm.id ? `Editing "${serviceForm.name}"` : 'Enter the details for the new service.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
                        <div className="grid gap-2">
                            <Label htmlFor="service-name">Service Name</Label>
                            <Input id="service-name" value={serviceForm.name || ''} onChange={e => handleServiceFormChange('name', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="service-category">Category</Label>
                            <Select value={serviceForm.category} onValueChange={value => handleServiceFormChange('category', value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Core">Core</SelectItem>
                                    <SelectItem value="Personalized">Personalized</SelectItem>
                                    <SelectItem value="360° Component">360° Component</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="service-duration">Duration (minutes)</Label>
                                <Input id="service-duration" type="number" value={serviceForm.durationMinutes || 0} onChange={e => handleServiceFormChange('durationMinutes', parseInt(e.target.value, 10))} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="service-price">Price (€)</Label>
                                <Input id="service-price" type="number" value={serviceForm.priceEUR || 0} onChange={e => handleServiceFormChange('priceEUR', parseFloat(e.target.value))} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="service-desc-short">Short Description</Label>
                            <Textarea id="service-desc-short" placeholder="A brief one-liner for the service." value={serviceForm.descriptionShort || ''} onChange={e => handleServiceFormChange('descriptionShort', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="service-desc-long">Long Description</Label>
                            <Textarea id="service-desc-long" className="min-h-[100px]" placeholder="A detailed description of the service." value={serviceForm.descriptionLong || ''} onChange={e => handleServiceFormChange('descriptionLong', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="service-benefits">Benefits (comma-separated)</Label>
                            <Input id="service-benefits" placeholder="Benefit 1, Benefit 2" value={Array.isArray(serviceForm.benefits) ? serviceForm.benefits.join(', ') : ''} onChange={e => handleServiceFormChange('benefits', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="service-tags">Tags (comma-separated)</Label>
                            <Input id="service-tags" placeholder="tag1, tag2" value={Array.isArray(serviceForm.tags) ? serviceForm.tags.join(', ') : ''} onChange={e => handleServiceFormChange('tags', e.target.value)} />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch id="service-active" checked={serviceForm.active} onCheckedChange={value => handleServiceFormChange('active', value)} />
                            <Label htmlFor="service-active">Service is Active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSaveService}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
    
