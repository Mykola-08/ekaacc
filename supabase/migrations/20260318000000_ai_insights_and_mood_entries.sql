-- Migration: AI Insights table + dedicated Mood Entries table
-- Rationale:
--   1. ai_insights table is queried by /ai-insights page but was never formally
--      created in migrations. Adding it here makes the schema explicit.
--   2. mood_entries is a first-class table for standalone mood tracking
--      (decoupled from journal_entries.mood) enabling richer analytics,
--      daily check-ins without writing a full journal, and better streaks.
--
-- Rollback: DROP TABLE public.mood_entries; DROP TABLE public.ai_insights;

-- ════════════════════════════════════════════════════════════════════
-- 1. AI INSIGHTS
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.ai_insights (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insight_type    TEXT NOT NULL DEFAULT 'general'
                    CHECK (insight_type IN (
                        'general', 'mood_pattern', 'goal_recommendation',
                        'journal_analysis', 'session_summary', 'risk_flag',
                        'positive_reinforcement', 'weekly_recap'
                    )),
    content         TEXT NOT NULL,
    metadata        JSONB DEFAULT '{}'::jsonb,
    source          TEXT DEFAULT 'system'
                    CHECK (source IN ('system', 'therapist', 'user_triggered', 'scheduled')),
    is_read         BOOLEAN NOT NULL DEFAULT false,
    is_dismissed    BOOLEAN NOT NULL DEFAULT false,
    severity        TEXT DEFAULT 'info'
                    CHECK (severity IN ('info', 'positive', 'warning', 'critical')),
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own ai_insights"
    ON public.ai_insights FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users update own ai_insights (read/dismiss)"
    ON public.ai_insights FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Service role inserts insights (via edge functions / background jobs)
CREATE POLICY "Service role manages ai_insights"
    ON public.ai_insights FOR ALL
    USING (auth.role() = 'service_role');

CREATE INDEX idx_ai_insights_user ON public.ai_insights(user_id, created_at DESC);
CREATE INDEX idx_ai_insights_type  ON public.ai_insights(user_id, insight_type);
CREATE INDEX idx_ai_insights_unread ON public.ai_insights(user_id, is_read) WHERE NOT is_read;

-- ════════════════════════════════════════════════════════════════════
-- 2. MOOD ENTRIES (standalone, not tied to journal)
-- ════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.mood_entries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score       SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 10),
    -- Optional annotations
    note        TEXT,
    energy      SMALLINT CHECK (energy BETWEEN 1 AND 10),
    sleep_hours NUMERIC(4,1) CHECK (sleep_hours BETWEEN 0 AND 24),
    tags        TEXT[]  DEFAULT ARRAY[]::TEXT[],
    -- Context: optional link back to a journal entry or booking
    journal_entry_id UUID REFERENCES public.journal_entries(id) ON DELETE SET NULL,
    booking_id       UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
    -- When: user-provided date (defaults to now), for manual backdating
    logged_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own mood_entries"
    ON public.mood_entries FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Therapists can read their patients' mood entries (via explicit consent / RLS join)
CREATE POLICY "Therapists read patient mood_entries"
    ON public.mood_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.therapist_id = (
                SELECT id FROM public.profiles WHERE auth_id = auth.uid() LIMIT 1
            )
            AND b.client_id = (
                SELECT id FROM public.profiles WHERE auth_id = mood_entries.user_id LIMIT 1
            )
        )
    );

CREATE INDEX idx_mood_entries_user      ON public.mood_entries(user_id, logged_at DESC);
CREATE INDEX idx_mood_entries_logged_at ON public.mood_entries(logged_at DESC);

-- Helper view: daily mood aggregate per user
CREATE OR REPLACE VIEW public.mood_daily_avg AS
SELECT
    user_id,
    DATE(logged_at) AS day,
    ROUND(AVG(score)::NUMERIC, 2) AS avg_score,
    MAX(score) AS max_score,
    MIN(score) AS min_score,
    COUNT(*) AS entry_count
FROM public.mood_entries
GROUP BY user_id, DATE(logged_at);

-- ════════════════════════════════════════════════════════════════════
-- 3. UPDATED_AT trigger for ai_insights
-- ════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER ai_insights_updated_at
    BEFORE UPDATE ON public.ai_insights
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
