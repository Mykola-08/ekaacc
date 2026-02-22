import { createClient } from '@/lib/supabase/client';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditEvent {
  event_type: string;
  resource_type?: string;
  resource_id?: string;
  severity?: AuditSeverity;
  metadata?: Record<string, any>;
}

/**
 * Logs an event to the unified audit_events table.
 * Uses the Supabase RPC 'log_event' for secure, server-side timestamping and actor assignment.
 */
export async function logEvent(event: AuditEvent) {
  try {
    const supabase = createClient();
    const { error } = await supabase.rpc('log_event', {
      p_event_type: event.event_type,
      p_resource_type: event.resource_type || null,
      p_resource_id: event.resource_id || null,
      p_metadata: event.metadata || {},
      p_severity: event.severity || 'info',
    });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (err) {
    console.error('Unexpected error logging audit event:', err);
  }
}
