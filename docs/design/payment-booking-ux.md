# Payment & Booking UX Cheat Sheet

This guide applies the [General UX Principles](./ux-principles.md) specifically
to high-stakes flows like Payment, Booking, and Checkouts.

## 1. Flow & Structure

**Goal:** Reduce abandonment by managing **Cognitive Load (#4)**.

### Principles to Apply

- **Progressive Disclosure (#7)**: User input should be broken into manageable
  chunks.
  - _Implementation_: Keep the `BookingWizard` flow: Time Selection → Add-ons →
    User Details → Payment. Never show credit card fields on the calendar step.
- **Goal Gradient Effect (#51)**: Users are more motivated as they get closer to
  the end.
  - _Action_: Always display a "Step X of Y" or a visual progress bar.
- **Hick’s Law (#1)**: Reduce choices to speed up decision-making.
  - _Action_: If offering many Service Variants, group them. Don't list 10
    options flat; use categories.

### Critical Checklist

- [ ] **State Retention**: If the user refreshes, restore their selected Date
      and Service (e.g., via URL params or `localStorage`).
- [ ] **Guest Checkout**: Do not force Account Creation before the "Pay" button.
      Allow it as an _option_.

## 2. Trust & Psychology

**Goal:** Increase conversion and reassure the user during "high-anxiety"
clicks.

### Principles to Apply

- **Social Proof (#30) & Scarcity (#31)**:
  - _Implementation_: Continue using `usePresence` to show active viewers ("3
    people looking at this service").
  - _Action_: When slots are low (e.g., < 3 active spots), explicitly label
    them: "Only 1 left."
- **Authority Bias (#42)**:
  - _Action_: Place trust badges (Stripe, SSL, "Secure Payment") immediately
    near the Credit Card input.
- **Loss Aversion (#65)**:
  - _Tip_: Once a time is selected, use language like "Slot held for 5:00" to
    imply ownership. Users fight harder not to _lose_ a slot they "have".

## 3. Feedback & Interaction

**Goal:** Communicate system status clearly (The "System Image").

### Principles to Apply

- **Feedback Loop (#27)**: Every interaction must have a reaction.
  - _Good_: `loadingSlots` spinner when changing dates.
  - _Bad_: Clicking "Pay" and seeing nothing change for 2 seconds.
- **Labor Illusion (#62)**:
  - _Tip_: For payment processing, a visual spinner that lasts at least ~1-2
    seconds increases confidence that "security checks are running," even if the
    API is faster.
- **Fitts’s Law (#8)**:
  - _Action_: The "Book" and "Pay" buttons should be full-width on mobile and at
    least 44px tall.

## 4. Error Prevention & Recovery

- **Input Constraints (Affordances #18)**:
  - Use `inputmode="numeric"` for Credit Cards and Phones.
  - Disable `autocomplete` and `autocorrect` for unique codes or names as per
    [Forms Guide](./forms-controls.md).
- **Confirmation**:
  - Show a "Review" step before the final charge. This acts as a **Feedforward
    (#52)** mechanism, letting users predict the outcome.

## 5. Other High-Risk Actions (Settings/Data)

- **Idempotency**: Ensure the "Pay" button becomes `disabled` immediately after
  the first click to prevent double-charging.
- **Destructive Actions**: Use **Confirmation Bias (#2)** to your advantage—if
  deleting a booking, ask "Keep Booking?" (primary) vs "Cancel" (secondary) to
  prevent accidental loss.
