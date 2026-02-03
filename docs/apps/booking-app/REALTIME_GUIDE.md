# Realtime Features Guide

This guide details the Realtime integration added to the Booking App using Supabase Realtime.

## 1. Setup & Migration
Realtime capabilities are enabled via Supabase Publications.
Tables enabled:
- **Core**: `booking`, `staff`, `service_variant`
- **User**: `user_rewards_balance`, `app_notifications`
- **AI/Chat**: `ai_conversations`, `ai_messages`, `ai_interactions`

**Migration Applied:**
The migration `enable_realtime_chat_ai_booking` has been applied to the database.

## 2. Hooks API
We have introduced a set of hooks for consuming realtime events.

### `useRealtimeSubscription`
Generic hook to subscribe to any table changes.
```typescript
useRealtimeSubscription({
  table: 'booking',
  filter: 'status=eq.completed',
  callback: (payload) => console.log(payload)
});
```

### `useBookingRealtime`
Specific hook for booking updates.
Used in `BookingHistoryList` to update status without refresh and trigger re-fetch on new bookings.

### `usePresence`
Hook for tracking online user state in a "room".
Useful for:
- Showing "Therapist Online" badge.
- Preventing double bookings (showing "Someone is viewing this slot").

### `useNotifications`
Hook for receiving instant alerts (System outages, Rewards, etc).

## 3. UI Components

### `TherapistStatus`
A component that displays a green "Online Now" indicator if the staff member is present in the global channel.

```tsx
<TherapistStatus staffId="123" />
```

### `NotificationDropdown`
A header dropdown that shows a live feed of personal notifications.

### `NotificationsListener`
A headless component in `RootLayout` that triggers Toast alerts for incoming messages.

## 4. Implementation Details

- **BookingWizard**:
    - **Presence**: Shows "X people viewing" badge to create urgency.
    - **Realtime Availability**: Listens for new bookings. If a slot on the selected day is taken, it automatically re-fetches the available slots.
- **TherapistDashboard**:
    - Listens for any booking changes.
    - Triggers `router.refresh()` to instantly update the schedule view when a client books or cancels.
- **BookingHistoryList**: Updated to listen for status changes (`scheduled` -> `completed`/`cancelled`) and update the UI instantly.
- **Global**: `NotificationsListener` is active on all pages.

## 5. Testing
1. **Presence**: Open `BookingWizard` in two tabs/browsers. See the "Viewing" count increase.
2. **Booking**: Book a slot in Tab A. Tab B (if viewing same day) should flash "Refreshing..." or update slots.
3. **Dashboard**: Open Therapist Dashboard. Make a booking as client. Dashboard should auto-reload with new item.
4. **Notifications**: Insert a row into `app_notifications`. See Toast appear.

## 6. Broadcasting Updates
To send a notification to a user, insert into `app_notifications`:
```sql
insert into app_notifications (recipient_id, title, message, type)
values ('user-uuid', 'Booking Confirmed', 'Your session starts in 1 hour.', 'success');
```
The user will instantly see a Toast and the Bell icon will show a red dot.
