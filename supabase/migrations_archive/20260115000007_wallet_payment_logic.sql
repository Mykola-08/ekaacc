-- WALLET PAYMENT LOGIC
-- Implements the backend logic for paying a booking with wallet credits.

-- 1. Function: Pay Booking with Wallet
create or replace function pay_booking_with_wallet(
  p_booking_id uuid,
  p_user_id uuid
) returns jsonb as $$
declare
  v_booking_price int;
  v_wallet_balance int;
  v_new_balance int;
  v_booking_record record;
begin
  -- A. Get Booking Details
  select * into v_booking_record from booking where id = p_booking_id;
  
  if v_booking_record.id is null then
    return jsonb_build_object('success', false, 'error', 'Booking not found');
  end if;

  -- Check if already paid
  if v_booking_record.payment_status = 'captured' then
    return jsonb_build_object('success', true, 'message', 'Already paid');
  end if;

  v_booking_price := v_booking_record.base_price_cents;

  -- B. Get Wallet Balance (Lock Row)
  select balance_cents into v_wallet_balance 
  from user_wallet 
  where user_id = p_user_id 
  for update;

  if v_wallet_balance is null then
    return jsonb_build_object('success', false, 'error', 'No wallet found');
  end if;

  if v_wallet_balance < v_booking_price then
    return jsonb_build_object('success', false, 'error', 'Insufficient funds');
  end if;

  -- C. Deduction Logic
  v_new_balance := v_wallet_balance - v_booking_price;

  update user_wallet 
  set balance_cents = v_new_balance,
      updated_at = now()
  where user_id = p_user_id;

  -- D. Record Transaction
  insert into wallet_transactions (
    user_id, 
    amount_cents, 
    type, 
    description, 
    reference_id, 
    balance_after_cents
  )
  values (
    p_user_id,
    -v_booking_price,
    'payment',
    'Payment for booking ' || p_booking_id,
    p_booking_id::text,
    v_new_balance
  );

  -- E. Update Booking
  update booking 
  set payment_status = 'captured',
      payment_mode = 'full',
      status = 'scheduled',
      updated_at = now()
  where id = p_booking_id;

  return jsonb_build_object('success', true, 'new_balance', v_new_balance);

exception when others then
  return jsonb_build_object('success', false, 'error', SQLERRM);
end;
$$ language plpgsql security definer;
