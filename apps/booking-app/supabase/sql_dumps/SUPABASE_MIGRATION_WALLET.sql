-- Migration for Wallet and Payment Methods

-- 1. Create Wallet Table
create table if not exists user_wallet (
  user_id uuid primary key, -- Maps to auth.users.id
  balance_cents integer default 0,
  currency text default 'EUR',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Create Wallet Transactions Table
create table if not exists wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references user_wallet(user_id),
  amount_cents integer not null, -- Positive for credit, negative for debit
  type text not null, -- 'deposit', 'purchase', 'refund', 'bonus'
  reference_id text, -- e.g. Booking ID or Payment Intent ID
  description text,
  created_at timestamptz default now()
);

-- 3. Update Booking Table
alter table booking add column if not exists payment_method text default 'stripe';
-- Add check constraint for payment_method
alter table booking drop constraint if exists booking_payment_method_check;
alter table booking add constraint booking_payment_method_check 
  check (payment_method in ('stripe', 'wallet', 'bizum', 'terminal'));

-- 4. RLS Policies
alter table user_wallet enable row level security;
create policy "Users can view own wallet" on user_wallet
  for select using (auth.uid() = user_id);

alter table wallet_transactions enable row level security;
create policy "Users can view own transactions" on wallet_transactions
  for select using (auth.uid() = user_id);

-- 5. Function to update wallet balance
create or replace function update_wallet_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_wallet_modtime
  before update on user_wallet
  for each row execute procedure update_wallet_updated_at();
