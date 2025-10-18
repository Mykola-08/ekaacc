import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sessions } from "@/lib/data";
import { ArrowUpRight, Calendar, CheckCircle, Clock, Users } from "lucide-react";
import Link from "next/link";

const patients = [
    { id: 'patient-1', name: 'Alex Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', lastSession: '2024-08-15', progress: 'Stable' },
    { id: 'patient-2', name: 'Jane Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', lastSession: '2024-08-12', progress: 'Improving' },
    { id: 'patient-3', name: 'John Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', lastSession: '2024-08-14', progress: 'Needs Attention' },
]

export default function TherapistDashboardPage() {
    const upcomingSessions = sessions.filter(s => s.status === 'Upcoming');

    return (
        <div className="flex flex-col gap-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Patient</TableHead>
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
                                                <span className="font-medium">{patient.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{patient.lastSession}</TableCell>
                                        <TableCell>{patient.progress}</TableCell>
                                        <TableCell className="text-right">
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
    );
}
