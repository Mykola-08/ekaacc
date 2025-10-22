# Firebase Migration Plan — settings (getSettings / updateSettings)

Goal: Replace the mock/localStorage settings persistence with a Firebase Firestore-backed implementation that is secure, performant, and backward-compatible with existing client code (`fxService.getSettings` / `fxService.updateSettings`).

## 1) Desired Firestore schema

Collection: `users` (existing) — extend with subcollection `settings` or a top-level `settings` collection.

Option A (recommended): store settings as a subcollection or document under each user: `users/{userId}/settings/profile` (document)

- Path: `users/{userId}/settings` (document)
- Fields (example):
  - `notifications.email`: boolean
  - `notifications.sms`: boolean
  - `preferences`: map
  - `billing`: map
  - `admin`: map
  - `therapist`: map
  - `patient`: map
  - `updatedAt`: timestamp

Pros: simple, security rules are intuitive (user can only read/write own document), scales with user count.

## 2) Security Rules

Rules should allow a user to read/write only their own settings unless they have elevated roles (Admin). For example:

```javascript
match /users/{userId}/settings {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow write: if request.auth != null && request.auth.uid == userId;
}

// Admin override
match /users/{userId}/settings {
  allow read, write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
}
```

## 3) Implementation steps

1. Add Firestore helper functions in `src/lib/fx-service.ts` or a new `fx-settings.ts` module:
   - `async getSettings(userId: string)`: read `users/{userId}/settings` document and return JSON.
   - `async updateSettings(userId: string, settings: Record<string, any>)`: write merge to Firestore using `set(..., { merge: true })` and return the merged object.

2. Add server-side validation (optional): Use Cloud Functions or Firestore Rules to enforce field types and limits (e.g., `auditRetentionDays` must be integer < 3650).

3. Migration of existing mock/localStorage settings:
   - Create a one-time migration script that reads localStorage backups or CSV export and writes to Firestore. For local dev, keep fallback.

4. Feature flags & rollout:
   - Use an environment variable `NEXT_PUBLIC_USE_MOCK_DATA` to toggle behavior.
   - Deploy Firestore-backed code behind a feature flag and test with staging users.

5. Testing
   - Unit tests for `getSettings/updateSettings` mocking Firestore.
   - Integration tests for the settings UI using a Firebase emulator.

6. Monitoring & rollout
   - Add logging for failures and alerts.
   - Phased rollout: internal users -> beta -> all.

## 4) Code snippet (example)

```ts
// getSettings
const docRef = doc(db, 'users', userId, 'settings');
const snapshot = await getDoc(docRef);
if (snapshot.exists()) return snapshot.data();
return {};

// updateSettings
const docRef = doc(db, 'users', userId, 'settings');
await setDoc(docRef, settings, { merge: true });
return (await getDoc(docRef)).data();
```

## 5) Backwards compatibility

- Keep `fxService` function signatures identical.
- Keep `NEXT_PUBLIC_USE_MOCK_DATA` for dev.
- For safety, if Firestore is unavailable, fall back to previous behavior for a short period while monitoring.

## 6) Rollout checklist

- [ ] Implement Firestore read/write helpers
- [ ] Add Firestore rules & test with emulator
- [ ] Add unit/integration tests
- [ ] Run migration for existing saved settings (if needed)
- [ ] Deploy and monitor

---
If you want, I can implement the Firestore-backed `getSettings`/`updateSettings` now behind the feature flag and add tests against the Firestore emulator (requires additional setup).
