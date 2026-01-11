# Personalization + Booking Ecosystem Feature Map

## 1. Core Roles & Relationships

### Roles
* **Admin**
* **Therapist**
* **Client**
* **Guardian / Parent (client subtype)**

### Relationships
* **Parent → Child**
  * Shared access to bookings, payments, notes (configurable)
  * Separate medical profiles
* **Client ↔ Therapist**
  * Trust level (affects payment verification rules)
* **Client ↔ Client**
  * Optional: family, partner, dependent

---

## 2. User Profiles (Personalization Base)

### Required fields
* Full name
* Date of birth (critical for personalization)
* Gender (optional)
* Language
* Country / city
* Role
* Relationship links (parent/child)

### Health-related (layered, not all mandatory)
* Goals (pain relief, stress, rehab, spiritual work, etc.)
* Preferences (massage type, therapist gender, intensity)
* Contraindications / notes
* Session history signals (what worked / didn’t)

This feeds **recommendations**, **UI**, and **notifications**.

---

## 3. Booking System (Client Side)

Even if booking is “another app”, this app must **consume and contextualize** it.

### Features
* Upcoming bookings
* Past bookings (filterable)
* Booking details:
  * Service
  * Therapist
  * Duration
  * Notes
  * Payment status
* Change / cancel (rules by service & plan)
* Rebook in 1 tap
* Book for:
  * Self
  * Child / dependent

---

## 4. Booking System (Therapist Side)

* Daily / weekly schedule
* Client profiles linked to sessions
* Session confirmation
* Session notes (private + shareable)
* Payment verification panel
* Trust flags per client

---

## 5. Payments & Verification (Critical)

### Payment Methods
* Stripe (direct)
* External payment:
  * Transfer
  * Cash
  * Crypto / third-party (Bithumb-like)

### Payment States
* Pending
* Paid (auto)
* Paid (manual verification)
* Disputed

### Therapist Controls
* **Manual verification toggle per client**
  * Trusted client → auto-accept
  * New / risky → manual proof required
* Upload proof (screenshot, reference code)
* Admin override

---

## 6. Wallet & Points (Same Screen)

### Wallet
* Balance (real money)
* Credits (prepaid sessions / packages)
* Used for:
  * Bookings
  * VIP plans
  * Discounts

### Points
* Earned from:
  * Sessions
  * Reviews
  * Loyalty streaks
* **NOT convertible to money**
* Can be used for:
  * Discounts
  * Bonuses
  * Priority booking
  * Gifts

Single dashboard. No confusion.

---

## 7. Personalization Engine (Core Value)

### Inputs
* Age
* Booking history
* Therapy types used
* Therapist feedback
* Goals
* Seasonality
* Engagement level

### Outputs
* Recommended services
* Recommended therapists
* Suggested frequency
* “You should book next week” nudges
* VIP plan suggestions
* Content suggestions (education, prep)

This drives **home screen**, **notifications**, and **emails**.

---

## 8. Home Screen (Per Role)

### Client
* Next session countdown
* Personalized recommendation
* Wallet + points
* Quick actions:
  * Book again
  * Contact therapist
  * Leave review

### Parent
* Switch between profiles
* Alerts for children’s sessions
* Shared wallet

### Therapist
* Today’s sessions
* Pending payments
* Notes to review
* Client alerts

### Admin
* KPIs
* Payment issues
* User trust flags
* Manual overrides

---

## 9. Reviews & Social Proof

* Review after session
* Public / private toggle
* Therapist reply
* Admin moderation
* Optional anonymization

No social feed. Focused, clean.

---

## 10. Loyalty & VIP Plans

* Tiered plans (Basic / VIP / Elite)
* Benefits:
  * Priority booking
  * Discounts
  * Free sessions
  * Direct therapist chat
* Family plans
* Auto-renew via wallet / Stripe

---

## 11. Notifications System

Personalized, not spam.

* Booking reminders
* “It’s time to book again”
* Payment confirmation
* Therapist messages
* VIP offers (limited)

Rules depend on user behavior.

---

## 12. Trust & Safety (Non-obvious but needed)

* Therapist verification levels
* Client trust score (internal)
* Flag system for payments / no-shows
* Soft restrictions instead of bans

---

## 13. Admin Superpowers

* Impersonate user
* Edit relationships
* Adjust wallet / points
* Force-verify payments
* Global rules:
  * Cancellation policies
  * Verification thresholds

---

## 14. Future-Ready (Optional but smart)

* AI session summaries
* AI recommendations explanation (“why this?”)
* Therapist matching score
* Health journey timeline
* Export data (PDF)

---

## Bottom line

This app is **not just booking**.
It’s a **relationship + trust + personalization system** around therapy.
