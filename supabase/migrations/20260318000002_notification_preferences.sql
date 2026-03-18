-- Migration: Notification Preferences + Notification Inbox
-- Rationale:
--   - notification_preferences: per-user channel (email/push/in-app) and
--     category (booking, ai_insight, assignment, etc.) opt-in/out matrix
--   - notifications table was implied by existing code but had no formal schema.
--     This migration ensures it has the right shape with RLS.
--
-- Rollback: DROP TABLE public.notification_preferences;
--           (notifications table: only add columns if it existed, else drop)

-- ════════════════════════════════════════════════════════════════════
-- 1. ENSURE notifications TABLE EXISTS with correct shape
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        TEXT NOT NULL DEFAULT 'info'
                CHECK (type IN ('info', 'success', 'warning', 'error', 'booking', 'assignment', 'ai_insight', 'payment', 'system')),
    title       TEXT NOT NULL,
    body        TEXT,
    action_url  TEXT,
    action_label TEXT,
    is_read     BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    sent_via    TEXT[] DEFAULT ARRAY[]::TEXT[],  -- ['email', 'push', 'in_app']
    metadata    JSONB DEFAULT '{}'::jsonb,
    created_at  TIMESTAMPTZ DEFAULT now(),
    read_at     TIMESTAMPTZ
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role inserts notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread
    ON public.notifications(user_id, is_read) WHERE NOT is_read;

-- ════════════════════════════════════════════════════════════════════
-- 2. NOTIFICATION PREFERENCES
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,

    -- Channel toggles
    email_enabled   BOOLEAN NOT NULL DEFAULT true,
    push_enabled    BOOLEAN NOT NULL DEFAULT true,
    in_app_enabled  BOOLEAN NOT NULL DEFAULT true,
    telegram_enabled BOOLEAN NOT NULL DEFAULT false,

    -- Category opt-outs (true = enabled, false = muted)
    booking_reminders   BOOLEAN NOT NULL DEFAULT true,
    booking_changes     BOOLEAN NOT NULL DEFAULT true,
    assignment_due      BOOLEAN NOT NULL DEFAULT true,
    assignment_reviewed BOOLEAN NOT NULL DEFAULT true,
    ai_insights_weekly  BOOLEAN NOT NULL DEFAULT true,
    goal_nudges         BOOLEAN NOT NULL DEFAULT true,
    community_mentions  BOOLEAN NOT NULL DEFAULT true,
    payment_receipts    BOOLEAN NOT NULL DEFAULT true,
    system_updates      BOOLEAN NOT NULL DEFAULT false,

    -- Quiet hours (stored as HH:MM in user's local timezone intent)
    quiet_hours_start   TIME,
    quiet_hours_end     TIME,

    -- Digest preference
    digest_frequency TEXT NOT NULL DEFAULT 'daily'
                     CHECK (digest_frequency IN ('realtime', 'daily', 'weekly', 'never')),

    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notification_preferences"
    ON public.notification_preferences FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_notif_prefs_user ON public.notification_preferences(user_id);

CREATE TRIGGER notification_preferences_updated_at
    BEFORE UPDATE ON public.notification_preferences
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- 3. RPC: get_unread_notification_count
--    Called by the header badge to show unread count efficiently
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.get_unread_notification_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT COUNT(*)::INTEGER
    FROM public.notifications
    WHERE user_id = p_user_id
      AND is_read = false
      AND is_archived = false;
$$;
