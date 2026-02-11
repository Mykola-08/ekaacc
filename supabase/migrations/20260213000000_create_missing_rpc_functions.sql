-- Migration: Create missing database RPC functions
-- These functions are called by server actions and cron jobs but were
-- missing from the consolidated migration.

-- ============================================================
-- 1. purchase_plan_atomic — Atomic plan purchase via wallet
-- Used by: server/plans/actions.ts -> buyPlan()
-- ============================================================
CREATE OR REPLACE FUNCTION public.purchase_plan_atomic(
    p_user_id UUID,
    p_plan_id UUID
) RETURNS UUID AS $$
DECLARE
    v_plan plan_definition%ROWTYPE;
    v_wallet wallets%ROWTYPE;
    v_usage_id UUID;
BEGIN
    -- Get plan
    SELECT * INTO v_plan FROM plan_definition WHERE id = p_plan_id AND active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Plan not found or inactive';
    END IF;

    -- Get wallet
    SELECT * INTO v_wallet FROM wallets WHERE user_id = p_user_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wallet not found for user';
    END IF;

    -- Check sufficient balance
    IF v_wallet.balance_cents < v_plan.price_cents THEN
        RAISE EXCEPTION 'Insufficient wallet balance. Required: %, Available: %', v_plan.price_cents, v_wallet.balance_cents;
    END IF;

    -- Deduct wallet balance
    UPDATE wallets
    SET balance_cents = balance_cents - v_plan.price_cents,
        updated_at = NOW()
    WHERE user_id = p_user_id;

    -- Record wallet transaction
    INSERT INTO wallet_transactions (wallet_id, amount_cents, type, description, reference_id)
    VALUES (v_wallet.id, -v_plan.price_cents, 'debit', 'Purchase Plan: ' || v_plan.name, p_plan_id::text);

    -- Assign plan to user
    v_usage_id := assign_plan_to_user(p_user_id, p_plan_id, p_user_id);

    RETURN v_usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 2. get_admin_kpi_stats — Admin KPI aggregation
-- Used by: src/app/actions/admin.ts, src/app/(dashboard)/dashboard/page.tsx
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_admin_kpi_stats()
RETURNS JSON AS $$
DECLARE
    v_revenue_mtd BIGINT;
    v_revenue_prev BIGINT;
    v_users_total BIGINT;
    v_users_prev BIGINT;
    v_revenue_growth NUMERIC;
    v_users_growth NUMERIC;
BEGIN
    -- Revenue this month (from billing_transactions)
    SELECT COALESCE(SUM(amount_cents), 0) INTO v_revenue_mtd
    FROM billing_transactions
    WHERE created_at >= date_trunc('month', NOW())
      AND status = 'completed';

    -- Revenue previous month
    SELECT COALESCE(SUM(amount_cents), 0) INTO v_revenue_prev
    FROM billing_transactions
    WHERE created_at >= date_trunc('month', NOW() - INTERVAL '1 month')
      AND created_at < date_trunc('month', NOW())
      AND status = 'completed';

    -- Users total
    SELECT COUNT(*) INTO v_users_total FROM auth.users;

    -- Users last month
    SELECT COUNT(*) INTO v_users_prev
    FROM auth.users
    WHERE created_at < date_trunc('month', NOW());

    -- Growth calculations
    IF v_revenue_prev > 0 THEN
        v_revenue_growth := ROUND(((v_revenue_mtd - v_revenue_prev)::NUMERIC / v_revenue_prev) * 100, 1);
    ELSE
        v_revenue_growth := 0;
    END IF;

    IF v_users_prev > 0 THEN
        v_users_growth := ROUND(((v_users_total - v_users_prev)::NUMERIC / v_users_prev) * 100, 1);
    ELSE
        v_users_growth := 0;
    END IF;

    RETURN json_build_object(
        'revenue_mtd', v_revenue_mtd,
        'revenue_growth_pct', v_revenue_growth,
        'users_total', v_users_total,
        'users_growth_pct', v_users_growth
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 3. cleanup_expired_insights — Cron cleanup
-- Used by: src/app/(platform)/cron/route.ts
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_insights()
RETURNS VOID AS $$
BEGIN
    DELETE FROM predictive_insights
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 4. cleanup_expired_payment_requests — Cron cleanup
-- Used by: src/app/(platform)/cron/route.ts
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_payment_requests()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM payment_requests
    WHERE status = 'pending'
      AND expires_at < NOW();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- 5. cleanup_old_analytics_data — Cron cleanup
-- Used by: src/app/(platform)/cron/route.ts
-- ============================================================
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics_data()
RETURNS VOID AS $$
BEGIN
    -- Delete user interactions older than 1 year
    DELETE FROM user_interactions
    WHERE timestamp < NOW() - INTERVAL '1 year';

    -- Archive old read notifications (older than 6 months)
    DELETE FROM notifications
    WHERE created_at < NOW() - INTERVAL '6 months'
      AND is_read = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ============================================================
-- Grant execute permissions
-- ============================================================
GRANT EXECUTE ON FUNCTION public.purchase_plan_atomic(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_kpi_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_insights() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_payment_requests() TO service_role;
GRANT EXECUTE ON FUNCTION public.cleanup_old_analytics_data() TO service_role;
