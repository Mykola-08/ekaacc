# How our Firestore rules work and what the app must do

**Goal:** The client app can **create and write** data it owns, therapists/admins can manage assigned records, and public catalogs are readable by anyone. We use **custom claims** (`admin`, `therapist`, and dev-only `env='dev'`, `mock_super`) and **denormalized membership maps** to authorize without extra reads.

## Environment model

- **Prod:** no `env='dev'`, no `mock_super`. Admin writes via Admin SDK or a console user with `admin:true`.
- **Dev/Emulator:** one mock account `demo@ekaacc.com` has claims `{ env:'dev', mock_super:true, admin:true, therapist:true, email:'demo@ekaacc.com' }`. This bypasses most checks for fast setup. Never set these claims in prod.

## Data shape requirements (the app must write these fields)

- `users/{uid}`: user profile. Client can create/update **its own** doc. Client must **never** set privileged fields (`roles`, `admin`, `therapist`, `claims`, `env`, `mock_super`).
- `users/{uid}/sessions/{sessionId}`: must include `userId: <uid>`, `therapistId: <therapistUid>`.
  - Owner (user) and assigned therapist can read/update; admin-like can do all.
- `users/{uid}/reports/{reportId}`: must include `userId`, `therapistId`.
  - Owner and creating/assigned therapist can read/update; admin-like can do all.
- `users/{uid}/subscriptions/{subscriptionId}`: must include `userId`.
  - Only owner or admin-like can read/write.
- `messages/{messageId}`: must include `senderId`, `members: { [uid]: true, [otherUid]: true }`.
  - Only members can read; only `senderId` can edit/delete; admin-like can override.
- `donations/{donationId}`: must include `donorId`, `receiverId`, `members: { [donorUid]: true, [receiverUid]: true }`.
  - Donor creates/updates; both donor/receiver can read; admin-like can override.
- `services/{serviceId}`, `vipPlans/{planId}`: public read; writes only by admin-like (so use Admin SDK in prod).

## Query requirements (rules aren’t filters)

- Messages: `where('members.<currentUid>', '==', true)`, plus `limit()`.
- Donations: `where('members.<currentUid>', '==', true)`, plus `limit()`.
- Sessions/Reports lists for therapists: filter by `therapistId == <currentUid>` and add `limit()`.
- User lists are disabled; address users by exact doc path.

## What enables the app to “write/create databases and everything” (within its scope)

- The app authenticates; Firestore Security Rules allow:
  - Users to create/update **their own** `/users/{uid}`, `/users/{uid}/subscriptions/*`, `/users/{uid}/sessions/*`, `/users/{uid}/reports/*` (with required fields).
  - Therapists (via custom claim) to read/write records where `therapistId == auth.uid`.
  - Admins (via custom claim) to manage everything, including catalogs.
- Dev flow: set mock claims for `demo@ekaacc.com` in **Emulator/dev** with Admin SDK so the app can seed and test end-to-end without hitting prod locks.

## Admin/therapist claims (set server-side only)

- Use Admin SDK once to set:
  - `admin: true` for administrators
  - `therapist: true` for therapist accounts
  - In dev only (Emulator or Dev project): `env:'dev'`, `mock_super:true`, `email:'demo@ekaacc.com'` for the mock account

```ts
import * as admin from 'firebase-admin';
admin.initializeApp();
const user = await admin.auth().getUserByEmail('demo@ekaacc.com');
await admin.auth().setCustomUserClaims(user.uid, {
  env: 'dev',
  mock_super: true,
  admin: true,
  therapist: true,
  email: 'demo@ekaacc.com',
});
```

## Client write examples (what the app should send)

```ts
// Create session (user or admin-like):
await addDoc(collection(db, `users/${uid}/sessions`), {
  userId: uid,
  therapistId: assignedTherapistUid,
  date: serverTimestamp(),
  notes: '',
});

// Create message (sender = current user):
await addDoc(collection(db, 'messages'), {
  senderId: uid,
  members: { [uid]: true, [otherUid]: true },
  text: 'hi',
  createdAt: serverTimestamp(),
});

// List my messages:
const q = query(collection(db, 'messages'),
  where(`members.${uid}`, '==', true),
  orderBy('createdAt', 'desc'),
  limit(50));
```

## Seeding/management rules

- **Prod writes to catalogs** (`/services`, `/vipPlans`) via Admin SDK or a trusted admin UI (account has `admin:true`).
- **Local/Dev seeding**: use the Emulator or Dev project with the mock claims above.

## Deploy model (so “auto-update” from VS Code is real)

- Keep rules in repo (`firestore.rules`).
- Bind a VS Code task to run `firebase deploy --only firestore:rules` to Dev on save/commit.
- Use CI to deploy rules to Prod on merge to `main`.
