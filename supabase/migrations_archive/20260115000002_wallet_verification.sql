
-- EXTENSION FOR WALLET PRODUCTS & PAYMENT VERIFICATION

-- 1. ENHANCE SERVICE FOR UNIFIED PRODUCTS
-- Add 'type' to distinguish booking services from wallet top-ups
alter table service add column if not exists type text default 'service' check (type in ('service', 'product', 'wallet_credit', 'membership'));

-- 2. CREATE PAYMENT PROOFS (THE VERIFICATOR)
-- Stores evidence for manual payment methods (Transfer, Cash, etc.)
create table if not exists payment_proof (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  user_id uuid references auth.users(id),
  booking_id uuid references booking(id),
  wallet_transaction_id uuid references wallet_transactions(id),
  
  -- The Proof
  proof_type text not null check (proof_type in ('image', 'pdf', 'reference_code', 'cash_log')),
  proof_url text, -- URL to storage bucket
  reference_code text, -- e.g. Bank transfer ID
  amount_cents integer not null,
  currency text default 'EUR',
  
  -- Verification Status
  status text default 'pending' check (status in ('pending', 'verified', 'rejected')),
  verified_by uuid references auth.users(id), -- Staff ID
  verified_at timestamptz,
  notes text -- Staff rejection reason or internal note
);

-- RLS for Proofs
alter table payment_proof enable row level security;
create policy "Users can view own proofs" on payment_proof for select using (auth.uid() = user_id);
create policy "Users can upload own proofs" on payment_proof for insert with check (auth.uid() = user_id);
create policy "Staff can manage all proofs" on payment_proof for all using (
  exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'staff', 'therapist'))
);


-- 3. SEED DATA: WALLET TOP-UP PRODUCTS
-- These act as "Services" but logic will treat them as credit purchases
insert into service (id, name, description, type, is_public, metadata)
values 
  (gen_random_uuid(), 'Wallet Credit 50€', 'Add 50 EUR to your digital wallet', 'wallet_credit', true, '{"credit_amount": 5000}'),
  (gen_random_uuid(), 'Wallet Credit 100€', 'Add 100 EUR to your digital wallet (5% Bonus)', 'wallet_credit', true, '{"credit_amount": 10500, "bonus": 500}'),
  (gen_random_uuid(), 'Wallet Credit 200€', 'Add 200 EUR to your digital wallet (10% Bonus)', 'wallet_credit', true, '{"credit_amount": 22000, "bonus": 2000}')
on conflict do nothing; -- IDs are random, so this won't dedup well unless we use specific UUIDs. 
-- In production, we'd use upsert by name or fixed UUIDs. This is illustrative.


-- 4. WALLET & BOOKING TRIGGERS
-- Auto-verify payment if flow is trusted (Optional, usually handled by code)

-- 5. FUNCTION: Verify Payment Proof
-- Atomically updates the proof status AND the related booking/wallet
create or replace function verify_payment_proof(
  p_proof_id uuid,
  p_verifier_id uuid,
  p_status text, -- 'verified' or 'rejected'
  p_notes text
) returns void as $$
declare
  v_booking_id uuid;
  v_wallet_tx_id uuid;
  v_amount int;
  v_user_id uuid;
begin
  -- 1. Update Proof
  update payment_proof 
  set status = p_status, 
      verified_by = p_verifier_id, 
      verified_at = now(), 
      notes = p_notes
  where id = p_proof_id
  returning booking_id, wallet_transaction_id, amount_cents, user_id
  into v_booking_id, v_wallet_tx_id, v_amount, v_user_id;

  -- 2. If Verified...
  if p_status = 'verified' then
    
    -- A. If linked to Booking -> Mark Booking as PAID
    if v_booking_id is not null then
      update booking 
      set payment_status = 'captured',
          status = 'scheduled'
      where id = v_booking_id;
    end if;

    -- B. If linked to Wallet Transaction -> Credit Wallet
    -- (Assuming the wallet tx was created as 'pending_deposit')
    -- If wallet logic requires creating the tx NOW:
    if v_wallet_tx_id is null and v_booking_id is null then
       -- Provide logic to top-up wallet directly if purely a wallet topup proof
       insert into user_wallet (user_id, balance_cents)
       values (v_user_id, v_amount)
       on conflict (user_id) do update
       set balance_cents = user_wallet.balance_cents + v_amount,
           updated_at = now();
           
       insert into wallet_transactions (user_id, amount_cents, type, description, reference_id)
       values (v_user_id, v_amount, 'deposit', 'Manual Bank Transfer Verified', p_proof_id::text);
    end if;

  end if;
end;
$$ language plpgsql security definer;
