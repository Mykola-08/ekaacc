'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessions } from "@/lib/data";
import { ArrowUpRight, Calendar, CheckCircle, Clock, Users, Goal } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";

const patients = [
    { id: 'patient-1', name: 'Alex Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', lastSession: '2024-08-15', progress: 'Stable' },
    { id: 'patient-2', name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', lastSession: '2024-08-12', progress: 'Improving' },
    { id: 'patient-3', name: 'John Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', lastSession: '2024-08-14', progress: 'Needs Attention' },
]

export default function TherapistDashboardPage() {
    const upcomingSessions = sessions.filter(s => s.status === 'Upcoming');
    const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<(typeof patients[0]) | null>(null);
    const [goalDescription, setGoalDescription] = useState('');
    const [targetSessions, setTargetSessions] = useState('');
    const { toast } = useToast();

    const handleOpenGoalDialog = (patient: typeof patients[0]) => {
        setSelectedPatient(patient);
        setIsGoalDialogOpen(true);
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

        // Here you would typically update the user's data in Firestore.
        // For this demo, we'll just show a success toast.
        console.log({
            patientId: selectedPatient.id,
            goal: goalDescription,
            sessions: parseInt(targetSessions, 10),
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
                            <div className="text-2xl font-bold">{upcomingSessions.length}</div>
                            <p className="text-xs text-muted-foreground">in the next 7 days</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{patients.length}</div>
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
                                        <TableHead>Last Session</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {patients.map((patient) => (
                                        <TableRow key={patient.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium whitespace-nowrap">{patient.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap">{patient.lastSession}</TableCell>
                                            <TableCell>{patient.progress}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleOpenGoalDialog(patient)}>Set Goal</Button>
                                                <Button variant="ghost" size="sm">View Profile</Button>
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
                            {upcomingSessions.slice(0, 2).map(session => (
                                <div key={session.id} className="space-y-3">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarImage src={sessions.find(s => s.therapist === session.therapist)?.therapistAvatarUrl} />
                                            <AvatarFallback>{session.therapist.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{session.therapist}</p>
                                            <p className="text-sm text-muted-foreground">{session.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm bg-muted p-3 rounded-lg">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{session.time}</span>
                                        </div>
                                        <Button variant="secondary" size="sm">
                                            Start Session
                                            <ArrowUpRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" className="w-full">View All Sessions</Button>
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
        </>
    );
}
