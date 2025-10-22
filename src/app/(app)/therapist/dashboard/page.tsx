"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowUpRight,
    Clock,
    Loader2,
    PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import type { User, Service, Session as AppSession } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";

import { AuthProvider, useAuth } from '@/context/auth-context';
import { useData } from '@/context/unified-data-context';
import fxService from '@/lib/fx-service';
import { mockAIAPI } from '@/lib/mock-bookings';
import fxAuth from '@/lib/fx-auth';
import { SessionAssessmentForm, SessionAssessmentData } from '@/components/eka/forms/session-assessment-form';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import BookingCalendar from '@/components/eka/booking-calendar';

const TestTools = dynamic(
    () => import("@/components/eka/test-tools").then((mod) => mod.TestTools),
    { ssr: false }
);
const ClientBilling = dynamic(
    () => import("@/components/eka/client-billing").then((mod) => mod.ClientBilling),
    { ssr: false }
);
const ClientActivityTimeline = dynamic(
    () => import("@/components/eka/client-activity-timeline").then((mod) => mod.ClientActivityTimeline),
    { ssr: false }
);
const AdminPanel = dynamic(() => import('@/components/eka/admin-panel').then((m) => m.AdminPanel), { ssr: false });

const reportTags = ["on time", "late", "cooperative", "resistant", "new issue", "follow-up"];

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

function TherapistDashboardInner() {
    // Local state (minimal to compile)
    const [activeTab, setActiveTab] = useState<string>("appointments");
    const [appointmentsView, setAppointmentsView] = useState<'list'|'calendar'>('list');
    const isTestMode = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';
    const { currentUser, setCurrentUser, switchRole } = useAuth();
    const isAdmin = currentUser?.role === 'Admin';
    const [isLoadingBookings, setIsLoadingBookings] = useState<boolean>(false);
    const [upcomingSessions, setUpcomingSessions] = useState<AppSession[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(false);
    const [patients, setPatients] = useState<User[]>([] as any);

    const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
    const [clientSearch, setClientSearch] = useState<string>("");
    const [clientTags, setClientTags] = useState<Record<string, string[]>>({});
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedClients, setSelectedClients] = useState<Record<string, boolean>>({});
    const selectAllRef = React.useRef<HTMLInputElement | null>(null);
    const [confirmBulkRemoveOpen, setConfirmBulkRemoveOpen] = useState<boolean>(false);
    const [selectScope, setSelectScope] = useState<'page'|'all'>('all');
    const [lastBulkRemoved, setLastBulkRemoved] = useState<{ id: string, removedTags: string[] }[] | null>(null);
    const [undoVisible, setUndoVisible] = useState<boolean>(false);
    const [clientsPage, setClientsPage] = useState<number>(1);
    const [clientsPerPage, setClientsPerPage] = useState<number>(10);
    const [bulkTagInput, setBulkTagInput] = useState<string>('');

    // Services (therapies) management
    const [services, setServices] = useState<Service[]>([]);
    const [isServiceDialogOpen, setIsServiceDialogOpen] = useState<boolean>(false);
    const [serviceForm, setServiceForm] = useState<Partial<Service>>({});
    const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
    const [managedUsers, setManagedUsers] = useState<User[]>([] as User[]);
    // Booking dialog state
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState<boolean>(false);
    const [bookingDateTime, setBookingDateTime] = useState<string>("");
    const [bookingNotes, setBookingNotes] = useState<string>("");
    const [bookingServiceId, setBookingServiceId] = useState<string | null>(null);
    const [bookingPatientId, setBookingPatientId] = useState<string | null>(null);
    const [bookingTherapistId, setBookingTherapistId] = useState<string | null>(null);
    const [bookingCreating, setBookingCreating] = useState<boolean>(false);

    // Session notes & report dialog state
    const [isSessionNotesOpen, setIsSessionNotesOpen] = useState<boolean>(false);
    const [isReportDialogOpen, setIsReportDialogOpen] = useState<boolean>(false);
    const [sessionNotes, setSessionNotes] = useState<string>("");
    const [notesSessionId, setNotesSessionId] = useState<string | null>(null);
    const [selectedPatientForReport, setSelectedPatientForReport] = useState<User | null>(null);
    const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
    const [assessmentOpenForSession, setAssessmentOpenForSession] = useState<{ sessionId: string | null, sessionType: 'pre' | 'post' | null }>({ sessionId: null, sessionType: null });
    const toast = useToast()?.toast;
    const [sessionDetailOpen, setSessionDetailOpen] = useState<boolean>(false);
    const [sessionDetailFor, setSessionDetailFor] = useState<AppSession | null>(null);
    const [reassignDialogOpen, setReassignDialogOpen] = useState<boolean>(false);
    const [reassignTargetBooking, setReassignTargetBooking] = useState<string | null>(null);
    const [reassignTherapistId, setReassignTherapistId] = useState<string | null>(null);
    const [sessionAssessments, setSessionAssessments] = useState<any[]>([]);
    const [sessionTransactions, setSessionTransactions] = useState<any[]>([]);
    const [clientBalanceInfo, setClientBalanceInfo] = useState<{ balance?: number, transactions?: any[] } | null>(null);
    const [adjustingAmount, setAdjustingAmount] = useState<number>(0);
    const [adjustingNoteLocal, setAdjustingNoteLocal] = useState<string>('');
    const [reportsFromData, setReportsFromData] = useState<any[]>([]);
    const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);

    const openSessionDetail = async (s: AppSession) => {
        setSessionDetailFor(s);
        setSessionDetailOpen(true);
            // load assessments
            try {
                const assessments = await fxService.getAssessmentsForSession(s.id);
                setSessionAssessments(assessments);
            } catch (e) {
                setSessionAssessments([]);
            }
            // load transactions for patient if userId exists
            if (s.userId) {
                try {
                    const billing = await fxService.getBalanceForClient(s.userId);
                    setSessionTransactions(billing.transactions || []);
                } catch (e) {
                    setSessionTransactions([]);
                }
            }
            // load user list to map note author ids to friendly names
            try {
                const users = await fxService.getUsers();
                const map: Record<string,string> = {};
                (users || []).forEach((u:any) => { map[u.id] = u.displayName || u.name || u.email || u.id; });
                setSessionAssessments(prev => (prev || []).map(a => ({ ...a, authorName: a.authorName || a.authorId ? map[a.authorId] : (a.data?.authorId ? map[a.data.authorId] : undefined) })));
            } catch (e) {
                // ignore mapping failure
            }
            // load templates for quick insert
            try { await loadTemplates(); } catch (e) { /* ignore */ }
    };

    // Start session only if a pre-session assessment exists
    const startSession = async (s: AppSession) => {
        // Only Therapists may start sessions in demo mode
        if (currentUser?.role !== 'Therapist') {
            toast?.({ variant: 'destructive', title: 'Unauthorized', description: 'Only therapists may start sessions.' });
            return;
        }
        try {
            const assessments = await fxService.getAssessmentsForSession(s.id);
            const hasPre = assessments.some((a: any) => a.data?.sessionType === 'pre');
            if (!hasPre) {
                toast?.({ variant: 'destructive', title: 'Pre-session form required', description: 'Please complete the pre-session assessment before starting.' });
                return;
            }
            openSessionNotes(s.id);
        } catch (e) {
            console.error('Error checking assessments', e);
            openSessionNotes(s.id);
        }
    };

    const filteredPatients = useMemo(() => {
        if (!patients) return [] as User[];
        return patients.filter((p: any) => {
            if (selectedTagFilter && selectedTagFilter !== "all") {
                return (clientTags[p.id] || []).includes(selectedTagFilter);
            }
            if (clientSearch) {
                return p.name?.toLowerCase().includes(clientSearch.toLowerCase()) || p.email?.toLowerCase().includes(clientSearch.toLowerCase());
            }
            return true;
        });
    }, [patients, selectedTagFilter, clientSearch, clientTags]);

    useEffect(() => {
            // Load initial data from unified data context
            setIsLoadingBookings(true);
            setIsLoadingUsers(true);
            (async () => {
                                // Use unified data context (useData) to fetch lists if available
                try {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const data = useData();
                    // sessions, services, users come from data context
                    setUpcomingSessions((data.sessions || []) as AppSession[]);
                    setPatients((data.allUsers || []) as User[]);
                    setManagedUsers((data.allUsers || []) as User[]);
                    setClientTags({ ...(data.allUsers?.[0] ? { [data.allUsers[0].id]: ['VIP'] } : {}) });
                    setServices((data.services || []) as Service[]);
                    setBookingServiceId((data.services && data.services[0]?.id) ?? null);
                    // reports may be provided by data context
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setReportsFromData(data.reports || []);
                } catch (e) {
                    // fallback for demo: leave empty (other parts of UI may provide mock fallbacks)
                    console.warn('Unified data not available in this context, using demo fallbacks');
                } finally {
                    setIsLoadingBookings(false);
                    setIsLoadingUsers(false);
                }
            })();
    }, []);

    // Update indeterminate state for select-all checkbox when selection changes
    useEffect(() => {
        try {
            const total = filteredPatients.length;
            const selectedCount = Object.keys(selectedClients).filter(k => selectedClients[k] && filteredPatients.find(p=>p.id===k)).length;
            if (selectAllRef.current) {
                selectAllRef.current.indeterminate = selectedCount > 0 && selectedCount < total;
            }
        } catch (e) {
            // ignore
        }
    }, [filteredPatients, selectedClients]);

    // Test-mode role switcher via auth context
    const switchRoleForTest = (role: 'Patient' | 'Therapist' | 'Admin') => {
        switchRole(role);
    };
    const [clientBalance, setClientBalance] = useState<number | null>(null);
    const [clientTransactions, setClientTransactions] = useState<any[]>([]);
    const [adjustAmount, setAdjustAmount] = useState<number>(0);
    const [adjustNote, setAdjustNote] = useState<string>('');

    // Service handlers
    const handleOpenServiceDialog = (svc?: Service | null) => {
        setServiceForm(svc ? { ...svc } : {});
        setIsServiceDialogOpen(true);
    };

    const handleServiceFormChange = (field: keyof Service, value: any) => {
        setServiceForm((s) => ({ ...(s as any), [field]: value }));
    };

    const handleSaveService = () => {
        // basic mock save
        if (serviceForm.id) {
            setServices((prev) => prev.map(s => s.id === serviceForm.id ? { ...(s as any), ...(serviceForm as Service) } : s));
        } else {
            const newSvc: Service = { ...(serviceForm as any) as Service, id: 'svc-' + Math.random().toString(36).slice(2) };
            setServices((prev) => [newSvc, ...prev]);
        }
        setIsServiceDialogOpen(false);
    };

    const handleDeleteService = (id?: string) => {
        if (!id) return;
        setServices((prev) => prev.filter(s => s.id !== id));
    };

    // Booking handlers
    const router = useRouter();

    const openBookingDialog = () => {
        // Navigate to the booking page with sensible prefilled query params for convenience
        const params = new URLSearchParams();
        if (currentUser?.role === 'Patient') params.set('patient', currentUser.id);
        if (currentUser?.role === 'Therapist') params.set('therapist', currentUser.id);
        if (services && services[0]?.id) params.set('service', services[0].id);
        // include any currently selected booking date/time if available
        if (bookingDateTime) params.set('datetime', bookingDateTime);
        router.push(`/sessions/booking?${params.toString()}`);
    };

    const handleCreateBooking = async () => {
        const creatorId = currentUser?.role === 'Patient' ? currentUser.id : (bookingPatientId || currentUser?.id);
        if (!creatorId) return;
        try {
            setBookingCreating(true);
            const isoDate = new Date(bookingDateTime).toISOString();
            const therapistsList = (managedUsers || []).filter(u => u.role === 'Therapist');
            const therapistIdToUse = bookingTherapistId || therapistsList[0]?.id || currentUser?.id;
            if (!therapistIdToUse) throw new Error('No therapist selected');
            const newBooking = await fxService.createBooking(creatorId, therapistIdToUse, isoDate, bookingNotes || undefined);
            // Attach some UI-friendly fields
            (newBooking as any).serviceName = services.find(s => s.id === bookingServiceId)?.name || 'Service';
            (newBooking as any).therapistName = therapistsList.find((t:any) => t.id === therapistIdToUse)?.displayName || currentUser?.displayName || 'EKA Therapist';
            const mapped = mapBookingToSession(newBooking);
            setUpcomingSessions((prev) => [mapped, ...prev]);
            setIsBookingDialogOpen(false);
        } catch (err) {
            console.error('Create booking failed', err);
            toast?.({ variant: 'destructive', title: 'Booking failed', description: (err as any)?.message || 'Could not create booking' });
        } finally {
            setBookingCreating(false);
        }
    };

    // Billing / export helpers
    const handleSelectPatientForBilling = (patient: User) => setSelectedPatient(patient);

    const loadBillingForClient = async (client: User) => {
        const res = await fxService.getBalanceForClient(client.id);
        setClientBalance(res.balance);
        setClientTransactions(res.transactions);
    };

    useEffect(() => {
        if (selectedPatient) {
            loadBillingForClient(selectedPatient);
        } else {
            setClientBalance(null);
            setClientTransactions([]);
        }
    }, [selectedPatient]);

    const applyAdjustment = async () => {
        if (!selectedPatient) return;
    const tx = await fxService.applyAdjustment(selectedPatient.id, adjustAmount, adjustNote || undefined);
        setClientTransactions((prev) => [tx, ...prev]);
        setClientBalance((b) => (b ?? 0) + tx.amountEUR);
        setAdjustAmount(0);
        setAdjustNote('');
    };

    const exportSessionsCsv = () => {
        // Export sessions for filtered patients when in Clients tab, otherwise export all upcoming sessions
        const patientIds = new Set(filteredPatients.map((p:any)=>p.id));
        const rows = upcomingSessions.filter(s => patientIds.size === 0 || patientIds.has(s.userId)).map(s => ({ id: s.id, date: s.date, time: s.time, type: s.type, therapist: s.therapist }));
        const header = Object.keys(rows[0] || {}).join(',') + '\n';
        const csv = header + rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sessions_export.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // simple handlers
    const handleAddClientTag = (id: string, tag: string) => setClientTags((s) => ({ ...s, [id]: Array.from(new Set([...(s[id] || []), tag])) }));
    const handleRemoveClientTag = (id: string, tag: string) => setClientTags((s) => ({ ...s, [id]: (s[id] || []).filter((t) => t !== tag) }));

    // Persist tag changes when possible
    const persistClientTags = async (userId: string, tags: string[]) => {
        try {
            await fxService.updateUser(userId, { tags });
        } catch (e) {
            console.warn('Could not persist tags for user', userId, e);
        }
    };

    // dialog handlers
    const openSessionNotes = (sessionId?: string | null, initial = "") => {
        setNotesSessionId(sessionId ?? null);
        setSessionNotes(initial);
        setIsSessionNotesOpen(true);
    };

    const openPreAssessmentForSession = (sessionId: string) => {
        setAssessmentOpenForSession({ sessionId, sessionType: 'pre' });
    };

    const openPostAssessmentForSession = (sessionId: string) => {
        // allow post assessment only within 24 hours of session time (demo check)
        const session = upcomingSessions.find(s => s.id === sessionId);
        if (session) {
            const sessionDate = new Date(session.date).getTime();
            const now = Date.now();
            const hoursSince = (now - sessionDate) / (1000 * 60 * 60);
            if (hoursSince > 24) {
                toast?.({ variant: 'destructive', title: 'Post-assessment window closed', description: 'Post-session assessments can only be submitted within 24 hours of the session.' });
                return;
            }
        }
        setAssessmentOpenForSession({ sessionId, sessionType: 'post' });
    };

    const closeAssessment = () => setAssessmentOpenForSession({ sessionId: null, sessionType: null });

    const handleAssessmentSubmit = async (data: SessionAssessmentData) => {
        try {
            if (!assessmentOpenForSession.sessionId) return;
            await fxService.saveAssessment(assessmentOpenForSession.sessionId, data);
            toast?.({ title: 'Assessment saved', description: `Saved ${data.sessionType} assessment.`});
            closeAssessment();
        } catch (err) {
            console.error('Save assessment failed', err);
            toast?.({ variant: 'destructive', title: 'Save failed', description: 'Could not save assessment.' });
        }
    };

    const saveSessionNotes = async () => {
        // Persist notes (demo: console) and mark session complete and charge client
        try {
            console.log('Saving session notes', sessionNotes, 'for', notesSessionId || sessionDetailFor?.id);
            // Persist the notes via fxService
            const targetSessionId = notesSessionId || sessionDetailFor?.id;
                if (targetSessionId) {
                await fxService.saveSessionNote(targetSessionId, sessionNotes, currentUser?.id);
                // reload assessments for the session if open
                try {
                    const assessments = await fxService.getAssessmentsForSession(targetSessionId);
                    setSessionAssessments(assessments);
                } catch (e) {
                    // ignore
                }
                // If viewing a session detail, charge the client for this session
                const s = sessionDetailFor && sessionDetailFor.id === targetSessionId ? sessionDetailFor : null;
                    if (s && s.userId) {
                    // find service price if we have mapping
                    const svc = services.find(x => x.id === bookingServiceId) as any;
                    const amount = svc?.priceEUR ?? 100;
                    const tx = await fxService.createChargeForSession(s.userId, s.id, amount, `Charge for ${s.type}`);
                    setSessionTransactions(prev => [tx, ...prev]);
                    toast?.({ title: 'Session completed', description: `Charged €${Math.abs(tx.amountEUR).toFixed(2)} for session.` });
                }
                    // show success for notes save
                        toast?.({ title: 'Notes saved', description: 'Session notes were saved successfully.' });
                        try { await fxService.createNotification({ title: 'New session note', body: `Notes saved for session ${targetSessionId}`, type: 'session' }); } catch (e) { /* ignore */ }
            } else {
                // no session id known; save as a generic note? For now just log
                console.warn('No session id available to attach notes to. Saved locally only.');
            }
        } catch (e) {
            console.error('Error charging for session', e);
            toast?.({ variant: 'destructive', title: 'Charge failed', description: 'Could not charge the client for the session.' });
        } finally {
            setIsSessionNotesOpen(false);
            setNotesSessionId(null);
            setSessionNotes('');
        }
    };

    // Goal & Journal AI section state
    const [roadmapText, setRoadmapText] = useState<string | null>(null);
    const [journalText, setJournalText] = useState<string | null>(null);
    const [loadingRoadmap, setLoadingRoadmap] = useState(false);
    const [loadingJournal, setLoadingJournal] = useState(false);

    const generateRoadmap = async () => {
        setLoadingRoadmap(true);
        try {
            const res = await fxService.generateAIReport(currentUser?.id || 'user-unknown', 'Summarize goals and propose roadmap');
            const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
            setRoadmapText(typeof ai === 'string' ? ai : JSON.stringify(ai));
            toast?.({ title: 'Roadmap generated' });
        } catch (e) {
            toast?.({ variant: 'destructive', title: 'AI unavailable' });
        } finally { setLoadingRoadmap(false); }
    };

    const generateJournal = async () => {
        setLoadingJournal(true);
        try {
            const res = await fxService.generateAIReport(currentUser?.id || 'user-unknown', 'Summarize recent journal entries');
            const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
            setJournalText(typeof ai === 'string' ? ai : JSON.stringify(ai));
            toast?.({ title: 'Journal summary generated' });
        } catch (e) {
            toast?.({ variant: 'destructive', title: 'AI unavailable' });
        } finally { setLoadingJournal(false); }
    };

    const [templatesList, setTemplatesList] = useState<any[]>([]);
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
    const [isEditTemplateOpen, setIsEditTemplateOpen] = useState<boolean>(false);
    const loadTemplates = async () => {
        try { const t = await fxService.listTemplates(); setTemplatesList(t || []); } catch (e) { setTemplatesList([]); }
    };

    const saveTemplateFromNotes = async (title?: string) => {
        const name = title || prompt('Template title') || `Template ${new Date().toLocaleString()}`;
        try {
            const created = await fxService.createTemplate({ title: name, content: sessionNotes || '', authorId: currentUser?.id });
            await loadTemplates();
            if (created && (created as any).title) {
                toast?.({ title: 'Template saved', description: (created as any).title });
            } else {
                toast?.({ title: 'Template saved' });
            }
        } catch (e) {
            toast?.({ variant: 'destructive', title: 'Save failed' });
        }
    };

    const exportSessionToPdf = async (s: AppSession | null) => {
        if (!s) return;
        try {
            const mod: any = await import('jspdf');
            const JsPDF = mod?.default || mod?.jsPDF || mod;
            const doc = new JsPDF();
            doc.setFontSize(14);
            doc.text(`${s.type} — ${s.therapist}`, 14, 20);
            doc.setFontSize(11);
            doc.text(`Date: ${new Date(s.date).toLocaleString()}`, 14, 30);
            doc.text(`Client: ${s.userId || 'Unknown'}`, 14, 40);
            const notes = (sessionAssessments.filter(a=>a.data?.sessionType==='note').map(n=> n.content || JSON.stringify(n.data)).join('\n\n')) || sessionNotes || 'No notes';
            doc.text('Notes:', 14, 52);
            doc.text(doc.splitTextToSize(notes, 180), 14, 60);
            doc.save(`session-${s.id}.pdf`);
        } catch (e) {
            console.warn('PDF export failed', e);
            toast?.({ variant: 'destructive', title: 'Export failed', description: 'Could not create PDF in this environment.' });
        }
    };

    const handleOpenReportDialog = (patient: any) => {
        setSelectedPatientForReport(patient || null);
        setIsReportDialogOpen(true);
    };

    const handleOpenGoalDialog = (patient: any) => {
        // placeholder for goal dialog
        console.log('Open goal dialog for', patient?.id);
    };

    const generateAndSaveReport = async () => {
        setIsGeneratingReport(true);
        try {
            const userId = selectedPatientForReport?.id || currentUser?.id || 'user-unknown';
            try {
                const [userMsg, aiMsg] = await fxService.generateAIReport(userId, 'Generate a session report based on notes and data.');
                console.log('AI report reply:', aiMsg?.content || aiMsg);
            } catch (e) {
                console.warn('AI service not available, skipping generation', e);
            }
            setIsReportDialogOpen(false);
        } finally {
            setIsGeneratingReport(false);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col gap-4">
                {/* Required Actions */}
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                        <CardTitle>Required Actions</CardTitle>
                        <CardDescription>Tasks that may require your attention.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="text-sm">• {upcomingSessions.length} upcoming sessions</div>
                            <div className="text-sm">• {patients.length} clients</div>
                            <div className="ml-auto"><Button onClick={() => setActiveTab('clients')}>Manage Clients</Button></div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200 shadow-sm rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg">Notifications</CardTitle>
                        <CardDescription>Reminders and alerts for your sessions and clients.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full h-40 bg-gradient-to-r from-green-100 to-green-300 rounded-lg flex items-center justify-center text-green-800 font-bold">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={reportsFromData || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="progress" stroke="#82ca9d" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-blue-900">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 border border-blue-300">New pre-session form submitted by John Doe</span>
                            </li>
                            <li className="flex items-center gap-2 text-blue-900">
                                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 border border-blue-300">Session with Jane Smith starts in 30 minutes</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
                {/* AI Recommendations removed per configuration */}

                {isAdmin && (
                    <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                        <p className="text-sm font-medium text-primary flex items-center gap-2">
                            <Badge variant="default">Admin Access</Badge>
                            You have full administrative access to all clients, sessions, and forms.
                        </p>
                    </div>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="clients">Clients</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                    {isTestMode && <TabsTrigger value="test-tools">Test Tools</TabsTrigger>}
                    {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
                </TabsList>

                <TabsContent value="appointments" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Next Appointments</CardTitle>
                            <CardDescription>Upcoming sessions for your therapists.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-3">
                                <div />
                                <div className="flex items-center gap-2">
                                        <Button size="sm" variant={appointmentsView === 'list' ? 'default' : 'ghost'} onClick={() => setAppointmentsView('list')}>List</Button>
                                        <Button size="sm" variant={appointmentsView === 'calendar' ? 'default' : 'ghost'} onClick={() => setAppointmentsView('calendar')}>Calendar</Button>
                                    </div>
                            </div>
                            {appointmentsView === 'calendar' ? (
                                <div className="h-56">
                                    <BookingCalendar value={bookingDateTime || null} onChange={(iso)=>{ 
                                        setBookingDateTime(iso);
                                        // attempt to find a session that matches the selected hour
                                        const selected = upcomingSessions.find(s => {
                                            try {
                                                const slot = new Date(iso).getTime();
                                                const sd = new Date(s.date).getTime();
                                                // consider a match if within the same hour
                                                return Math.abs(slot - sd) < (1000 * 60 * 60);
                                            } catch (e) { return false; }
                                        });
                                        if (selected) {
                                            openSessionDetail(selected);
                                        } else {
                                            setIsBookingDialogOpen(true);
                                        }
                                    }} />
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {(upcomingSessions || []).slice(0,5).map(s => (
                                        <div key={s.id} className="flex items-center justify-between border rounded p-2">
                                            <div>
                                                <div className="font-semibold">{s.type}</div>
                                                <div className="text-sm text-muted-foreground">{new Date(s.date).toLocaleDateString()} · {s.time} · {s.therapist}</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" variant="ghost" onClick={() => openSessionDetail(s)}>Open</Button>
                                                <Button size="sm" onClick={() => openSessionNotes(s.id, '')}>Notes</Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!upcomingSessions || upcomingSessions.length === 0) && (
                                        <div className="text-center py-6">
                                            <Button onClick={() => setIsBookingDialogOpen(true)}>Book a New Session</Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Goal Roadmap & Journal placeholders */}
                    <div className="grid gap-4 lg:grid-cols-2">
                        <GoalJournalSection userId={currentUser?.id} />
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Today's Appointments</CardTitle>
                            <CardDescription>Quick view of upcoming appointments.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isLoadingBookings ? (
                                    <Skeleton className="h-10 w-full" />
                                ) : (
                                    upcomingSessions.slice(0, 3).map((s) => (
                                        <div key={s.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback>P</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold">{s.type}</div>
                                                    <div className="text-sm text-muted-foreground">{format(new Date(s.date), "p, MMM d")}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="secondary" size="sm" onClick={() => startSession(s)} disabled={currentUser?.role !== 'Therapist'}>Start Session <ArrowUpRight className="h-4 w-4 ml-2" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => openSessionNotes(s.id, 'Quick note...')} disabled={currentUser?.role !== 'Therapist'}>Notes</Button>
                                                <Button variant="outline" size="sm" onClick={() => openPreAssessmentForSession(s.id)} disabled={currentUser?.role === 'Patient' || !['Therapist','Admin'].includes(currentUser?.role || '')}>Pre-assessment</Button>
                                                <Button variant="outline" size="sm" onClick={() => openPostAssessmentForSession(s.id)} disabled={!['Therapist','Admin'].includes(currentUser?.role || '')}>Post-assessment</Button>
                                                <Button variant="ghost" size="sm" onClick={() => openSessionDetail(s)}>Details</Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div className="mt-4">
                                    <Button onClick={openBookingDialog}>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        Book New Session
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Test Payments & Role Management</CardTitle>
                            <CardDescription>Simulate payments and change roles for users in test mode.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                <div className="flex items-center gap-2">
                                    <Select value={selectedPatient?.id || ''} onValueChange={(v:any)=>setSelectedPatient(patients.find((x:any)=>x.id===v) || null)}>
                                        <SelectTrigger className="w-56"><SelectValue placeholder="Select client" /></SelectTrigger>
                                        <SelectContent>
                                            {(patients || []).map((p:any)=> <SelectItem key={p.id} value={p.id}>{p.displayName || p.name || p.email}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Input type="number" value={adjustAmount} onChange={(e:any)=>setAdjustAmount(parseFloat(e.target.value||'0'))} placeholder="Amount €" className="w-32" />
                                    <Input value={adjustNote} onChange={(e:any)=>setAdjustNote(e.target.value)} placeholder="Note" className="flex-1" />
                                    <div>
                                        <Button disabled={!(['Admin','Therapist'].includes(currentUser?.role || ''))} onClick={async()=>{ if(selectedPatient){ await fxService.applyAdjustment(selectedPatient.id, adjustAmount, adjustNote); await loadBillingForClient(selectedPatient); }}}>Apply</Button>
                                        {!(['Admin','Therapist'].includes(currentUser?.role || '')) && (
                                            <div className="text-xs text-muted-foreground mt-1">Only Admins and Therapists can apply test adjustments.</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Select value={currentUser?.id || ''} onValueChange={(v:any)=>{ const u = (patients||[]).concat(managedUsers||[]).find((x:any)=>x.id===v); if(u){ setCurrentUser(u as User); } }}>
                                        <SelectTrigger className="w-56"><SelectValue placeholder="Select user to edit" /></SelectTrigger>
                                        <SelectContent>
                                            {((patients||[]).concat(managedUsers||[])).map((u:any)=> <SelectItem key={u.id} value={u.id}>{u.displayName || u.email}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Select value={currentUser?.role || 'Patient'} onValueChange={(v:any)=>{ if(currentUser){ const updated = {...currentUser, role:v}; setCurrentUser(updated as User); } }}>
                                        <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Patient">Patient</SelectItem>
                                            <SelectItem value="Therapist">Therapist</SelectItem>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="clients" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Directory</CardTitle>
                            <CardDescription>Search, tag, and manage your clients.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex gap-4">
                                <Select value={selectedTagFilter} onValueChange={setSelectedTagFilter}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Filter by tag" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tags</SelectItem>
                                        <SelectItem value="VIP">VIP</SelectItem>
                                        <SelectItem value="new client">New Client</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Input value={clientSearch} onChange={(e: any) => setClientSearch(e.target.value)} placeholder="Search by name or email" className="w-64" />
                                <div className="ml-auto flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        {Object.keys(selectedClients).filter(k=> selectedClients[k]).length > 0 && (
                                            <div className="inline-flex items-center px-2 py-1 bg-primary/10 rounded-md text-sm">Selected <span className="ml-2 font-medium">{Object.keys(selectedClients).filter(k=> selectedClients[k]).length}</span></div>
                                        )}
                                        {Object.keys(selectedClients).filter(k=> selectedClients[k]).length > 0 && (
                                            <Button size="sm" variant="ghost" onClick={()=> setSelectedClients({})}>Clear selection</Button>
                                        )}
                                    </div>
                                    <Input placeholder="Bulk tag" value={bulkTagInput} onChange={(e:any)=>setBulkTagInput(e.target.value)} className="w-40" />
                                    <Button size="sm" onClick={()=>{
                                        const ids = Object.keys(selectedClients).filter(k=> selectedClients[k]);
                                        ids.forEach(id => { handleAddClientTag(id, bulkTagInput); persistClientTags(id, Array.from(new Set([...(clientTags[id]||[]), bulkTagInput]))); });
                                    }} disabled={!bulkTagInput}>Apply Tag to Selected</Button>
                                    <Button size="sm" variant="ghost" onClick={()=>{
                                        setConfirmBulkRemoveOpen(true);
                                    }} disabled={!bulkTagInput}>Remove Tag from Selected</Button>
                                    {/* select scope chooser */}
                                    <Select value={selectScope} onValueChange={(v:any)=> setSelectScope(v)}>
                                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="page">Select: page</SelectItem>
                                            <SelectItem value="all">Select: all</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={String(clientsPerPage)} onValueChange={(v:any)=>{ setClientsPerPage(parseInt(v)); setClientsPage(1); }}>
                                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">5 / page</SelectItem>
                                            <SelectItem value="10">10 / page</SelectItem>
                                            <SelectItem value="25">25 / page</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" size="sm" onClick={exportSessionsCsv}>Export Sessions CSV</Button>
                                </div>
                            </div>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                            <TableHead className="min-w-[180px]">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        ref={selectAllRef}
                                                        type="checkbox"
                                                        checked={selectScope === 'all' ? (filteredPatients.length>0 && filteredPatients.every(p => !!selectedClients[p.id])) : (filteredPatients.slice((clientsPage-1)*clientsPerPage, clientsPage*clientsPerPage).length>0 && filteredPatients.slice((clientsPage-1)*clientsPerPage, clientsPage*clientsPerPage).every(p => !!selectedClients[p.id]))}
                                                        onChange={(e)=>{
                                                            const checked = e.target.checked;
                                                            const updated = { ...selectedClients };
                                                            if (selectScope === 'all') {
                                                                filteredPatients.forEach((p:any)=> updated[p.id] = checked);
                                                            } else {
                                                                const pageItems = filteredPatients.slice((clientsPage-1)*clientsPerPage, clientsPage*clientsPerPage);
                                                                pageItems.forEach((p:any)=> updated[p.id] = checked);
                                                            }
                                                            setSelectedClients(updated);
                                                        }}
                                                    />
                                                </div>
                                            </TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Tags</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoadingUsers ? (
                                        [...Array(3)].map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Skeleton className="h-8 w-8 rounded-full" />
                                                        <Skeleton className="h-5 w-24" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-5 w-32" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="h-5 w-16" />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Skeleton className="h-8 w-32" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        // pagination
                                        filteredPatients.slice((clientsPage-1)*clientsPerPage, clientsPage*clientsPerPage).map((patient: any) => (
                                            <TableRow key={patient.id}>
                                                <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <input type="checkbox" checked={!!selectedClients[patient.id]} onChange={(e)=> setSelectedClients(s=>({ ...s, [patient.id]: e.target.checked }))} />
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                                                                <AvatarFallback>{patient.initials}</AvatarFallback>
                                                            </Avatar>
                                                            <button className="font-medium whitespace-nowrap text-left" onClick={() => { setSelectedPatient(patient); }}>{patient.name}</button>
                                                        </div>
                                                    </TableCell>
                                                <TableCell className="whitespace-nowrap text-muted-foreground">{patient.email}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {(clientTags[patient.id] || []).map((tag) => (
                                                            <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => { handleRemoveClientTag(patient.id, tag); persistClientTags(patient.id, (clientTags[patient.id] || []).filter(t=>t!==tag)); }}>
                                                                {tag} ×
                                                            </Badge>
                                                        ))}
                                                        <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => { handleAddClientTag(patient.id, "VIP"); persistClientTags(patient.id, Array.from(new Set([...(clientTags[patient.id] || []), 'VIP']))); }}>+ Tag</Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2 whitespace-nowrap">
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenReportDialog(patient)}>Write Report</Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleOpenGoalDialog(patient)}>Set Goal</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            {filteredPatients.length === 0 && (
                                <div className="p-6 text-center text-sm text-muted-foreground">No clients found. Try adjusting your filters or adding a new client.</div>
                            )}
                            {/* Pagination controls */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">Showing {Math.min(filteredPatients.length, (clientsPage*clientsPerPage))} of {filteredPatients.length}</div>
                                <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={()=> setClientsPage(p=> Math.max(1, p-1))}>Prev</Button>
                                    <div className="px-2">Page {clientsPage}</div>
                                    <Button size="sm" variant="outline" onClick={()=> setClientsPage(p=> p+1)}>Next</Button>
                                </div>
                            </div>
                            {/* Progress Tracking */}
                            <div className="mt-6">
                                <Card className="border-green-200 mb-4">
                                    <CardHeader>
                                        <CardTitle>Progress Tracking</CardTitle>
                                        <CardDescription>Visualize client progress over time.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="w-full h-40 bg-gradient-to-r from-green-100 to-green-300 rounded-lg flex items-center justify-center text-green-800 font-bold">
                                            Progress Chart Placeholder
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sessions" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sessions</CardTitle>
                            <CardDescription>Overview, search, and admin actions for sessions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4 flex gap-2">
                                <Input placeholder="Search by client or therapist" value={(searchQuery as any) || ''} onChange={(e:any)=>setSearchQuery(e.target.value)} className="w-80" />
                                <Button onClick={async()=>{ // simple filter
                                    const q = (searchQuery || '').toLowerCase();
                                    const all = await fxService.getAllBookings();
                                    setUpcomingSessions(all.map(mapBookingToSession).filter(s=> s.type.toLowerCase().includes(q) || s.therapist.toLowerCase().includes(q) || (s.userId||'').toLowerCase().includes(q)));
                                }}>Search</Button>
                            </div>
                            <div className="space-y-2">
                                {upcomingSessions && upcomingSessions.length > 0 ? (
                                    upcomingSessions.map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-2 border rounded">
                                            <div>
                                                <div className="font-medium">{s.type} · {s.therapist}</div>
                                                <div className="text-sm text-muted-foreground">{new Date(s.date).toLocaleString()}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                {isAdmin && <Button size="sm" variant="ghost" onClick={async()=>{ try{ await fxService.cancelBooking(s.id); setUpcomingSessions(prev=>prev.filter(x=>x.id!==s.id)); toast?.({ title: 'Cancelled', description: 'Session cancelled.'}); }catch(e){ toast?.({ variant:'destructive', title:'Cancel failed' }); } }}>Cancel</Button>}
                                                {isAdmin && <Button size="sm" onClick={async()=>{ setReassignTargetBooking(s.id); setReassignDialogOpen(true); }}>Reassign</Button>}
                                                <Button size="sm" onClick={()=> openSessionDetail(s)}>Details</Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-sm text-muted-foreground">No upcoming sessions. Use the Book New Session button to create one.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-6">
                    {selectedPatient ? (
                        <div className="space-y-4">
                            <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>← Back to Client List</Button>
                            <div className="grid gap-6 lg:grid-cols-2">
                                <div>
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
                                                        <Avatar className="h-8 w-8"><AvatarImage src={patient.avatarUrl} alt={patient.name} /><AvatarFallback>{patient.initials}</AvatarFallback></Avatar>
                                                        <span className="font-medium">{patient.displayName || patient.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-semibold text-primary">€150.00</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">1 Active</Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">2 days ago</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="outline" size="sm" onClick={() => handleSelectPatientForBilling(patient)}>
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

            {/* Client Profile Dialog (small) */}
            <Dialog open={!!selectedPatient && activeTab !== 'billing' && activeTab !== 'sessions'} onOpenChange={(open) => { if (!open) setSelectedPatient(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Client Profile</DialogTitle>
                        <DialogDescription>{selectedPatient ? selectedPatient.name : ''}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {selectedPatient && (
                            <>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12"><AvatarImage src={selectedPatient.avatarUrl} /><AvatarFallback>{selectedPatient.initials}</AvatarFallback></Avatar>
                                    <div>
                                        <div className="font-medium">{selectedPatient.name}</div>
                                        <div className="text-sm text-muted-foreground">{selectedPatient.email}</div>
                                    </div>
                                </div>
                                <div>
                                    <Label>Tags</Label>
                                    <div className="flex gap-2 flex-wrap mt-2">
                                        {(clientTags[selectedPatient.id] || []).map(t => (
                                            <Badge key={t} className="cursor-pointer" onClick={() => { handleRemoveClientTag(selectedPatient.id, t); persistClientTags(selectedPatient.id, (clientTags[selectedPatient.id] || []).filter(x=>x!==t)); }}>{t} ×</Badge>
                                        ))}
                                        <Button size="sm" variant="ghost" onClick={() => { handleAddClientTag(selectedPatient.id, 'VIP'); persistClientTags(selectedPatient.id, Array.from(new Set([...(clientTags[selectedPatient.id] || []), 'VIP']))); }}>+ VIP</Button>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <Label>Account</Label>
                                    <div className="mt-2">
                                        <Button size="sm" variant="ghost" onClick={async () => {
                                            if (!selectedPatient) return;
                                            try {
                                                const info = await fxService.getBalanceForClient(selectedPatient.id);
                                                setClientBalanceInfo(info || { balance: 0, transactions: [] });
                                            } catch (e) {
                                                setClientBalanceInfo({ balance: 0, transactions: [] });
                                            }
                                        }}>Load Balance & Transactions</Button>
                                        {clientBalanceInfo && (
                                            <div className="mt-2">
                                                <div className="font-medium">Balance: €{(clientBalanceInfo.balance ?? 0).toFixed(2)}</div>
                                                <div className="text-sm text-muted-foreground">Recent transactions:</div>
                                                <div className="mt-2 max-h-32 overflow-auto">
                                                    {(clientBalanceInfo.transactions || []).map((t:any) => (
                                                        <div key={t.id} className="flex items-center justify-between py-1 border-b text-sm">
                                                            <div>{t.note || t.type || 'Txn'} — €{t.amountEUR?.toFixed?.(2) ?? t.amountEUR}</div>
                                                            <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {(['Admin','Therapist'].includes(currentUser?.role || '')) && (
                                    <div className="mt-4">
                                        <Label>Adjust Balance</Label>
                                        <div className="flex gap-2 mt-2">
                                            <Input type="number" value={adjustingAmount} onChange={(e:any)=>setAdjustingAmount(parseFloat(e.target.value||'0'))} className="w-32" />
                                            <Input value={adjustingNoteLocal} onChange={(e:any)=>setAdjustingNoteLocal(e.target.value)} placeholder="Note" />
                                            <Button onClick={async()=>{
                                                if(!selectedPatient) return;
                                                try{
                                                    const tx = await fxService.applyAdjustment(selectedPatient.id, adjustingAmount, adjustingNoteLocal || undefined);
                                                    toast?.({ title: 'Adjustment applied', description: `€${adjustingAmount} applied.` });
                                                    // refresh balance view
                                                    const info = await fxService.getBalanceForClient(selectedPatient.id);
                                                    setClientBalanceInfo(info || { balance: 0, transactions: [] });
                                                    setAdjustingAmount(0);
                                                    setAdjustingNoteLocal('');
                                                }catch(e){
                                                    toast?.({ variant: 'destructive', title: 'Adjustment failed' });
                                                }
                                            }}>Apply</Button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-3 mt-4">
                                    <div className="flex items-center gap-2">
                                        <Button onClick={() => { setActiveTab('billing'); }}>Open Billing</Button>
                                        <Button variant="outline" onClick={() => { setActiveTab('sessions'); }}>View Sessions</Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" onClick={async ()=>{ if(!selectedPatient) return; const tag = prompt('Enter tag to add'); if(tag){ handleAddClientTag(selectedPatient.id, tag); persistClientTags(selectedPatient.id, Array.from(new Set([...(clientTags[selectedPatient.id]||[]), tag]))); } }}>Add Tag</Button>
                                        <Button size="sm" onClick={()=>{ if(!selectedPatient) return; openSessionNotes(undefined, 'Quick note for '+ selectedPatient.name); }}>Write Note</Button>
                                        <Button size="sm" onClick={()=>{ if(!selectedPatient) return; setBookingPatientId(selectedPatient.id); setIsBookingDialogOpen(true); }}>Schedule Follow-Up</Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Template Dialog */}
            <Dialog open={isEditTemplateOpen} onOpenChange={(o)=>{ if(!o){ setIsEditTemplateOpen(false); setEditingTemplate(null); } else setIsEditTemplateOpen(true); }}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                        <DialogDescription>Edit the template title and content.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3 py-2">
                        <Label>Title</Label>
                        <Input value={editingTemplate?.title || ''} onChange={(e:any)=> setEditingTemplate((t:any)=> ({ ...(t||{}), title: e.target.value }))} />
                        <Label>Content</Label>
                        <Textarea value={editingTemplate?.content || ''} onChange={(e:any)=> setEditingTemplate((t:any)=> ({ ...(t||{}), content: e.target.value }))} className="min-h-[160px]" />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => { setIsEditTemplateOpen(false); setEditingTemplate(null); }}>Cancel</Button>
                        <Button onClick={async () => {
                            if (!editingTemplate) return;
                            const originalId = editingTemplate.id;
                            const newTitle = editingTemplate.title || ('Template ' + new Date().toLocaleString());
                            const newContent = editingTemplate.content || '';
                            try {
                                // create a new template (no update API currently) then delete old
                                await fxService.createTemplate({ title: newTitle, content: newContent, authorId: currentUser?.id });
                                try { await fxService.deleteTemplate(originalId); } catch(e) { /* ignore delete failure */ }
                                await loadTemplates();
                                toast?.({ title: 'Template updated' });
                                setIsEditTemplateOpen(false);
                                setEditingTemplate(null);
                            } catch (e) {
                                toast?.({ variant: 'destructive', title: 'Save failed' });
                            }
                        }}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

                <TabsContent value="settings" className="space-y-6">
                    <Card>
                        <CardHeader className="flex items-center justify-between">
                            <div>
                                <CardTitle>Settings</CardTitle>
                                <CardDescription>Personalize your dashboard and notifications.</CardDescription>
                            </div>
                            {isAdmin && (
                                <Button onClick={() => handleOpenServiceDialog(null)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Service
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label>UI Theme</Label>
                                    <Select value={"light"} onValueChange={() => {}}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">Light</SelectItem>
                                            <SelectItem value="dark">Dark</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Notifications</Label>
                                    <Switch id="notifications" checked={true} onCheckedChange={() => {}} />
                                </div>

                                {/* Services Management */}
                                <div>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Service Management</CardTitle>
                                            <CardDescription>Add, edit or remove services (demo/mock)</CardDescription>
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
                                                    {services.map((svc) => (
                                                        <TableRow key={svc.id}>
                                                            <TableCell className="font-medium">{svc.name}</TableCell>
                                                            <TableCell>{svc.category}</TableCell>
                                                            <TableCell>{svc.durationMinutes} min</TableCell>
                                                            <TableCell>€{svc.priceEUR}</TableCell>
                                                            <TableCell>
                                                                <Badge variant={svc.active ? 'secondary' : 'outline'}>{svc.active ? 'Active' : 'Inactive'}</Badge>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button size="sm" variant="outline" onClick={() => handleOpenServiceDialog(svc)}>Edit</Button>
                                                                {isAdmin && (
                                                                    <Button size="sm" variant="ghost" onClick={() => handleDeleteService(svc.id)}>Delete</Button>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </div>
                                {isAdmin && (
                                    <div>
                                        <Card className="mt-4">
                                            <CardHeader>
                                                <CardTitle>Admin: User Management</CardTitle>
                                                <CardDescription>Manage test users and roles</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>User</TableHead>
                                                            <TableHead>Role</TableHead>
                                                            <TableHead className="text-right">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {(managedUsers || []).map(u => (
                                                            <TableRow key={u.id}>
                                                                <TableCell>{u.displayName || u.email}</TableCell>
                                                                <TableCell>
                                                                    <Select value={u.role || 'Patient'} onValueChange={(v:any)=>{
                                                                        const updated = {...u, role: v};
                                                                        setManagedUsers(prev => prev.map(x => x.id === u.id ? updated : x));
                                                                        // if we're editing the current user, update context
                                                                        if (currentUser?.id === u.id) {
                                                                            setCurrentUser(updated as User);
                                                                        }
                                                                        try { (fxAuth as any).currentUser = updated; } catch (e) { /* ignore if not writable */ }
                                                                    }}>
                                                                        <SelectTrigger className="w-40"><SelectValue placeholder="Role" /></SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Patient">Patient</SelectItem>
                                                                            <SelectItem value="Therapist">Therapist</SelectItem>
                                                                            <SelectItem value="Admin">Admin</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <Button size="sm" variant="ghost" onClick={()=>{ setManagedUsers(prev=> prev.filter(x=> x.id !== u.id)); }}>Remove</Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="test-tools" className="space-y-6">
                    <TestTools isTestMode={true} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Switcher (Test Mode)</CardTitle>
                            <CardDescription>Temporarily change the current user's role for testing.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-2">
                            <Button onClick={() => switchRoleForTest('Patient')}>Patient</Button>
                            <Button onClick={() => switchRoleForTest('Therapist')}>Therapist</Button>
                            <Button onClick={() => switchRoleForTest('Admin')}>Admin</Button>
                        </CardContent>
                    </Card>
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
                {isAdmin && (
                    <TabsContent value="admin" className="space-y-6">
                        <AdminPanel />
                    </TabsContent>
                )}
            </Tabs>

            {/* Confirm Bulk Remove Tags Dialog */}
            <Dialog open={confirmBulkRemoveOpen} onOpenChange={setConfirmBulkRemoveOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Remove Tag</DialogTitle>
                        <DialogDescription>Are you sure you want to remove the tag from the selected clients? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm">Tag to remove: <strong>{bulkTagInput}</strong></p>
                        <p className="text-sm mt-2">Selected clients: {Object.keys(selectedClients).filter(k=> selectedClients[k]).length}</p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={async ()=>{
                            const ids = Object.keys(selectedClients).filter(k=> selectedClients[k]);
                            // capture what we removed for undo
                            const removed: { id: string, removedTags: string[] }[] = [];
                            ids.forEach(id => {
                                const before = clientTags[id] || [];
                                if (before.includes(bulkTagInput)) {
                                    removed.push({ id, removedTags: [bulkTagInput] });
                                }
                                handleRemoveClientTag(id, bulkTagInput);
                                persistClientTags(id, (clientTags[id]||[]).filter(t=>t!==bulkTagInput));
                            });
                            if (removed.length > 0) {
                                setLastBulkRemoved(removed);
                                setUndoVisible(true);
                                // hide undo after timeout
                                setTimeout(()=>{ setUndoVisible(false); setLastBulkRemoved(null); }, 8000);
                            }
                            // clear selection for those ids
                            setSelectedClients(prev => { const copy = { ...prev }; ids.forEach(i=> delete copy[i]); return copy; });
                            setConfirmBulkRemoveOpen(false);
                        }}>Remove Tag from Selected</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Undo Snackbar */}
            {undoVisible && lastBulkRemoved && (
                <div className="fixed right-4 bottom-4 z-50">
                    <div className="bg-gray-800 text-white px-4 py-3 rounded shadow-lg flex items-center gap-4">
                        <div className="text-sm">Removed tag <strong>{bulkTagInput}</strong> from {lastBulkRemoved.length} clients</div>
                        <div className="ml-2">
                            <Button size="sm" onClick={async ()=>{
                                // restore tags
                                lastBulkRemoved.forEach(item => {
                                    const current = clientTags[item.id] || [];
                                    const restored = Array.from(new Set([...(current || []), ...(item.removedTags || [])]));
                                    setClientTags(prev => ({ ...prev, [item.id]: restored }));
                                    persistClientTags(item.id, restored);
                                });
                                setUndoVisible(false);
                                setLastBulkRemoved(null);
                            }}>Undo</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Session Notes Dialog */}
            <Dialog open={isSessionNotesOpen} onOpenChange={setIsSessionNotesOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Session Notes</DialogTitle>
                        <DialogDescription>Add or edit notes for the session.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="session-notes">Notes</Label>
                        <Textarea id="session-notes" placeholder="Enter session notes, observations, and action items..." value={sessionNotes} onChange={(e: any) => setSessionNotes(e.target.value)} className="min-h-[160px]" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={async () => { setIsSavingNotes(true); try { await saveSessionNotes(); } finally { setIsSavingNotes(false); } }} disabled={isSavingNotes}>
                            {isSavingNotes ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : 'Save Notes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Booking Dialog */}
            <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Book New Session</DialogTitle>
                        <DialogDescription>Schedule a new session for the selected patient.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label>Patient</Label>
                            <Select value={bookingPatientId || ''} onValueChange={(v: any) => setBookingPatientId(v)}>
                                <SelectTrigger className="w-full" disabled={currentUser?.role === 'Patient'}><SelectValue placeholder="Select patient" /></SelectTrigger>
                                <SelectContent>
                                    {(patients || []).map((p: any) => (
                                        <SelectItem key={p.id} value={p.id}>{p.displayName || p.name || p.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {currentUser?.role === 'Patient' && <div className="text-xs text-muted-foreground mt-1">Booking will be created for your account.</div>}
                        </div>
                        <div>
                            <Label>Service</Label>
                            <Select value={bookingServiceId || ''} onValueChange={(v: any) => setBookingServiceId(v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select service" /></SelectTrigger>
                                <SelectContent>
                                    {services.map(svc => (
                                        <SelectItem key={svc.id || svc.name} value={svc.id || ''}>{svc.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Therapist</Label>
                            <Select value={bookingTherapistId || ''} onValueChange={(v: any) => setBookingTherapistId(v)}>
                                <SelectTrigger className="w-full" disabled={currentUser?.role === 'Therapist'}><SelectValue placeholder="Select therapist" /></SelectTrigger>
                                <SelectContent>
                                    {((managedUsers || []).filter(u => u.role === 'Therapist')) .map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.displayName || t.email}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {currentUser?.role === 'Therapist' && <div className="text-xs text-muted-foreground mt-1">Booking will be assigned to your therapist account.</div>}
                        </div>
                        <div>
                            <Label>Date & Time</Label>
                            {/* Booking calendar with available hourly slots */}
                            <BookingCalendar value={bookingDateTime} onChange={(isoLocal: string) => setBookingDateTime(isoLocal)} />
                        </div>
                        <div>
                            <Label>Notes</Label>
                            <Textarea value={bookingNotes} onChange={(e: any) => setBookingNotes(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleCreateBooking} disabled={bookingCreating}>
                            {bookingCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Create Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reassign Booking Dialog */}
            <Dialog open={reassignDialogOpen} onOpenChange={setReassignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reassign Booking</DialogTitle>
                        <DialogDescription>Select a therapist to reassign this booking to.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>Therapist</Label>
                        <Select value={reassignTherapistId || ''} onValueChange={(v:any)=>setReassignTherapistId(v)}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select therapist" /></SelectTrigger>
                            <SelectContent>
                                {((managedUsers || []).filter(u => u.role === 'Therapist')).map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.displayName || t.email}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={async()=>{
                            if(!reassignTargetBooking || !reassignTherapistId) return;
                            try{
                                await fxService.updateBooking(reassignTargetBooking, { therapistId: reassignTherapistId });
                                setUpcomingSessions(prev => prev.map(s => s.id === reassignTargetBooking ? ({ ...s, therapist: (managedUsers.find(u=>u.id===reassignTherapistId)?.displayName || reassignTherapistId) }) : s));
                                toast?.({ title: 'Reassigned', description: 'Booking reassigned successfully.' });
                            }catch(e){
                                toast?.({ variant: 'destructive', title: 'Reassign failed' });
                            } finally {
                                setReassignDialogOpen(false);
                                setReassignTargetBooking(null);
                                setReassignTherapistId(null);
                            }
                        }}>Reassign</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Session Assessment Form (Pre/Post) */}
            <SessionAssessmentForm
                open={!!assessmentOpenForSession.sessionId}
                onClose={closeAssessment}
                onSubmit={handleAssessmentSubmit}
                patientName={currentUser?.displayName || currentUser?.email || 'Patient'}
                sessionType={assessmentOpenForSession.sessionType || 'pre'}
                readOnly={!(['Admin','Therapist'].includes(currentUser?.role || ''))}
            />

            {/* Session Detail Dialog */}
            <Dialog open={sessionDetailOpen} onOpenChange={setSessionDetailOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Session Details</DialogTitle>
                        <DialogDescription>{sessionDetailFor ? `${sessionDetailFor.type} on ${format(new Date(sessionDetailFor.date), 'PPP p')}` : ''}</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assessments</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {sessionAssessments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No assessments found for this session.</p>
                                ) : (
                                    sessionAssessments.map(a => (
                                        <div key={a.id} className="border-b py-2">
                                            <div className="text-sm font-medium">{a.data.sessionType} assessment — {new Date(a.createdAt).toLocaleString()}</div>
                                            <pre className="text-xs mt-1 whitespace-pre-wrap">{JSON.stringify(a.data, null, 2)}</pre>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Session Notes</CardTitle>
                                <div className="ml-auto flex items-center gap-2">
                                    <Button size="sm" onClick={()=> saveTemplateFromNotes()}>Save as Template</Button>
                                    <Button size="sm" onClick={()=> exportSessionToPdf(sessionDetailFor)}>Export PDF</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {sessionAssessments.filter(a => a.data?.sessionType === 'note').length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No session notes yet. Use the Notes button to add one.</p>
                                ) : (
                                    sessionAssessments.filter(a => a.data?.sessionType === 'note').map(n => (
                                        <div key={n.id} className="py-2 border-b">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium">{n.authorName || n.authorId ? `By ${n.authorName || n.authorId}` : 'Note'} — {new Date(n.createdAt).toLocaleString()}</div>
                                                <div>
                                                    {(['Therapist','Admin'].includes(currentUser?.role || '')) && (
                                                        <Button size="sm" variant="ghost" onClick={async()=>{
                                                            try{
                                                                await fxService.deleteAssessment(n.id);
                                                                setSessionAssessments(prev => (prev || []).filter(x => x.id !== n.id));
                                                                toast?.({ title: 'Deleted', description: 'Note removed.' });
                                                            }catch(e){
                                                                toast?.({ variant: 'destructive', title: 'Delete failed' });
                                                            }
                                                        }}>Delete</Button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-sm mt-1 whitespace-pre-wrap">{n.content || n.data?.content || JSON.stringify(n.data)}</div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                            <hr className="my-2 border-t" />
                            <CardContent>
                                <div className="text-sm font-medium mb-2">Templates</div>
                                <div className="flex flex-col gap-2">
                                    {templatesList.length === 0 ? <div className="text-sm text-muted-foreground">No templates saved.</div> : (
                                        templatesList.map(t => (
                                            <div key={t.id} className="flex items-center justify-between border rounded p-2">
                                                <div>
                                                    <div className="font-medium">{t.title}</div>
                                                    <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={()=> setSessionNotes((s) => (s ? s + '\n\n' + t.content : t.content))}>Insert</Button>
                                                    <Button size="sm" variant="outline" onClick={() => { setEditingTemplate(t); setIsEditTemplateOpen(true); }}>Edit</Button>
                                                    <Button size="sm" variant="ghost" onClick={async () => {
                                                        if (!confirm('Delete template "' + t.title + '"?')) return;
                                                        try {
                                                            await fxService.deleteTemplate(t.id);
                                                            await loadTemplates();
                                                            toast?.({ title: 'Deleted', description: 'Template removed.' });
                                                        } catch (e) {
                                                            toast?.({ variant: 'destructive', title: 'Delete failed' });
                                                        }
                                                    }}>Delete</Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {sessionTransactions.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">No transactions for this client.</p>
                                ) : (
                                    sessionTransactions.map(t => (
                                        <div key={t.id} className="flex items-center justify-between py-2 border-b">
                                            <div>
                                                <div className="font-medium">€{t.amountEUR.toFixed(2)} — {t.type}</div>
                                                <div className="text-xs text-muted-foreground">{t.note}</div>
                                            </div>
                                            <div className="text-xs text-muted-foreground">{new Date(t.createdAt).toLocaleString()}</div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Activity Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {sessionDetailFor?.userId ? (
                                    <ClientActivityTimeline client={{ id: sessionDetailFor.userId } as any} />
                                ) : (
                                    <p className="text-sm text-muted-foreground">No client linked to this session.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                    <DialogFooter className="flex items-center justify-between">
                        <div>
                            {(['Therapist','Admin'].includes(currentUser?.role || '')) && sessionDetailFor?.userId && (
                                <Button variant="destructive" onClick={async ()=>{
                                    try{
                                        const svc = services.find(x => x.id === bookingServiceId) as any;
                                        const amount = svc?.priceEUR ?? 100;
                                        const tx = await fxService.createChargeForSession(sessionDetailFor!.userId!, sessionDetailFor!.id!, amount, `Charge for ${sessionDetailFor!.type}`);
                                        setSessionTransactions(prev => [tx, ...prev]);
                                        toast?.({ title: 'Session completed', description: `Charged €${Math.abs(tx.amountEUR).toFixed(2)} for session.` });
                                    }catch(e){
                                        toast?.({ variant: 'destructive', title: 'Charge failed', description: 'Could not charge client.' });
                                    }
                                }}>Complete Session & Charge</Button>
                            )}
                        </div>
                        <div>
                            <DialogClose asChild>
                                <Button variant="outline">Close</Button>
                            </DialogClose>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Report Dialog */}
            <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Session Report{selectedPatientForReport ? ` for ${selectedPatientForReport.name}` : ''}</DialogTitle>
                        <DialogDescription>Fill in the patient's ratings and your notes, then generate the report.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label>Report generation is simulated in this demo.</Label>
                        <Textarea placeholder="Professional notes and summary..." className="min-h-[140px]" />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={generateAndSaveReport} disabled={isGeneratingReport}>
                            {isGeneratingReport && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate & Save Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Service Dialog */}
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{serviceForm?.id ? 'Edit Service' : 'Add Service'}</DialogTitle>
                        <DialogDescription>{serviceForm?.id ? `Editing ${serviceForm?.name}` : 'Create a new service'}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label>Name</Label>
                            <Input value={serviceForm?.name || ''} onChange={(e: any) => handleServiceFormChange('name', e.target.value)} />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <Select value={(serviceForm?.category as any) || 'Core'} onValueChange={(v: any) => handleServiceFormChange('category', v)}>
                                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Core">Core</SelectItem>
                                    <SelectItem value="Personalized">Personalized</SelectItem>
                                    <SelectItem value="360° Component">360° Component</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Duration (min)</Label>
                                <Input type="number" value={serviceForm?.durationMinutes || 0} onChange={(e: any) => handleServiceFormChange('durationMinutes', parseInt(e.target.value || '0', 10))} />
                            </div>
                            <div>
                                <Label>Price (€)</Label>
                                <Input type="number" value={serviceForm?.priceEUR || 0} onChange={(e: any) => handleServiceFormChange('priceEUR', parseFloat(e.target.value || '0'))} />
                            </div>
                        </div>
                        <div>
                            <Label>Short Description</Label>
                            <Textarea value={serviceForm?.descriptionShort || ''} onChange={(e: any) => handleServiceFormChange('descriptionShort', e.target.value)} />
                        </div>
                        <div>
                            <Label>Long Description</Label>
                            <Textarea value={serviceForm?.descriptionLong || ''} onChange={(e: any) => handleServiceFormChange('descriptionLong', e.target.value)} className="min-h-[120px]" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch checked={serviceForm?.active ?? true} onCheckedChange={(v: any) => handleServiceFormChange('active', v)} />
                            <Label>Active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button onClick={handleSaveService}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function GoalJournalSection({ userId }: { userId?: string | null }) {
    const [roadmapText, setRoadmapText] = useState<string | null>(null);
    const [journalText, setJournalText] = useState<string | null>(null);
    const [loadingRoadmap, setLoadingRoadmap] = useState(false);
    const [loadingJournal, setLoadingJournal] = useState(false);
    const toast = useToast()?.toast;

    const generateRoadmap = async () => {
        setLoadingRoadmap(true);
        try {
            const res = await fxService.generateAIReport(userId || 'user-unknown', 'Summarize goals and propose roadmap');
            const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
            setRoadmapText(typeof ai === 'string' ? ai : JSON.stringify(ai));
            toast?.({ title: 'Roadmap generated' });
        } catch (e) {
            toast?.({ variant: 'destructive', title: 'AI unavailable' });
        } finally { setLoadingRoadmap(false); }
    };

    const generateJournal = async () => {
        setLoadingJournal(true);
        try {
            const res = await fxService.generateAIReport(userId || 'user-unknown', 'Summarize recent journal entries');
            const ai = Array.isArray(res) ? (res[1]?.content || res[1]) : (res as any)?.content || res;
            setJournalText(typeof ai === 'string' ? ai : JSON.stringify(ai));
            toast?.({ title: 'Journal summary generated' });
        } catch (e) {
            toast?.({ variant: 'destructive', title: 'AI unavailable' });
        } finally { setLoadingJournal(false); }
    };

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Goal Roadmap</CardTitle>
                    <CardDescription>AI-driven goals, milestones and progress</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">AI-generated summary of client goals and suggested milestones will appear here. Click Generate to analyze session history and set next steps.</p>
                        <div>
                            <Button size="sm" onClick={generateRoadmap} disabled={loadingRoadmap}>{loadingRoadmap ? 'Generating…' : 'Generate'}</Button>
                        </div>
                    </div>
                    {roadmapText && <pre className="whitespace-pre-wrap text-sm bg-muted/20 p-3 rounded">{roadmapText}</pre>}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Journal Insights</CardTitle>
                    <CardDescription>AI summaries and illustrations for client journals</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">AI will summarize recent journal entries and surface trends. This integrates with session notes and progress charts.</p>
                        <div>
                            <Button size="sm" onClick={generateJournal} disabled={loadingJournal}>{loadingJournal ? 'Summarizing…' : 'Summarize'}</Button>
                        </div>
                    </div>
                    {journalText && <pre className="whitespace-pre-wrap text-sm bg-muted/20 p-3 rounded">{journalText}</pre>}
                </CardContent>
            </Card>
        </div>
    );
}

export default function TherapistDashboardPage() {
    return (
        <AuthProvider>
            <TherapistDashboardInner />
        </AuthProvider>
    );
}
    
