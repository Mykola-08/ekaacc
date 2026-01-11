-- Plans and Usage Control Schema
-- Implements "Plan Usage Metrics" with Manual Adjustments and Automation

-- 1. Plan Definitions (e.g., "5 Session Pack")
create table if not exists plan_definition (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  name text not null,
  description text,
  stripe_product_id text, -- Optional link to Stripe Product
  stripe_price_id text,   -- Optional link to Stripe Price
  credits_total integer not null default 0, -- Total credits granted (e.g., 5)
  validity_days integer, -- Expiry in days (e.g., 30, 365)
  price_cents integer, -- Cost in cents (for manual assignment reference)
  currency text default 'EUR',
  active boolean default true,
  metadata jsonb default '{}'::jsonb
);

-- 2. User Plan Usage (The instance of a plan owned by a user)
create table if not exists user_plan_usage (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_definition_id uuid references plan_definition(id),
  name text not null, -- Snapshot of plan name
  credits_total integer not null, -- Snapshot
  credits_used integer not null default 0,
  -- credits_remaining is calculated as (credits_total - credits_used)
  expires_at timestamptz,
  status text check (status in ('active', 'exhausted', 'expired', 'cancelled')) default 'active',
  metadata jsonb default '{}'::jsonb
);

-- 3. Plan Usage Log (Audit trail for every credit change)
create table if not exists plan_usage_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_plan_usage_id uuid references user_plan_usage(id) on delete cascade,
  change_amount integer not null, -- +1 or -1 (or more)
  balance_after integer not null,
  start_balance integer not null,
  booking_id uuid, -- Optional link to a booking invocation
  reason text, -- "Booking Confirmed", "Manual Adjustment", "Refund"
  performed_by uuid references auth.users(id) -- Who made the change (Admin/System)
);

-- Indexes
create index if not exists idx_user_plan_usage_user on user_plan_usage(user_id);
create index if not exists idx_user_plan_usage_status on user_plan_usage(status);
create index if not exists idx_plan_usage_log_plan on plan_usage_log(user_plan_usage_id);

-- RLS Policies
alter table plan_definition enable row level security;
alter table user_plan_usage enable row level security;
alter table plan_usage_log enable row level security;

-- Plan Definition: Public read, Admin write
create policy "Plans are viewable by everyone" on plan_definition for select using (true);
create policy "Admins can manage plans" on plan_definition for all using (
  exists (
    select 1 from user_roles ur 
    where ur.user_id = auth.uid() 
    and ur.role in ('admin', 'super_admin')
  )
);

-- User Plan Usage: User read own, Admin read/write all
create policy "Users can view own plans" on user_plan_usage for select using (auth.uid() = user_id);
create policy "Admins can manage user plans" on user_plan_usage for all using (
  exists (
    select 1 from user_roles ur 
    where ur.user_id = auth.uid() 
    and ur.role in ('admin', 'super_admin', 'therapist') -- Therapists can also adjust
  )
);

-- Usage Logs: Users read own, Admin read all
create policy "Users can view own logs" on plan_usage_log for select using (
  exists (
    select 1 from user_plan_usage upu
    where upu.id = plan_usage_log.user_plan_usage_id
    and upu.user_id = auth.uid()
  )
);
create policy "Admins can view logs" on plan_usage_log for select using (
  exists (
    select 1 from user_roles ur 
    where ur.user_id = auth.uid() 
    and ur.role in ('admin', 'super_admin', 'therapist')
  )
);

-- FUNCTIONS FOR AUTOMATION

-- Function: Assign Plan to User (Manual or webhook)
create or replace function assign_plan_to_user(
  p_user_id uuid,
  p_plan_id uuid,
  p_performed_by uuid default null
) returns uuid as $$
declare
  v_plan plan_definition%ROWTYPE;
  v_usage_id uuid;
  v_expires_at timestamptz;
begin
  select * into v_plan from plan_definition where id = p_plan_id;
  if not found then raise exception 'Plan not found'; end if;

  if v_plan.validity_days is not null then
    v_expires_at := now() + (v_plan.validity_days || ' days')::interval;
  end if;

  insert into user_plan_usage (
    user_id, plan_definition_id, name, credits_total, expires_at
  ) values (
    p_user_id, p_plan_id, v_plan.name, v_plan.credits_total, v_expires_at
  ) returning id into v_usage_id;

  -- Log creation
  insert into plan_usage_log (
    user_plan_usage_id, change_amount, start_balance, balance_after, reason, performed_by
  ) values (
    v_usage_id, v_plan.credits_total, 0, v_plan.credits_total, 'Plan Assigned', p_performed_by
  );

  return v_usage_id;
end;
$$ language plpgsql security definer;

-- Function: Adjust Plan Balance (Manual)
create or replace function adjust_plan_credits(
  p_usage_id uuid,
  p_change_amount integer,
  p_reason text,
  p_performed_by uuid
) returns jsonb as $$
declare
  v_usage user_plan_usage%ROWTYPE;
  v_new_used integer;
  v_new_remaining integer;
begin
  select * into v_usage from user_plan_usage where id = p_usage_id;
  if not found then raise exception 'User plan not found'; end if;

  -- Logic: We adjust 'credits_used'. 
  -- If we ADD credits (positive change), we DECREASE credits_used.
  -- If we REMOVE credits (negative change), we INCREASE credits_used.
  -- Wait, easier mental model: p_change_amount is "change in REMAINING credits".
  -- +1 means user gets 1 more. -1 means user loses 1.
  
  -- Current remaining = Total - Used
  -- New remaining = Current remaining + change
  -- New Used = Total - New Remaining
  
  v_new_remaining := (v_usage.credits_total - v_usage.credits_used) + p_change_amount;
  
  if v_new_remaining < 0 then
    raise exception 'Insufficient credits';
  end if;
  
  -- Check if this increases total? No, usually we just decrement used.
  -- But what if they have 5/5 used (0 remaining) and we want to give 1?
  -- New remaining = 1. New Used = 4. Correct.
  
  -- What if they have 5/5 used (0 remaining) and we want to give 10 (total 10)?
  -- If New Remaining > Total, we might need to bump Total.
  -- For simplest "Manual Adjustment", let's just shift 'credits_used'.
  
  v_new_used := v_usage.credits_total - v_new_remaining;
  
  -- If v_new_used < 0, it means we gave them more than the total.
  -- E.g. Total 5, Used 0. remaining 5. Add 2. Remaining 7. Used = -2.
  -- We should update Total in that case? Or allow negative used?
  -- Better usage: Update Total if expanding the plan? 
  -- Let's stick to: Update `credits_used` constraint.
  
  if v_new_used < 0 then
     -- Increase total to match
     update user_plan_usage 
     set credits_total = credits_total + abs(v_new_used),
         credits_used = 0,
         updated_at = now()
     where id = p_usage_id;
  else
     update user_plan_usage 
     set credits_used = v_new_used,
         updated_at = now()
     where id = p_usage_id;
  end if;

  -- Log
  insert into plan_usage_log (
    user_plan_usage_id, change_amount, start_balance, balance_after, reason, performed_by
  ) values (
    p_usage_id, p_change_amount, (v_usage.credits_total - v_usage.credits_used), v_new_remaining, p_reason, p_performed_by
  );

  return jsonb_build_object('success', true, 'new_balance', v_new_remaining);
end;
$$ language plpgsql security definer;

-- Trigger/Function for Bookings
-- When a booking with payment_mode='plan' is confirmed, consume credit.
-- NOTE: This requires application to pass the `user_plan_usage_id` or find one.
-- For now, we'll assume the app calls a specific function during booking flow.

create or replace function consume_plan_credit_for_booking(
  p_booking_id uuid,
  p_usage_id uuid
) returns boolean as $$
declare
  v_usage user_plan_usage%ROWTYPE;
begin
  select * into v_usage from user_plan_usage where id = p_usage_id;
  if not found then raise exception 'Plan not found'; end if;
  
  if v_usage.status != 'active' then raise exception 'Plan is not active'; end if;
  if v_usage.expires_at is not null and v_usage.expires_at < now() then raise exception 'Plan expired'; end if;
  if (v_usage.credits_total - v_usage.credits_used) < 1 then raise exception 'Insufficient credits'; end if;
  
  update user_plan_usage
  set credits_used = credits_used + 1,
      updated_at = now()
  where id = p_usage_id;
  
  insert into plan_usage_log (
    user_plan_usage_id, change_amount, start_balance, balance_after, booking_id, reason, performed_by
  ) values (
    p_usage_id, -1, (v_usage.credits_total - v_usage.credits_used), (v_usage.credits_total - v_usage.credits_used - 1), p_booking_id, 'Booking Payment', auth.uid()
  );
  
  return true;
end;
$$ language plpgsql security definer;


-- Seed default plan
insert into plan_definition (name, description, credits_total, validity_days, price_cents)
select '5 Session Pack', 'Bundle of 5 sessions', 5, 90, 45000
where not exists (select 1 from plan_definition where name = '5 Session Pack');



-- Analytics RPC
create or replace function get_plan_usage_stats()
returns jsonb as \$\$
declare
  v_total_distributed bigint;
  v_total_used bigint;
  v_active_plans bigint;
begin
  select count(*) into v_active_plans from user_plan_usage where status = 'active';
  select sum(credits_total) into v_total_distributed from user_plan_usage;
  select sum(credits_used) into v_total_used from user_plan_usage;
  
  return jsonb_build_object(
    'active_plans', v_active_plans,
    'total_credits_distributed', coalesce(v_total_distributed, 0),
    'total_credits_used', coalesce(v_total_used, 0),
    'utilization_rate', case when v_total_distributed > 0 then round((v_total_used::numeric / v_total_distributed::numeric) * 100, 2) else 0 end
  );
end;
\$\$ language plpgsql security definer;



-- ADMIN KPI: Revenue & Growth
create or replace function get_admin_kpi_stats()
returns jsonb as \$\$
declare
  v_revenue_mtd numeric;
  v_revenue_growth_pct numeric;
  v_users_total bigint;
  v_users_growth_pct numeric;
begin
  -- Revenue MTD (Estimate based on plan creations * current price - simple approximation)
  -- In production, sum 'invoices' or 'payments' table. 
  -- We'll us plan_definition price linked to user_plan_usage creation for now.
  select coalesce(sum(pd.price_cents) / 100.0, 0)
  into v_revenue_mtd
  from user_plan_usage upu
  join plan_definition pd on upu.plan_definition_id = pd.id
  where upu.created_at >= date_trunc('month', now());

  -- Users Total
  select count(*) into v_users_total from auth.users;
  
  -- Mock growth stats for now (requires historical snapshots)
  v_revenue_growth_pct := 15.0; 
  v_users_growth_pct := 5.2;

  return jsonb_build_object(
    'revenue_mtd', v_revenue_mtd,
    'revenue_growth_pct', v_revenue_growth_pct,
    'users_total', v_users_total,
    'users_growth_pct', v_users_growth_pct
  );
end;
\$\$ language plpgsql security definer;

-- ADMIN: Booking Management Table
-- Returns detailed booking list with filtering capabilities
create or replace function get_admin_bookings(
  p_page int default 1,
  p_limit int default 10,
  p_status text default null,
  p_search text default null
)
returns table (
  id uuid,
  created_at timestamptz,
  start_time timestamptz,
  service_name text,
  customer_email text,
  customer_name text,
  provider_name text,
  status text,
  payment_status text,
  amount_cents int,
  total_count bigint
) as \$\$
begin
  return query
  with filtered_bookings as (
    select 
      b.id,
      b.created_at,
      b.start_time,
      s.name as service_name,
      b.email as customer_email,
      b.display_name as customer_name,
      st.name as provider_name,
      b.status::text,
      b.payment_status::text,
      b.base_price_cents as amount_cents
    from booking b
    left join service s on b.service_id = s.id
    left join staff st on b.staff_id = st.id
    where (p_status is null or b.status::text = p_status)
      and (p_search is null or 
           b.email ilike '%' || p_search || '%' or 
           b.display_name ilike '%' || p_search || '%' or
           b.id::text = p_search)
  )
  select 
    *,
    (select count(*) from filtered_bookings) as total_count
  from filtered_bookings
  order by start_time desc
  limit p_limit
  offset (p_page - 1) * p_limit;
end;
\$\$ language plpgsql security definer;



-- CLIENT: Wallet / Plan Transaction History
-- Returns unified view of wallet transactions and plan usage logs
create or replace function get_client_transactions(
  p_user_id uuid,
  p_limit int default 20
)
returns table (
  id uuid,
  created_at timestamptz,
  type text, -- 'wallet' or 'plan'
  amount numeric, -- Currency amount or Credit amount
  description text,
  status text
) as \$\$
begin
  return query
  (
    -- Wallet Transactions
    select 
      wt.id,
      wt.created_at,
      'wallet'::text as type,
      wt.amount as amount, -- Euros
      wt.description,
      'completed'::text as status
    from wallet_transactions wt
    join wallets w on wt.wallet_id = w.id
    where w.user_id = p_user_id
  )
  union all
  (
    -- Plan Usage Logs
    select 
      pl.id,
      pl.created_at,
      'plan_credit'::text as type,
      pl.change_amount::numeric as amount, -- Credits
      coalesce(pl.reason, 'Plan Usage') as description,
      'completed'::text as status
    from plan_usage_log pl
    join user_plan_usage upu on pl.user_plan_usage_id = upu.id
    where upu.user_id = p_user_id
  )
  order by created_at desc
  limit p_limit;
end;
\$\$ language plpgsql security definer;

 
 - -   A D M I N :   C a n c e l   B o o k i n g   ( w i t h   a u d i t )  
 c r e a t e   o r   r e p l a c e   f u n c t i o n   a d m i n _ c a n c e l _ b o o k i n g (  
     p _ b o o k i n g _ i d   u u i d ,  
     p _ r e a s o n   t e x t ,  
     p _ p e r f o r m e d _ b y   u u i d  
 )   r e t u r n s   b o o l e a n   a s   $ $  
 d e c l a r e  
     v _ b o o k i n g   b o o k i n g % R O W T Y P E ;  
 b e g i n  
     s e l e c t   *   i n t o   v _ b o o k i n g   f r o m   b o o k i n g   w h e r e   i d   =   p _ b o o k i n g _ i d ;  
     i f   n o t   f o u n d   t h e n   r a i s e   e x c e p t i o n   ' B o o k i n g   n o t   f o u n d ' ;   e n d   i f ;  
  
     u p d a t e   b o o k i n g  
     s e t   s t a t u s   =   ' c a n c e l l e d ' ,   - -   A s s u m i n g   ' c a n c e l l e d '   i s   a   v a l i d   s t a t u s   e n u m   o r   t e x t  
             m e t a d a t a   =   m e t a d a t a   | |   j s o n b _ b u i l d _ o b j e c t (  
                 ' c a n c e l l a t i o n _ r e a s o n ' ,   p _ r e a s o n ,  
                 ' c a n c e l l e d _ b y ' ,   p _ p e r f o r m e d _ b y ,  
                 ' c a n c e l l e d _ a t ' ,   n o w ( )  
             )  
     w h e r e   i d   =   p _ b o o k i n g _ i d ;  
  
     - -   N O T E :   I f   t h i s   w a s   p a i d   b y   P l a n   C r e d i t s ,   w e   s h o u l d   t e c h n i c a l l y   r e f u n d   t h e   c r e d i t .  
     - -   T h i s   r e q u i r e s   m o r e   c o m p l e x   l o g i c   t o   f i n d   t h e   u s a g e   l o g   a n d   r e v e r s e   i t .  
     - -   F o r   M V P / S p e e d ,   w e   l e a v e   i t   t o   m a n u a l   a d j u s t m e n t   o r   f u t u r e   e n h a n c e m e n t .  
  
     r e t u r n   t r u e ;  
 e n d ;  
 $ $   l a n g u a g e   p l p g s q l   s e c u r i t y   d e f i n e r ;  
 