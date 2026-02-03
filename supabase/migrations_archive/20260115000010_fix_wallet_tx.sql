-- FIX WALLET FEATURES & TRANSACTION LOGGING
-- Ensures transaction logging works with the current schema variants.

-- 1. Ensure wallets table is robust (already done in previous step)

-- 2. Transaction Logger
-- The table 'wallet_transactions' might have 'wallet_id' as explicit link.
-- Columns from inspection: id, created_at, wallet_id, amount, currency, type, reference_id, description, metadata.
-- Note: 'amount' is 'integer', 'wallet_id' is 'uuid'.

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
    -- 1. Upsert Wallet
    insert into wallets (user_id, profile_id, balance_cents)
    values (p_user_id, p_user_id, 0)
    on conflict (user_id, currency) do nothing;
    
    -- 2. Lock & Get
    select profile_id, balance_cents into v_wallet_id, v_new_balance 
    from wallets 
    where user_id = p_user_id
    for update; 

    -- 3. Update Balance
    v_new_balance := v_new_balance + p_amount_cents;

    update wallets 
    set balance_cents = v_new_balance,
        updated_at = now()
    where profile_id = v_wallet_id;

    -- 4. Log Transaction (Using correct columns)
    insert into wallet_transactions (
        wallet_id, amount, type, description, reference_id, currency
    ) values (
        v_wallet_id, 
        p_amount_cents, 
        'deposit', 
        p_description, 
        p_reference_id,
        'EUR'
    );
end;
$$ language plpgsql security definer;
