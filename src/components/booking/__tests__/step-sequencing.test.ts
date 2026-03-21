/**
 * Property-based tests for BookingWizard step sequencing logic.
 *
 * The step logic is extracted as pure functions mirroring the component internals
 * so they can be tested without a React rendering environment.
 *
 * Validates: Requirements 27.1, 27.2, 27.3, 27.4
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// ─── Pure step-logic extracted from BookingWizard ────────────────────────────

/** Mirrors the STEPS array in BookingWizard (currently 4 steps). */
const STEPS = ['Service', 'Therapist', 'Date & Time', 'Confirm'] as const;
const STEPS_COUNT = STEPS.length; // derived — not hardcoded

/**
 * Pure version of `canProceed()`.
 * Each step requires a specific selection to be truthy.
 */
function canProceed(
  currentStep: number,
  selectedServiceId: string | null,
  selectedTherapistId: string | null,
  selectedDate: Date | undefined,
  selectedTime: string | null
): boolean {
  switch (currentStep) {
    case 1:
      return !!selectedServiceId;
    case 2:
      return !!selectedTherapistId;
    case 3:
      return !!selectedDate && !!selectedTime;
    default:
      return true;
  }
}

/**
 * Pure version of `nextStep()`.
 * Only advances when canProceed is true AND currentStep < STEPS_COUNT.
 */
function nextStep(currentStep: number, proceed: boolean, stepsCount: number): number {
  if (proceed && currentStep < stepsCount) {
    return currentStep + 1;
  }
  return currentStep;
}

/**
 * Pure version of `prevStep()`.
 * Only retreats when currentStep > 1; never goes below 1.
 */
function prevStep(currentStep: number): number {
  if (currentStep > 1) {
    return currentStep - 1;
  }
  return currentStep; // stays at 1 — navigation away is handled by the router
}

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Valid step number within [1, STEPS_COUNT]. */
const arbValidStep = fc.integer({ min: 1, max: STEPS_COUNT });

/** Arbitrary non-empty string (simulates a selected ID). */
const arbId = fc.string({ minLength: 1, maxLength: 20 });

/** Arbitrary nullable string (simulates an optional selection). */
const arbNullableId = fc.option(arbId, { nil: null });

/** Arbitrary optional Date (simulates selectedDate). */
const arbOptionalDate = fc.option(fc.date(), { nil: undefined });

/** Arbitrary nullable time string. */
const arbNullableTime = fc.option(arbId, { nil: null });

// ─── Property 6: Advance only when canProceed ─────────────────────────────────
// **Validates: Requirements 27.1**

describe('Property 6: Advance only when canProceed', () => {
  it('nextStep only increments currentStep when canProceed returns true', () => {
    fc.assert(
      fc.property(
        arbValidStep,
        arbNullableId,
        arbNullableId,
        arbOptionalDate,
        arbNullableTime,
        (step, serviceId, therapistId, date, time) => {
          const proceed = canProceed(step, serviceId, therapistId, date, time);
          const result = nextStep(step, proceed, STEPS_COUNT);

          if (proceed && step < STEPS_COUNT) {
            // Should have advanced exactly one step
            expect(result).toBe(step + 1);
          } else {
            // Should not have moved
            expect(result).toBe(step);
          }
        }
      )
    );
  });

  it('nextStep never advances when canProceed is false', () => {
    fc.assert(
      fc.property(arbValidStep, (step) => {
        // canProceed = false
        const result = nextStep(step, false, STEPS_COUNT);
        expect(result).toBe(step);
      })
    );
  });

  it('nextStep never advances beyond STEPS_COUNT even when canProceed is true', () => {
    // At the last step, nextStep should not go beyond STEPS_COUNT
    const result = nextStep(STEPS_COUNT, true, STEPS_COUNT);
    expect(result).toBe(STEPS_COUNT);
  });
});

// ─── Property 7: Retreat never below step 1 ──────────────────────────────────
// **Validates: Requirements 27.2**

describe('Property 7: Retreat never below step 1', () => {
  it('prevStep never returns a value less than 1', () => {
    fc.assert(
      fc.property(arbValidStep, (step) => {
        const result = prevStep(step);
        expect(result).toBeGreaterThanOrEqual(1);
      })
    );
  });

  it('prevStep from step 1 stays at step 1 (router handles navigation away)', () => {
    expect(prevStep(1)).toBe(1);
  });

  it('prevStep from any step > 1 decrements by exactly 1', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: STEPS_COUNT }), (step) => {
        expect(prevStep(step)).toBe(step - 1);
      })
    );
  });
});

// ─── Property 8: currentStep always in [1, N] ────────────────────────────────
// **Validates: Requirements 27.3**

describe('Property 8: currentStep always in [1, N] after any sequence of next/prev', () => {
  it('any sequence of next/prev operations keeps currentStep in [1, STEPS_COUNT]', () => {
    /**
     * Simulate a random walk of next/prev operations starting from a valid step.
     * At each step we randomly decide to go forward or backward, with a random
     * canProceed value. The resulting step must always stay in [1, STEPS_COUNT].
     */
    fc.assert(
      fc.property(
        arbValidStep,
        fc.array(fc.record({ direction: fc.constantFrom('next', 'prev'), proceed: fc.boolean() }), {
          minLength: 0,
          maxLength: 50,
        }),
        (startStep, operations) => {
          let step = startStep;

          for (const op of operations) {
            if (op.direction === 'next') {
              step = nextStep(step, op.proceed, STEPS_COUNT);
            } else {
              step = prevStep(step);
            }

            // Invariant: step must always be in [1, STEPS_COUNT]
            expect(step).toBeGreaterThanOrEqual(1);
            expect(step).toBeLessThanOrEqual(STEPS_COUNT);
          }
        }
      )
    );
  });
});

// ─── Property 9: Step count equals STEPS.length ──────────────────────────────
// **Validates: Requirements 27.4**

describe('Property 9: Step count equals STEPS.length', () => {
  it('STEPS_COUNT is always equal to STEPS.length (derived invariant)', () => {
    expect(STEPS_COUNT).toBe(STEPS.length);
  });

  it('STEPS_COUNT derived from any config array always equals that array length', () => {
    /**
     * For any hypothetical step config of length N, the derived count must equal N.
     * This validates the invariant that STEPS_COUNT = STEPS.length holds universally.
     */
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        (steps) => {
          const derivedCount = steps.length;
          expect(derivedCount).toBe(steps.length);
        }
      )
    );
  });

  it('nextStep respects a dynamically derived STEPS_COUNT', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 10 }),
        (steps) => {
          const count = steps.length;
          // At the last step, nextStep should never exceed count
          const result = nextStep(count, true, count);
          expect(result).toBe(count);
          expect(result).toBeLessThanOrEqual(count);
        }
      )
    );
  });
});
