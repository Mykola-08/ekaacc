-- Migration: Create user_plan_usage and plan_definition tables
-- These tables support the credit/plan-based booking system

-- Plan definitions (catalog of purchasable session packs)
CREATE TABLE IF NOT EXISTS public.plan_definition (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    credits_total INTEGER NOT NULL CHECK (credits_total > 0),
    validity_days INTEGER, -- NULL means no expiry
    price_cents INTEGER NOT NULL DEFAULT 0 CHECK (price_cents >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    stripe_price_id VARCHAR(100), -- Optional Stripe Price ID for checkout
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User plan usage (tracks individual plan instances purchased by users)
CREATE TABLE IF NOT EXISTS public.user_plan_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_definition_id UUID REFERENCES public.plan_definition(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    credits_total INTEGER NOT NULL CHECK (credits_total > 0),
    credits_used INTEGER NOT NULL DEFAULT 0 CHECK (credits_used >= 0),
    credits_remaining INTEGER GENERATED ALWAYS AS (credits_total - credits_used) STORED,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'exhausted', 'expired', 'cancelled')),
    expires_at TIMESTAMPTZ,
    stripe_session_id VARCHAR(200),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Plan usage log (audit trail for credit changes)
CREATE TABLE IF NOT EXISTS public.plan_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_plan_usage_id UUID NOT NULL REFERENCES public.user_plan_usage(id) ON DELETE CASCADE,
    change_amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reason TEXT NOT NULL,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_plan_usage_user_id ON public.user_plan_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_plan_usage_status ON public.user_plan_usage(status);
CREATE INDEX IF NOT EXISTS idx_user_plan_usage_expires ON public.user_plan_usage(expires_at);
CREATE INDEX IF NOT EXISTS idx_plan_usage_log_usage_id ON public.plan_usage_log(user_plan_usage_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_plan_definition_updated_at ON public.plan_definition;
CREATE TRIGGER update_plan_definition_updated_at 
    BEFORE UPDATE ON public.plan_definition
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_plan_usage_updated_at ON public.user_plan_usage;
CREATE TRIGGER update_user_plan_usage_updated_at 
    BEFORE UPDATE ON public.user_plan_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.plan_definition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_plan_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_usage_log ENABLE ROW LEVEL SECURITY;

-- Plan definitions: anyone authenticated can read active plans
CREATE POLICY "Anyone can view active plans" ON public.plan_definition
    FOR SELECT TO authenticated USING (active = true);

-- Admins can manage plan definitions
CREATE POLICY "Admins can manage plan definitions" ON public.plan_definition
    FOR ALL USING (
        (SELECT (raw_app_meta_data->>'role')::text FROM auth.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
    );

-- Users can view their own plan usage
CREATE POLICY "Users can view own plan usage" ON public.user_plan_usage
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Admins/therapists can view all plan usage
CREATE POLICY "Staff can view all plan usage" ON public.user_plan_usage
    FOR SELECT TO authenticated USING (
        (SELECT (raw_app_meta_data->>'role')::text FROM auth.users WHERE id = auth.uid()) IN ('admin', 'super_admin', 'therapist')
    );

-- Admins can insert/update plan usage (for assigning plans)
CREATE POLICY "Admins can manage plan usage" ON public.user_plan_usage
    FOR ALL USING (
        (SELECT (raw_app_meta_data->>'role')::text FROM auth.users WHERE id = auth.uid()) IN ('admin', 'super_admin')
    );

-- Users can view own plan usage logs 
CREATE POLICY "Users can view own plan logs" ON public.plan_usage_log
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.user_plan_usage upu 
            WHERE upu.id = user_plan_usage_id AND upu.user_id = auth.uid()
        )
    );

-- Staff can view all usage logs
CREATE POLICY "Staff can view all plan logs" ON public.plan_usage_log
    FOR SELECT TO authenticated USING (
        (SELECT (raw_app_meta_data->>'role')::text FROM auth.users WHERE id = auth.uid()) IN ('admin', 'super_admin', 'therapist')
    );

-- RPC: Assign a plan to a user
CREATE OR REPLACE FUNCTION public.assign_plan_to_user(
    p_user_id UUID,
    p_plan_id UUID,
    p_performed_by UUID
) RETURNS UUID AS $$
DECLARE
    v_plan plan_definition%ROWTYPE;
    v_usage_id UUID;
    v_expires TIMESTAMPTZ;
BEGIN
    SELECT * INTO v_plan FROM plan_definition WHERE id = p_plan_id AND active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Plan definition not found or inactive';
    END IF;

    IF v_plan.validity_days IS NOT NULL THEN
        v_expires := NOW() + (v_plan.validity_days || ' days')::INTERVAL;
    END IF;

    INSERT INTO user_plan_usage (user_id, plan_definition_id, name, credits_total, expires_at)
    VALUES (p_user_id, p_plan_id, v_plan.name, v_plan.credits_total, v_expires)
    RETURNING id INTO v_usage_id;

    INSERT INTO plan_usage_log (user_plan_usage_id, change_amount, balance_after, reason, performed_by)
    VALUES (v_usage_id, v_plan.credits_total, v_plan.credits_total, 'Plan assigned', p_performed_by);

    RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: Adjust plan credits (add or deduct)
CREATE OR REPLACE FUNCTION public.adjust_plan_credits(
    p_usage_id UUID,
    p_change_amount INTEGER,
    p_reason TEXT,
    p_performed_by UUID
) RETURNS INTEGER AS $$
DECLARE
    v_current user_plan_usage%ROWTYPE;
    v_new_used INTEGER;
BEGIN
    SELECT * INTO v_current FROM user_plan_usage WHERE id = p_usage_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Plan usage not found';
    END IF;

    v_new_used := v_current.credits_used - p_change_amount; -- positive = add credits, negative = deduct
    IF v_new_used < 0 THEN v_new_used := 0; END IF;
    IF v_new_used > v_current.credits_total THEN
        RAISE EXCEPTION 'Cannot deduct more credits than total';
    END IF;

    UPDATE user_plan_usage 
    SET credits_used = v_new_used,
        status = CASE 
            WHEN v_new_used >= credits_total THEN 'exhausted'
            ELSE 'active'
        END
    WHERE id = p_usage_id;

    INSERT INTO plan_usage_log (user_plan_usage_id, change_amount, balance_after, reason, performed_by)
    VALUES (p_usage_id, p_change_amount, v_current.credits_total - v_new_used, p_reason, p_performed_by);

    RETURN v_current.credits_total - v_new_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
