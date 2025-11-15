"use client";

import { Avatar, AvatarFallback, AvatarImage, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Select, SelectContent, SelectItem, SelectValue, Skeleton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsItem, TabsList } from '@/components/keep';
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
    ArrowUpRight,
    Loader2,
    PlusCircle,
    Users,
    Calendar,
    FileText,
    Settings,
    DollarSign,
    Shield,
    TestTube2,
} from "lucide-react";
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";

import type { User, Service, Session as AppSession, UserRole } from "@/lib/types";
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import fxService from '@/lib/fx-service';
import { useToast } from '@/hooks/use-toast';

import { SettingsShell } from "@/components/eka/settings/settings-shell";
import { SettingsHeader } from "@/components/eka/settings/settings-header";
;
;
;
;
;
;
;
;
;
;
;
import { format } from "date-fns";

// --- Dynamic Imports for Heavy Components ---
// Force re-evaluation
const TestTools = dynamic(() => import("@/components/eka/test-tools").then((mod) => mod.TestTools), { ssr: false });
const ClientBilling = dynamic(() => import("@/components/eka/client-billing").then((mod) => mod.ClientBilling), { ssr: false });
const AdminPanel = dynamic(() => import('@/components/eka/admin-panel').then((m) => m.AdminPanel), { ssr: false });
const BookingCalendar = dynamic(() => import('@/components/eka/booking-calendar'), { ssr: false });
const SessionAssessmentForm = dynamic(() => import('@/components/eka/forms/session-assessment-form').then(m => m.SessionAssessmentForm), { ssr: false });

// --- Helper Functions ---
const mapBookingToSession = (booking: any): AppSession => {
    const serviceName = booking.appointment_segments?.[0]?.service_variation_data?.name || booking.serviceName || "Unknown Service";
    const therapistName = booking.therapistName || "EKA Therapist";
    const dateVal = booking.start_at || booking.date || new Date().toISOString();
    return {
        id: booking.id || String(Math.random()),
        therapist: therapistName,
        therapistAvatarUrl: "https://i.pravatar.cc/150?u=square",
        date: dateVal,
        time: new Date(dateVal).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        duration: booking.duration || 0,
        status: booking.status || "Upcoming",
        type: serviceName,
        userId: booking.userId || booking.customer_id,
    } as AppSession;
};

// --- Main Page Component ---
export default function TherapistDashboardPage() {
    const { user: appUser } = useAuth();
    const isTestMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
    const isAdmin = appUser?.role === 'Admin';

    // Render a simplified shell and delegate to the inner component
    // This helps in managing layout and auth state cleanly
    return (
        <SettingsShell>
            <SettingsHeader
                title="Therapist Dashboard"
                description="Manage your clients, appointments, and administrative tasks."
            />
            <TherapistDashboardInner appUser={appUser} isTestMode={isTestMode} isAdmin={isAdmin} />
        </SettingsShell>
    );
}

// --- Inner Dashboard Component (Handles all logic) ---
function TherapistDashboardInner({ appUser, isTestMode, isAdmin }: { appUser: User | null, isTestMode: boolean, isAdmin: boolean }) {
    const router = useRouter();
    const { toast } = useToast();
    const dataService = useAppStore((state) => state.dataService);

    const [currentUser, setCurrentUser] = useState<User | null>(appUser);
    useEffect(() => { setCurrentUser(appUser); }, [appUser]);

    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [upcomingSessions, setUpcomingSessions] = useState<AppSession[]>([]);
    const [patients, setPatients] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial data
    useEffect(() => {
        async function fetchData() {
            if (!dataService || !currentUser) return;
            setIsLoading(true);
            try {
                const [bookings, users] = await Promise.all([
                    fxService.getAllBookings(),
                    dataService.getAllUsers(),
                ]);
                setUpcomingSessions(bookings.map(mapBookingToSession));
                setPatients(users.filter(u => u.role === 'Patient'));
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                toast({ variant: "destructive", title: "Error", description: "Could not load dashboard data." });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [dataService, currentUser, toast]);

    const switchRoleForTest = (role: UserRole) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, role });
            toast({ title: 'Role Switched (Test)', description: `You are now acting as a ${role}.` });
        }
    };

    const TABS = [
        { value: "dashboard", label: "Dashboard", icon: <Calendar className="h-4 w-4 mr-2" /> },
        { value: "clients", label: "Clients", icon: <Users className="h-4 w-4 mr-2" /> },
        { value: "sessions", label: "Sessions", icon: <FileText className="h-4 w-4 mr-2" /> },
        { value: "billing", label: "Billing", icon: <DollarSign className="h-4 w-4 mr-2" /> },
        { value: "settings", label: "Settings", icon: <Settings className="h-4 w-4 mr-2" /> },
        ...(isAdmin ? [{ value: "admin", label: "Admin", icon: <Shield className="h-4 w-4 mr-2" /> }] : []),
        ...(isTestMode ? [{ value: "test-tools", label: "Test Tools", icon: <TestTube2 className="h-4 w-4 mr-2" /> }] : []),
    ];

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)`}}>
                {TABS.map(tab => (
                    <TabsItem key={tab.value} value={tab.value} className="flex items-center">
                        {tab.icon} {tab.label}
                    </TabsItem>
                ))}
            </TabsList>

            <TabsContent value="dashboard">
                <DashboardTabContent sessions={upcomingSessions} patients={patients} isLoading={isLoading} />
            </TabsContent>
            <TabsContent value="clients">
                <ClientsTabContent patients={patients} isLoading={isLoading} />
            </TabsContent>
            {/* Add other TabsContent sections here, pointing to their own components */}
            <TabsContent value="sessions"><p>Sessions Management - Coming Soon</p></TabsContent>
            <TabsContent value="billing"><p>Billing Overview - Coming Soon</p></TabsContent>
            <TabsContent value="settings"><p>Therapist Settings - Coming Soon</p></TabsContent>
            {isAdmin && <TabsContent value="admin"><AdminPanel /></TabsContent>}
            {isTestMode && <TabsContent value="test-tools"><TestTools /></TabsContent>}
        </Tabs>
    );
}

// --- Tab-specific Components ---

function DashboardTabContent({ sessions, patients, isLoading }: { sessions: AppSession[], patients: User[], isLoading: boolean }) {
    const router = useRouter();
    
    const stats = useMemo(() => ({
        upcoming: sessions.filter(s => new Date(s.date) > new Date()).length,
        activeClients: patients.length,
        completedToday: sessions.filter(s => format(new Date(s.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && s.status === 'Completed').length,
        revenueToday: 520, // Mock data
    }), [sessions, patients]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard title="Upcoming Appointments" value={stats.upcoming.toString()} />
                <StatCard title="Active Clients" value={stats.activeClients.toString()} />
                <StatCard title="Completed Today" value={stats.completedToday.toString()} />
                <StatCard title="Revenue Today" value={`€${stats.revenueToday}`} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                    <CardDescription>Your appointments for today.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Simplified list for dashboard */}
                    {sessions.slice(0, 3).map(session => (
                        <div key={session.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10"><AvatarFallback>{session.therapist.charAt(0)}</AvatarFallback></Avatar>
                                <div>
                                    <p className="font-semibold">{session.type}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(session.date), "p, MMM d")}</p>
                                </div>
                            </div>
                            <Button variant="secondary" size="sm" onClick={() => router.push('/sessions/live/' + session.id)}>
                                Start Session <ArrowUpRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

function ClientsTabContent({ patients, isLoading }: { patients: User[], isLoading: boolean }) {
    if (isLoading) {
        return <ClientsSkeleton />;
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Client Directory</CardTitle>
                <CardDescription>Search, view, and manage your clients.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Last Session</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.map(patient => (
                            <TableRow key={patient.id}>
                                <TableCell className="font-medium">{patient.displayName || patient.name}</TableCell>
                                <TableCell>{patient.email}</TableCell>
                                <TableCell>{format(new Date(), 'MMM d, yyyy')}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="outline" size="sm">View Profile</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- Skeleton and Stat Card Components ---

function StatCard({ title, value }: { title: string, value: string }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
            </div>
            <Skeleton className="h-64" />
        </div>
    );
}

function ClientsSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            ))}
        </div>
    );
}

