-- ROBUST WALLET SYSTEM
-- Implements the wallet feature as a first-class Supabase entity.
-- Replacing the partial 'user_wallet' with a full 'wallets' table if needed,
-- or upgrading the existing one.

-- 1. Ensure WALLETS table (Single source of truth for balance)
create table if not exists wallets (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    balance_cents bigint default 0 check (balance_cents >= 0), -- Prevent negative balance
    currency text default 'EUR',
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    is_active boolean default true,
    unique(user_id, currency) -- One wallet per currency per user
);

-- RLS
alter table wallets enable row level security;
create policy "Users view own wallet" on wallets for select using (auth.uid() = user_id);
-- Only system functions update the wallet (no user direct update)

-- 2. Ensure TRANSACTIONS table (Audit log)
create table if not exists wallet_transactions (
    id uuid primary key default gen_random_uuid(),
    wallet_id uuid references wallets(id),
    user_id uuid references auth.users(id), -- Denormalized for easy querying
    amount_cents integer not null, -- Positive = Credit, Negative = Debit
    balance_after_cents bigint not null,
    type text check (type in ('deposit', 'purchase', 'refund', 'bonus', 'adjustment')),
    description text,
    reference_id text, -- e.g., booking_id or stripe_payment_intent_id
    metadata jsonb default '{}',
    created_at timestamptz default now()
);

-- RLS
alter table wallet_transactions enable row level security;
create policy "Users view own transactions" on wallet_transactions for select using (auth.uid() = user_id);

-- 3. TRIGGER: Auto-manage 'updated_at'
create or replace function update_wallet_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace trigger trg_wallet_updated_at
before update on wallets
for each row execute function update_wallet_timestamp();


-- 4. FUNCTION: Get User Balance (RPC)
create or replace function get_my_wallet_balance()
returns integer as $$
declare
    v_balance integer;
begin
    select balance_cents into v_balance 
    from wallets 
    where user_id = auth.uid() 
    limit 1;
    
    return coalesce(v_balance, 0);
end;
$$ language plpgsql security definer;


-- 5. FUNCTION: Top Up Wallet (System Level)
-- Called after Stripe payment succeeds for a "Wallet Credit" product
create or replace function top_up_wallet(
    p_user_id uuid,
    p_amount_cents integer,
    p_description text,
    p_reference_id text
) returns void as $$
declare
    v_wallet_id uuid;
    v_new_balance bigint;
begin
    -- 1. Get or Create Wallet
    insert into wallets (user_id, balance_cents)
    values (p_user_id, 0)
    on conflict (user_id, currency) do nothing;
    
    select id, balance_cents into v_wallet_id, v_new_balance 
    from wallets 
    where user_id = p_user_id
    for update; -- Lock row

    -- 2. Calculate New Balance
    v_new_balance := v_new_balance + p_amount_cents;

    -- 3. Update Wallet
    update wallets 
    set balance_cents = v_new_balance 
    where id = v_wallet_id;

    -- 4. Log Transaction
    insert into wallet_transactions (
        wallet_id, user_id, amount_cents, balance_after_cents, 
        type, description, reference_id
    ) values (
        v_wallet_id, p_user_id, p_amount_cents, v_new_balance,
        'deposit', p_description, p_reference_id
    );
end;
$$ language plpgsql security definer;
