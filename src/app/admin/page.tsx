"use client";

import { useData } from "@/context/unified-data-context";
import { RoleChanger } from "@/components/ui/role-changer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from '@/hooks/use-toast';
import fxService from '@/lib/fx-service';
import type { User, Session } from "@/lib/types";

// Square API integration
const SQUARE_APP_ID = "sandbox-sq0idb-S5dB2M3UZBbtySrULtdMMQ"; // Your sandbox app ID
const SQUARE_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SQUARE_ACCESS_TOKEN || ""; // Set in .env.local
const SQUARE_API_BASE = process.env.NODE_ENV === "production"
  ? "https://connect.squareup.com/v2"
  : "https://connect.squareupsandbox.com/v2";

// Test Square API connectivity
async function testSquareAPI() {
  try {
    const res = await fetch(`${SQUARE_API_BASE}/appointments`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Square API error: " + res.status);
    return "Square API is reachable.";
  } catch (e: any) {
    return "Square API test failed: " + e.message;
  }
}

// List all Square appointments
async function listSquareAppointments() {
  const res = await fetch(`${SQUARE_API_BASE}/appointments`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) throw new Error("Failed to list Square appointments");
  return await res.json();
}

async function fetchSquareAppointment(squareAppointmentId: string) {
  if (!squareAppointmentId) return null;
  const res = await fetch(`${SQUARE_API_BASE}/appointments/${squareAppointmentId}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) return null;
  return await res.json();
}

async function createSquareAppointment(session: Session) {
  // See https://developer.squareup.com/reference/square/appointments-api/create-appointment
  const res = await fetch(`${SQUARE_API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      // Map session fields to Square appointment fields
      start_at: `${session.date}T${session.time}`,
      location_id: session.location,
      customer_id: session.userId,
      team_member_id: session.therapist,
      service_variation_id: session.type,
      note: session.notes
    })
  });
  if (!res.ok) throw new Error("Failed to create Square appointment");
  return await res.json();
}

async function updateSquareAppointment(session: Session) {
  // You need the Square appointment ID, which should be stored in session
  if (!session.squareAppointmentId) return;
  const res = await fetch(`${SQUARE_API_BASE}/appointments/${session.squareAppointmentId}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      start_at: `${session.date}T${session.time}`,
      location_id: session.location,
      team_member_id: session.therapist,
      service_variation_id: session.type,
      note: session.notes,
      status: session.status
    })
  });
  if (!res.ok) throw new Error("Failed to update Square appointment");
  return await res.json();
}

async function cancelSquareAppointment(session: Session, reason: string) {
  if (!session.squareAppointmentId) return;
  const res = await fetch(`${SQUARE_API_BASE}/appointments/${session.squareAppointmentId}/cancel`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${SQUARE_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      reason
    })
  });
  if (!res.ok) throw new Error("Failed to cancel Square appointment");
  return await res.json();
}

export default function AdminDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewSession, setViewSession] = useState<Session | null>(null);
  const [squareDetails, setSquareDetails] = useState<any>(null);
  const [squareError, setSquareError] = useState<string>("");
  const [squareAppointments, setSquareAppointments] = useState<any[]>([]);
  const [showSquareAppointments, setShowSquareAppointments] = useState(false);
  const [squareTestResult, setSquareTestResult] = useState<string>("");
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editType, setEditType] = useState("");
  const [editTherapist, setEditTherapist] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [cancelSession, setCancelSession] = useState<Session | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [editUserRole, setEditUserRole] = useState<User | null>(null);
  const [newUserRole, setNewUserRole] = useState("");
  const [recentlyCanceled, setRecentlyCanceled] = useState<Session | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Load sessions and users on mount (non-blocking)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sess, users] = await Promise.all([
          fxService.getAllBookings().catch(() => []),
          fxService.getUsers().catch(() => []),
        ]);
        setSessions(sess);
        setAllUsers(users);
      } catch (error) {
        console.error('Failed to load admin data:', error);
        toast({ title: 'Error', description: 'Failed to load admin data', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [toast]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <RoleChanger />
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="mb-4 p-2 bg-gray-50 border rounded">
        <b>Square Sandbox App ID:</b> <span className="font-mono">{SQUARE_APP_ID}</span>
      </div>
      <Card className="mb-6 p-4">
        <div className="mb-4">
          <Button size="sm" onClick={async () => {
            setSquareTestResult("Testing Square API...");
            const result = await testSquareAPI();
            setSquareTestResult(result);
          }}>Test Square API</Button>
          {squareTestResult && <div className="mt-2 text-xs text-blue-700">{squareTestResult}</div>}
        </div>
        <div className="mb-4">
          <Button size="sm" onClick={async () => {
            setSquareError("");
            setShowSquareAppointments(true);
            try {
              const result = await listSquareAppointments();
              setSquareAppointments(result?.appointments || []);
            } catch (e) {
              setSquareError("Failed to fetch Square appointments");
            }
          }}>Sync with Square (List Appointments)</Button>
          {squareError && <div className="text-red-600 mt-2">{squareError}</div>}
        </div>
        {showSquareAppointments && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <b>Square Appointments:</b>
            {squareAppointments.length === 0 ? (
              <div>No appointments found.</div>
            ) : (
              <ul className="text-xs max-h-64 overflow-y-auto">
                {squareAppointments.map(app => (
                  <li key={app.id} className="border-b py-1">
                    <b>ID:</b> {app.id} <b>Start:</b> {app.start_at} <b>Status:</b> {app.status}
                  </li>
                ))}
              </ul>
            )}
            <Button size="sm" className="mt-2" onClick={() => setShowSquareAppointments(false)}>Hide</Button>
          </div>
        )}
        <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
        <ul>
          {(allUsers as User[]).map(user => (
            <li key={user.id} className="flex justify-between items-center py-2 border-b">
              <span className="cursor-pointer" onClick={() => setUserDetails(user)}>{user.name} ({user.role})</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditUserRole(user)}>Change Role</Button>
                <Button size="sm" variant="outline" onClick={() => setUserDetails(user)}>Details</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-2">All Bookings</h2>
        <input
          type="text"
          placeholder="Search by therapist, type, location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-4 border rounded px-2 py-1 w-full"
        />
        <ul>
          {sessions
            .filter(session =>
              session.therapist.toLowerCase().includes(search.toLowerCase()) ||
              session.type.toLowerCase().includes(search.toLowerCase()) ||
              (session.location ? session.location.toLowerCase().includes(search.toLowerCase()) : false)
            )
            .map(session => (
              <li key={session.id} className="flex justify-between items-center py-2 border-b">
                <span>{session.date} - {session.therapist} - {session.type} - {session.location}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewSession(session)}>View</Button>
                  <Button size="sm" variant="outline" onClick={async () => {
                    setEditSession(session);
                    setEditDate(session.date);
                    setEditTime(session.time);
                    setEditType(session.type);
                    setEditTherapist(session.therapist);
                    setEditLocation(session.location ?? "");
                    setEditStatus(session.status);
                    setEditNotes(session.notes || "");
                    // Optionally fetch latest Square appointment details here
                  }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setCancelSession(session)}>Cancel</Button>
                </div>
              </li>
            ))}
        </ul>
        {/* Example: Add Booking Button for Admin */}
        <div className="mt-4">
          <Button size="sm" onClick={async () => {
            // Example new session data (replace with your booking form logic)
            const newSession: Session = {
              id: Math.random().toString(36).slice(2),
              date: new Date().toISOString().slice(0,10),
              time: "10:00",
              type: "Therapy",
              therapist: "Therapist Name",
              therapistAvatarUrl: "",
              location: "Location",
              status: "Upcoming",
              notes: "",
              duration: 60,
              userId: "current-user"
            };
              try {
              const result = await createSquareAppointment(newSession);
              // Store Square appointment ID
              const squareAppointmentId = result?.appointment?.id || result?.id;
              const persisted = { ...newSession, squareAppointmentId };
              setSessions([...sessions, persisted]);
              // Persist in app via fxService (mock-first)
              try {
                await fxService.createBooking(String(newSession.userId || 'unknown'), String(newSession.therapist || 'therapist1'), `${newSession.date}T${newSession.time}`, newSession.notes || '');
              } catch (e) {
                // Non-fatal: show toast but keep UI state
                toast({ title: 'Persist error', description: 'Failed to persist booking to app backend: ' + String(e) });
              }
              toast({ title: 'Booking created', description: 'Booking created and synced with Square.' });
            } catch (err: any) {
              toast({ title: 'Square error', description: 'Failed to create Square appointment: ' + (err?.message || String(err)) });
            }
          }}>Add Booking (Demo)</Button>
        </div>
        {recentlyCanceled && (
          <div className="mt-4 p-2 bg-yellow-100 border rounded flex justify-between items-center">
            <span>Booking canceled. <b>Undo?</b></span>
            <Button size="sm" onClick={() => {
              setSessions([...sessions, recentlyCanceled]);
              setRecentlyCanceled(null);
            }}>Restore</Button>
          </div>
        )}
      </Card>
      {/* View Session Modal */}
      {viewSession && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <h3 className="text-lg font-bold mb-2">Session Details</h3>
            <div className="mb-2">Date: {viewSession.date}</div>
            <div className="mb-2">Time: {viewSession.time}</div>
            <div className="mb-2">Type: {viewSession.type}</div>
            <div className="mb-2">Therapist: {viewSession.therapist}</div>
            <div className="mb-2">Location: {viewSession.location}</div>
            <div className="mb-2">Status: {viewSession.status}</div>
            <div className="mb-2">Notes: {viewSession.notes}</div>
            {viewSession.squareAppointmentId && (
              <div className="mb-2">
                <b>Square Appointment ID:</b> {viewSession.squareAppointmentId}
                <Button size="sm" className="ml-2" onClick={async () => {
                  setSquareError("");
                  setSquareDetails(null);
                  try {
                    const details = await fetchSquareAppointment(viewSession.squareAppointmentId!);
                    setSquareDetails(details);
                  } catch (e) {
                    setSquareError("Failed to fetch Square appointment");
                  }
                }}>Fetch Square Details</Button>
              </div>
            )}
            {squareDetails && (
              <div className="mb-2 p-2 bg-gray-100 rounded">
                <b>Square Details:</b>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(squareDetails, null, 2)}</pre>
              </div>
            )}
            {squareError && (
              <div className="mb-2 text-red-600">{squareError}</div>
            )}
            <Button onClick={() => {
              setViewSession(null);
              setSquareDetails(null);
              setSquareError("");
            }} className="mt-4">Close</Button>
          </div>
        </div>
      )}

      {/* Edit Session Modal */}
      {editSession && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <h3 className="text-lg font-bold mb-2">Edit Session</h3>
            <label className="block mb-2">Date:
              <input type="date" value={editDate.slice(0,10)} onChange={e => setEditDate(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <label className="block mb-2">Time:
              <input type="text" value={editTime} onChange={e => setEditTime(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <label className="block mb-2">Type:
              <input type="text" value={editType} onChange={e => setEditType(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <label className="block mb-2">Therapist:
              <input type="text" value={editTherapist} onChange={e => setEditTherapist(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <label className="block mb-2">Location:
              <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <label className="block mb-2">Status:
              <input type="text" value={editStatus} onChange={e => setEditStatus(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <label className="block mb-2">Notes:
              <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <div className="flex gap-2 mt-4">
              <Button onClick={async () => {
                setSquareError("");
                let squareStatus = "";
                const updatedSessions = sessions.map(s => {
                  if (s.id !== editSession.id) return s;
                  const allowedStatus = ["Upcoming", "Completed", "Canceled"];
                  const safeStatus = allowedStatus.includes(editStatus) ? editStatus : "Upcoming";
                  const updated = {
                    ...s,
                    date: editDate,
                    time: editTime,
                    type: editType,
                    therapist: editTherapist,
                    location: editLocation,
                    status: safeStatus as "Upcoming" | "Completed" | "Canceled",
                    notes: editNotes
                  };
                  // Update Square appointment
                  updateSquareAppointment(updated)
                    .then(() => { squareStatus = "Square updated successfully."; setSquareError(""); })
                    .catch(e => { squareStatus = "Square update failed."; setSquareError(squareStatus); });
                  return updated;
                });
                setSessions(updatedSessions);
                // Persist update via fxService
                try {
                  await fxService.updateBooking(editSession.id, { date: editDate, time: editTime, type: editType, therapist: editTherapist, location: editLocation, status: editStatus, notes: editNotes });
                } catch (e) {
                  toast({ title: 'Persist error', description: 'Failed to persist booking update: ' + String(e) });
                }
                setEditSession(null);
                if (squareStatus) toast({ title: 'Square', description: squareStatus });
              }}>Save</Button>
              <Button variant="outline" onClick={() => setEditSession(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Session Modal */}
      {cancelSession && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <h3 className="text-lg font-bold mb-2">Cancel Booking</h3>
            <div className="mb-2">Are you sure you want to cancel this booking?</div>
            <label className="block mb-2">Reason:
              <input type="text" value={cancelReason} onChange={e => setCancelReason(e.target.value)} className="border rounded px-2 py-1 w-full" />
            </label>
            <div className="flex gap-2 mt-4">
              <Button variant="destructive" onClick={async () => {
                setSquareError("");
                let squareStatus = "";
                setSessions(sessions.filter(s => s.id !== cancelSession.id));
                setRecentlyCanceled(cancelSession);
                // Cancel Square appointment
                if (cancelSession) {
                  await cancelSquareAppointment(cancelSession, cancelReason)
                    .then(() => { squareStatus = "Square canceled successfully."; setSquareError(""); })
                    .catch(e => { squareStatus = "Square cancel failed."; setSquareError(squareStatus); });
                  // Persist cancellation in app backend
                  try {
                    await fxService.cancelBooking(cancelSession.id);
                  } catch (e) {
                    toast({ title: 'Persist error', description: 'Failed to persist booking cancellation: ' + String(e) });
                  }
                }
                setCancelSession(null);
                setCancelReason("");
                if (squareStatus) toast({ title: 'Square', description: squareStatus });
              }}>Confirm Cancel</Button>
              <Button variant="outline" onClick={() => setCancelSession(null)}>Back</Button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {userDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <h3 className="text-lg font-bold mb-2">User Details</h3>
            <div className="mb-2">Name: {userDetails.name}</div>
            <div className="mb-2">Email: {userDetails.email}</div>
            <div className="mb-2">Role: {userDetails.role}</div>
            <div className="mb-2">ID: {userDetails.id}</div>
            <Button onClick={() => setUserDetails(null)} className="mt-4">Close</Button>
          </div>
        </div>
      )}

      {/* Edit User Role Modal */}
      {editUserRole && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <h3 className="text-lg font-bold mb-2">Change User Role</h3>
            <label className="block mb-2">Role:
              <select value={newUserRole || editUserRole.role} onChange={e => setNewUserRole(e.target.value)} className="border rounded px-2 py-1 w-full">
                {[
                  "User",
                  "Patient",
                  "Therapist",
                  "Donor",
                  "Donation Receiver",
                  "Admin",
                  "Student",
                  "Office Workers",
                  "Athletes",
                  "Artists",
                  "Musicians",
                  "Bronze Elite",
                  "Silver Elite",
                  "Gold Elite"
                ].map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </label>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => {
                // This would update the user role in backend; here we just close modal
                setEditUserRole(null);
                setNewUserRole("");
              }}>Save</Button>
              <Button variant="outline" onClick={() => setEditUserRole(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
