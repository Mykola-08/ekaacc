'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, Calendar, CheckCircle, Clock, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useFirestore, doc, updateDocumentNonBlocking, addDocumentNonBlocking, collection, query, where, serverTimestamp, useMemoFirebase } from '@/firebase';
import type { Session as AppSession, User, Report } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

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


export default function TherapistDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const usersRef = useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]);
    const { data: allUsers, isLoading: isLoadingUsers } = useCollection<User>(usersRef);
    
    // Fetch upcoming bookings from Firestore
    const upcomingBookingsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        const now = new Date().toISOString();
        return query(
            collection(firestore, 'bookings'), 
            where('start_at', '>=', now)
        );
    }, [firestore]);
    
    const { data: upcomingBookings, isLoading: isLoadingBookings } = useCollection(upcomingBookingsQuery);

    const upcomingSessions = useMemo(() => 
        (upcomingBookings?.map(mapBookingToSession) || [])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), 
    [upcomingBookings]);

    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
    const [goalDescription, setGoalDescription] = useState('');
    const [targetSessions, setTargetSessions] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    
    // Report Dialog State
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

    const handleSetGoal = () => {
        if (!selectedPatient || !goalDescription || !targetSessions) {
            toast({
                variant: 'destructive',
                title: "Incomplete Form",
                description: "Please fill out all fields to set a goal.",
            });
            return;
        }

        if (!firestore) {
            toast({ variant: 'destructive', title: "Database not available" });
            return;
        }
        
        const patientDocRef = doc(firestore, 'users', selectedPatient.id);
        
        updateDocumentNonBlocking(patientDocRef, {
            goal: {
                description: goalDescription,
                targetSessions: parseInt(targetSessions, 10),
            }
        });

        toast({
            title: "Goal Set Successfully!",
            description: `A goal of ${targetSessions} sessions has been set for ${selectedPatient.name}.`,
        });

        // Reset and close dialog
        setIsGoalDialogOpen(false);
        setGoalDescription('');
        setTargetSessions('');
        setSelectedPatient(null);
    };

    const handleGenerateReport = async () => {
        if (!selectedPatient || !firestore) return;
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

            const reportsRef = collection(firestore, `users/${selectedPatient.id}/reports`);
            const newReport: Omit<Report, 'id'> = {
                title: `Session Report - ${format(new Date(), 'PPP')}`,
                author: user?.displayName || 'Therapist',
                date: new Date().toISOString(),
                type: 'Therapist Report',
                summary: result.report,
                createdAt: serverTimestamp()
            };

            await addDocumentNonBlocking(reportsRef, newReport);

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
    
    const patients = useMemo(() => allUsers?.filter(u => u.role !== 'Therapist'), [allUsers]);

    return (
        <>
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
                                            {/* You'd fetch the customer's avatar based on session.userId */}
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
            </div>
            
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
        </>
    );
}