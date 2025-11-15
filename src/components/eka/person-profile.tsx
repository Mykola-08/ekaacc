'use client';

import { Button, Card } from '@/components/keep';
import React, { useEffect, useState } from 'react';
import fxService from '@/lib/fx-service';
;
;
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { useMemo } from 'react';

export default function PersonProfile({ userId }: { userId: string }) {
  const [person, setPerson] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [hiddenNotes, setHiddenNotes] = useState<string>('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const { appUser: currentUser } = useAuth();
  const { toast } = useToast();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPerson();
  }, [userId]);

  // Precompute timeline items with useMemo so the hook order is stable across renders
  const timelineItems = useMemo(() => {
    const items: any[] = [];
    bookings.forEach(b => items.push({ kind: 'booking', ts: new Date(b.date).getTime(), payload: b }));
    reports.forEach(r => items.push({ kind: 'report', ts: new Date(r.createdAt || r.created_at || Date.now()).getTime(), payload: r }));
    items.sort((a, b) => b.ts - a.ts);
    return items;
  }, [bookings, reports]);

  const loadPerson = async () => {
    setLoading(true);
    try {
      const users: any[] = await fxService.getUsers();
      const found = users.find(u => u.id === userId || u.uid === userId);
      setPerson(found || null);
      setTags(found?.tags || []);
      setHiddenNotes(found?.hiddenNotes || '');
      // load bookings and reports (mock-first)
      let bookingList: any[] = [];
      try {
        bookingList = await fxService.getBookingsForUser(found?.id || userId, {
          email: found?.email,
          phone: found?.phoneNumber || (found?.profile ? found?.profile.phone : undefined),
        });
        setBookings(bookingList || []);
      } catch (e) {
        console.warn('Unable to load bookings for profile', e);
        bookingList = [];
        setBookings([]);
      }

      // mock reports are available in mock-data; in production use assessments or reports collection
      try {
        // try loading reports via fxService.generateAIReport hook (or assessments) - fallback to empty
        // There's no fxService.getReports, so try to fetch assessments for session ids from bookings
        const repList: any[] = [];
        for (const b of bookingList) {
          if (!b?.sessionId) continue;
          try {
            const r = await fxService.getAssessmentsForSession(b.sessionId);
            if (r && r.length) {
              repList.push(...r.map((x: any) => ({ ...x, type: 'assessment', sourceSession: b.sessionId })));
            }
          } catch (e) {
            console.debug('No assessments for session', b.sessionId, e);
          }
        }
        setReports(repList);
      } catch (e) {
        console.warn('Unable to load reports timeline', e);
        setReports([]);
      }
    } catch (e) {
      console.error('loadPerson', e);
    } finally { setLoading(false); }
  };

  const runAi = async () => {
    if (!person) return;
    setAiReport(null);
    try {
      const res = await fxService.generateAIReport(person.id || person.uid, `Summarize preferences, problems, recommended next steps and prioritize issues for ${person.displayName || person.email || person.id}`);
      setAiReport(res);
    } catch (e: any) {
      setAiReport({ error: e.message || String(e) });
    }
  };

  const saveHiddenNote = async () => {
    if (!person) return;
    try {
      await fxService.updateUser(person.id || person.uid, { hiddenNotes });
      toast({ title: 'Saved', description: 'Hidden notes saved.' });
    } catch (e) { console.error(e); toast({ title: 'Error', description: 'Failed to save hidden notes.' }); }
  };

  const toggleTag = async (t: string) => {
    const next = tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t];
    setTags(next);
    if (!person) return;
    try { await fxService.updateUser(person.id || person.uid, { tags: next }); } catch (e) { console.error(e); }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!person) return <div className="p-4">Person not found</div>;

  const canSeeHidden = currentUser?.role === 'Therapist' || currentUser?.role === 'Admin' || (typeof window !== 'undefined' && (localStorage.getItem('eka_persona') === 'Therapist' || localStorage.getItem('eka_persona') === 'Admin'));

  return (
    <div className="space-y-4 p-4">
      <Card>
        <div className="p-4">
          <h2 className="text-xl font-semibold">{person.displayName || person.name || person.email}</h2>
          <p className="text-sm text-muted-foreground">{person.email}</p>
          <div className="mt-3 flex gap-2">
            <Button onClick={runAi}>Generate AI Summary</Button>
            <Button variant="outline" onClick={() => window.open(`/therapist/bookings?client=${person.id}`, '_self')}>View Bookings</Button>
            <Button variant="ghost" onClick={async () => { 
              const userId = person.id || person.uid;
              await fxService.createNotification({ userId, title: 'Pinned note', body: `Therapist pinned note for ${userId}` }); 
              toast({ title: 'Pinned', description: 'Pinned note created' }); 
            }}>Pin Note</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="font-medium">Preferences & Goals</h3>
            <p className="text-sm mt-2">{person.personalization?.goals || person.goal?.targetSessions ? `Target sessions: ${person.goal?.targetSessions || '?'} — Completed: ${person.goal?.currentSessions || 0}` : 'No personalization data'}</p>
            <p className="text-sm mt-2">Preferences: {person.personalization?.preferences || '-'}</p>
            <p className="text-sm mt-2">Languages: {person.preferredLanguage || '-'}</p>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="font-medium">AI Recommendations</h3>
            {!aiReport && <p className="text-sm text-muted-foreground">No AI summary yet.</p>}
            {aiReport && aiReport.error && <pre className="text-sm text-red-500">{aiReport.error}</pre>}
            {aiReport && !aiReport.error && (
              <div className="text-sm">
                <pre className="whitespace-pre-wrap">{JSON.stringify(aiReport, null, 2)}</pre>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="font-medium">Tags / Flags</h3>
            <div className="mt-2 flex gap-2 flex-wrap">
              {['high-risk','needs-transport','language-needs','vip','donor','donation-seeker'].map(t => (
                <Button key={t} size="sm" variant={tags.includes(t) ? 'default' : 'ghost'} onClick={() => toggleTag(t)}>{t}</Button>
              ))}
            </div>
            {canSeeHidden && (
              <div className="mt-3">
                <h4 className="text-sm font-medium">Hidden notes</h4>
                <textarea className="w-full p-2 mt-2 border rounded" value={hiddenNotes} onChange={(e) => setHiddenNotes(e.target.value)} />
                <div className="mt-2 flex gap-2">
                  <Button onClick={saveHiddenNote}>Save</Button>
                </div>
              </div>
            )}
            {!canSeeHidden && <p className="text-sm text-muted-foreground mt-3">Hidden notes are only visible to therapists and admins.</p>}
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="font-medium">Donor / Donation Seeker Profile</h3>
            <p className="text-sm mt-2">Donor: {person.isDonor ? 'Yes' : 'No'} — Donation seeker: {person.isDonationSeeker ? 'Yes' : 'No'}</p>
            <p className="text-sm mt-2">Total Donated: {person.totalDonated || 0}€</p>
            <p className="text-sm mt-2">Priority (AI): {person.priority || '—'}</p>
            {canSeeHidden ? (
              <div className="mt-3 flex gap-2">
                <Button onClick={async () => { await fxService.createInvoice(person.id || person.uid, 50, 'Donation request'); toast({ title: 'Invoice created', description: 'Donation invoice (mock) created.' }); }}>Create Donation Invoice</Button>
                <Button variant="outline" onClick={async () => { 
                  const userId = person.id || person.uid;
                  await fxService.createNotification({ userId, title: 'Donation request created', body: `Donation invoice for ${userId}` }); 
                  toast({ title: 'Notified', description: 'Donor notification created.' }); 
                }}>Notify Donors</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">Donation controls are visible to therapists and admins only.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Timeline: bookings and reports */}
      <Card>
        <div className="p-4">
          <h3 className="font-medium mb-2">Timeline</h3>
          {bookings.length === 0 && reports.length === 0 && <p className="text-sm text-muted-foreground">No recent activity</p>}
          <ul className="space-y-2">
            {timelineItems.map(item => {
              if (item.kind === 'booking') {
                const b = item.payload;
                const text = b.notes || '';
                const isLong = text.length > 240;
                const expanded = !!expandedIds[b.id];
                return (
                  <li key={b.id} className="p-2 border rounded">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium">Booking — {new Date(b.date).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Status: {b.status} — Therapist: {b.therapistId || b.therapist}</div>
                        {text && (
                          <div className="mt-2 text-sm">
                            {isLong && !expanded ? `${text.slice(0,240)}... ` : text}
                            {isLong && (
                              <button className="ml-2 text-blue-600 underline text-sm" onClick={() => setExpandedIds(prev => ({ ...prev, [b.id]: !prev[b.id] }))}>{expanded ? 'Collapse' : 'Expand'}</button>
                            )}
                          </div>
                        )}

                        <div className="mt-2">
                          <h4 className="text-sm font-medium">Session notes</h4>
                          <SessionNotes booking={b} personId={person.id} showToast={toast} />
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs text-muted-foreground">ID: {b.id}</div>
                        <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard?.writeText(b.id); toast({ title: 'Copied', description: 'Booking id copied to clipboard' }); }}>Copy id</Button>
                        <Button size="sm" variant="ghost" onClick={() => window.open(`/therapist/bookings?client=${person.id}&booking=${b.id}`, '_self')}>Open</Button>
                      </div>
                    </div>
                  </li>
                );
              }

              // report
              const r = item.payload;
              const text = r.notes || JSON.stringify(r.data || r);
              const idKey = r.id || `${r.type}-${r.createdAt}`;
              const isLong = (text || '').length > 240;
              const expanded = !!expandedIds[idKey];
              return (
                <li key={idKey} className="p-2 border rounded">
                  <div className="font-medium">{r.type || 'Report'} — {new Date(r.createdAt || r.created_at || Date.now()).toLocaleDateString()}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {isLong && !expanded ? `${text.slice(0,240)}... ` : text}
                    {isLong && (
                      <button className="ml-2 text-blue-600 underline text-sm" onClick={() => setExpandedIds(prev => ({ ...prev, [idKey]: !prev[idKey] }))}>{expanded ? 'Collapse' : 'Expand'}</button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>
    </div>
  );
}

function SessionNotes({ booking, personId, showToast }: { booking: any; personId: string; showToast?: any }) {
  const [notes, setNotes] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const rs = await fxService.getAssessmentsForSession(booking.sessionId);
        if (!mounted) return;
        setNotes(rs || []);
      } catch (e) {
        setNotes([]);
      } finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [booking.sessionId]);

  if (loading) return <div className="text-sm text-muted-foreground">Loading notes...</div>;
  if (!notes || notes.length === 0) return <div className="text-sm text-muted-foreground">No session notes</div>;

  return (
    <div className="space-y-2 mt-2">
      {notes.map(n => (
        <div key={n.id} className="p-2 border rounded bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{n.authorId ? `Note by ${n.authorId}` : 'Session note'}</div>
            <div className="text-xs text-muted-foreground">{new Date(n.createdAt || Date.now()).toLocaleString()}</div>
          </div>
          <div className="mt-1 text-sm">{n.content || JSON.stringify(n.data || n)}</div>
          {n.attachments && n.attachments.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium">Attachments</div>
              <ul className="text-sm list-disc ml-4 mt-1">
                {n.attachments.map((a: any, idx: number) => (
                  <li key={idx}><a className="text-blue-600 hover:underline" href={a.url} target="_blank" rel="noreferrer">{a.name || a.url}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
