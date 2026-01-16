-- Migration for Rewards System
-- 1. Ensure type column exists on service
alter table service add column if not exists type text default 'service';

-- 2. Create Rewards
-- We use a dedicated function to avoid duplicates
do $$
declare
  tote_id uuid;
  session_id uuid;
  discount_id uuid;
begin
  -- Reward 1: EKA Tote Bag (Merchandise)
  if not exists (select 1 from service where name = 'EKA Tote Bag (Reward)') then
    insert into service (name, description, type, metadata, is_public, active)
    values (
      'EKA Tote Bag (Reward)', 
      'Exclusive organic cotton tote bag. Perfect for your daily essentials.', 
      'reward', 
      '{"point_cost": 500, "category": "merch"}'::jsonb, 
      true, 
      true
    );
  end if;

  -- Reward 2: Free 30min Session
  if not exists (select 1 from service where name = 'Free 30min Session (Reward)') then
    insert into service (name, description, type, metadata, is_public, active)
    values (
      'Free 30min Session (Reward)', 
      'Redeem 1000 points for a free introductory or follow-up session.', 
      'reward', 
      '{"point_cost": 1000, "category": "session"}'::jsonb, 
      true, 
      true
    );
  end if;

  -- Reward 3: 10% Discount Coupon
  if not exists (select 1 from service where name = '10% Discount (Reward)') then
    insert into service (name, description, type, metadata, is_public, active)
    values (
      '10% Discount (Reward)', 
      'Get 10% off your next booking.', 
      'reward', 
      '{"point_cost": 200, "category": "discount", "discount_percent": 10}'::jsonb, 
      true, 
      true
    );
  end if;
end $$;
