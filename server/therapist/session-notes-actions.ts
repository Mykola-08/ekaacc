'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SessionNoteSchema = z.object({
  clientId: z.string().uuid().optional().nullable(),
  bookingId: z.string().uuid().optional().nullable(),
  sessionDate: z.string().min(1, 'Session date is required'),
  durationMinutes: z.coerce.number().int().min(15).max(240).optional(),
  sessionType: z.string().optional().nullable(),
  initialMood: z.coerce.number().int().min(1).max(10).optional().nullable(),
  finalMood: z.coerce.number().int().min(1).max(10).optional().nullable(),
  subjective: z.string().optional().nullable(),
  objective: z.string().optional().nullable(),
  assessment: z.string().optional().nullable(),
  plan: z.string().optional().nullable(),
  techniquesUsed: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  isDraft: z.boolean().optional(),
});

type SessionNoteInput = z.infer<typeof SessionNoteSchema>;

async function requireTherapist() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, profile: null, error: 'Unauthorized' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('auth_id', user.id)
    .single();

  if (!profile || (profile.role !== 'therapist' && profile.role !== 'admin')) {
    return { supabase, profile: null, error: 'Forbidden: therapist role required' };
  }

  return { supabase, profile, error: null };
}

export async function saveSessionNote(input: SessionNoteInput) {
  const { supabase, profile, error: authError } = await requireTherapist();
  if (authError || !profile) return { success: false, error: authError };

  const validated = SessionNoteSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Validation failed' };
  }

  const d = validated.data;

  const { data, error } = await supabase
    .from('session_notes')
    .insert({
      therapist_id: profile.id,
      client_id: d.clientId || null,
      booking_id: d.bookingId || null,
      session_date: d.sessionDate,
      duration_minutes: d.durationMinutes || 60,
      session_type: d.sessionType || null,
      initial_mood: d.initialMood || null,
      final_mood: d.finalMood || null,
      subjective: d.subjective || null,
      objective: d.objective || null,
      assessment: d.assessment || null,
      plan: d.plan || null,
      techniques_used: d.techniquesUsed || [],
      tags: d.tags || [],
      is_draft: d.isDraft ?? false,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving session note:', error);
    return { success: false, error: 'Failed to save session note' };
  }

  revalidatePath('/therapist/session-notes');
  return { success: true, noteId: data.id };
}

export async function updateSessionNote(noteId: string, input: Partial<SessionNoteInput>) {
  const { supabase, profile, error: authError } = await requireTherapist();
  if (authError || !profile) return { success: false, error: authError };

  const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

  if (input.clientId !== undefined) updateData.client_id = input.clientId || null;
  if (input.bookingId !== undefined) updateData.booking_id = input.bookingId || null;
  if (input.sessionDate) updateData.session_date = input.sessionDate;
  if (input.durationMinutes) updateData.duration_minutes = input.durationMinutes;
  if (input.sessionType !== undefined) updateData.session_type = input.sessionType || null;
  if (input.initialMood !== undefined) updateData.initial_mood = input.initialMood;
  if (input.finalMood !== undefined) updateData.final_mood = input.finalMood;
  if (input.subjective !== undefined) updateData.subjective = input.subjective;
  if (input.objective !== undefined) updateData.objective = input.objective;
  if (input.assessment !== undefined) updateData.assessment = input.assessment;
  if (input.plan !== undefined) updateData.plan = input.plan;
  if (input.techniquesUsed) updateData.techniques_used = input.techniquesUsed;
  if (input.tags) updateData.tags = input.tags;
  if (input.isDraft !== undefined) updateData.is_draft = input.isDraft;

  const { error } = await supabase
    .from('session_notes')
    .update(updateData)
    .eq('id', noteId)
    .eq('therapist_id', profile.id);

  if (error) {
    console.error('Error updating session note:', error);
    return { success: false, error: 'Failed to update session note' };
  }

  revalidatePath('/therapist/session-notes');
  return { success: true };
}

export async function deleteSessionNote(noteId: string) {
  const { supabase, profile, error: authError } = await requireTherapist();
  if (authError || !profile) return { success: false, error: authError };

  const { error } = await supabase
    .from('session_notes')
    .delete()
    .eq('id', noteId)
    .eq('therapist_id', profile.id);

  if (error) {
    console.error('Error deleting session note:', error);
    return { success: false, error: 'Failed to delete session note' };
  }

  revalidatePath('/therapist/session-notes');
  return { success: true };
}

export async function getSessionNotes(limit = 50) {
  const { supabase, profile, error: authError } = await requireTherapist();
  if (authError || !profile) return { success: false, error: authError, data: [] };

  const { data, error } = await supabase
    .from('session_notes')
    .select('*, client:client_id(full_name, avatar_url)')
    .eq('therapist_id', profile.id)
    .order('session_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching session notes:', error);
    return { success: false, error: 'Failed to fetch notes', data: [] };
  }

  return { success: true, data: data || [] };
}

export async function getSessionNote(noteId: string) {
  const { supabase, profile, error: authError } = await requireTherapist();
  if (authError || !profile) return { success: false, error: authError, data: null };

  const { data, error } = await supabase
    .from('session_notes')
    .select('*, client:client_id(full_name, avatar_url)')
    .eq('id', noteId)
    .eq('therapist_id', profile.id)
    .single();

  if (error) {
    console.error('Error fetching session note:', error);
    return { success: false, error: 'Note not found', data: null };
  }

  return { success: true, data };
}

export async function getTherapistClients() {
  const { supabase, profile, error: authError } = await requireTherapist();
  if (authError || !profile) return [];

  // Get unique clients from bookings
  const { data } = await supabase
    .from('bookings')
    .select('client_id, profiles:client_id(id, full_name, avatar_url)')
    .eq('therapist_id', profile.id)
    .not('client_id', 'is', null);

  if (!data) return [];

  // Deduplicate clients
  const seen = new Set<string>();
  return data
    .filter((b) => {
      if (!b.client_id || seen.has(b.client_id)) return false;
      seen.add(b.client_id);
      return true;
    })
    .map((b) => b.profiles)
    .filter(Boolean);
}
