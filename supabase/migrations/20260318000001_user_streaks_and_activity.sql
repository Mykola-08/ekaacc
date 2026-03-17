-- Migration: User Streaks and Activity Log
-- Rationale:
--   Enables gamification and habit-tracking features:
--   - user_streaks: tracks current/longest streaks per activity type
--     (journaling, mood check-ins, session attendance, assignments)
--   - user_activity_log: append-only log of wellness-related events
--     used to compute streaks, power AI insights, and show activity feeds
--
-- Rollback: DROP TABLE public.user_activity_log; DROP TABLE public.user_streaks;

-- ════════════════════════════════════════════════════════════════════
-- 1. USER STREAKS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_streaks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type   TEXT NOT NULL
                    CHECK (activity_type IN (
                        'journal',       -- wrote a journal entry
                        'mood_checkin',  -- logged a mood entry
                        'session',       -- attended a therapy session
                        'assignment',    -- completed an assignment
                        'goal_checkin',  -- updated a goal's progress
                        'login'          -- daily login streak
                    )),
    current_streak  INTEGER NOT NULL DEFAULT 0,
    longest_streak  INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    total_days      INTEGER NOT NULL DEFAULT 0,
    updated_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, activity_type)
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own streaks"
    ON public.user_streaks FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_user_streaks_user ON public.user_streaks(user_id);

CREATE TRIGGER user_streaks_updated_at
    BEFORE UPDATE ON public.user_streaks
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ════════════════════════════════════════════════════════════════════
-- 2. USER ACTIVITY LOG
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.user_activity_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type   TEXT NOT NULL,  -- matches user_streaks.activity_type + custom events
    event           TEXT NOT NULL,  -- e.g. 'journal_entry_created', 'mood_logged', 'booking_completed'
    entity_id       UUID,           -- optional FK to the related entity
    entity_table    TEXT,           -- e.g. 'journal_entries', 'mood_entries', 'bookings'
    metadata        JSONB DEFAULT '{}'::jsonb,
    xp_earned       INTEGER NOT NULL DEFAULT 0,  -- future: gamification points
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own activity log"
    ON public.user_activity_log FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role inserts activity log"
    ON public.user_activity_log FOR INSERT
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE INDEX idx_activity_log_user       ON public.user_activity_log(user_id, occurred_at DESC);
CREATE INDEX idx_activity_log_type       ON public.user_activity_log(user_id, activity_type, occurred_at DESC);
CREATE INDEX idx_activity_log_entity     ON public.user_activity_log(entity_id) WHERE entity_id IS NOT NULL;

-- ════════════════════════════════════════════════════════════════════
-- 3. RPC: increment_streak
--    Called after each qualifying user action.
--    Handles streak continuation, reset, and longest_streak tracking.
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.increment_streak(
    p_user_id       UUID,
    p_activity_type TEXT
)
RETURNS TABLE (current_streak INT, longest_streak INT, is_new_record BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_today         DATE := CURRENT_DATE;
    v_row           public.user_streaks%ROWTYPE;
    v_days_since    INT;
    v_new_streak    INT;
    v_new_longest   INT;
    v_is_new_record BOOLEAN := false;
BEGIN
    -- Upsert base row
    INSERT INTO public.user_streaks (user_id, activity_type, current_streak, longest_streak, last_activity_date, total_days)
    VALUES (p_user_id, p_activity_type, 0, 0, NULL, 0)
    ON CONFLICT (user_id, activity_type) DO NOTHING;

    SELECT * INTO v_row
    FROM public.user_streaks
    WHERE user_id = p_user_id AND activity_type = p_activity_type
    FOR UPDATE;

    -- Already logged today — idempotent, no change
    IF v_row.last_activity_date = v_today THEN
        RETURN QUERY SELECT v_row.current_streak, v_row.longest_streak, false;
        RETURN;
    END IF;

    v_days_since := COALESCE(v_today - v_row.last_activity_date, 999);

    -- Continue streak (activity yesterday) vs reset (gap > 1 day)
    IF v_days_since = 1 THEN
        v_new_streak := v_row.current_streak + 1;
    ELSE
        v_new_streak := 1;
    END IF;

    v_new_longest := GREATEST(v_row.longest_streak, v_new_streak);
    v_is_new_record := v_new_longest > v_row.longest_streak;

    UPDATE public.user_streaks SET
        current_streak     = v_new_streak,
        longest_streak     = v_new_longest,
        last_activity_date = v_today,
        total_days         = v_row.total_days + 1,
        updated_at         = now()
    WHERE user_id = p_user_id AND activity_type = p_activity_type;

    RETURN QUERY SELECT v_new_streak, v_new_longest, v_is_new_record;
END;
$$;

-- ════════════════════════════════════════════════════════════════════
-- 4. RPC: log_user_activity
--    Single entry point for logging activity + updating streaks atomically.
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.log_user_activity(
    p_user_id      UUID,
    p_activity_type TEXT,
    p_event        TEXT,
    p_entity_id    UUID    DEFAULT NULL,
    p_entity_table TEXT    DEFAULT NULL,
    p_metadata     JSONB   DEFAULT '{}'::jsonb,
    p_xp_earned    INTEGER DEFAULT 0
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO public.user_activity_log
        (user_id, activity_type, event, entity_id, entity_table, metadata, xp_earned)
    VALUES
        (p_user_id, p_activity_type, p_event, p_entity_id, p_entity_table, p_metadata, p_xp_earned);

    -- Update streak for streak-tracked activity types
    IF p_activity_type IN ('journal', 'mood_checkin', 'session', 'assignment', 'goal_checkin', 'login') THEN
        PERFORM public.increment_streak(p_user_id, p_activity_type);
    END IF;
END;
$$;
