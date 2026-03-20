/**
 * Property-based tests for the `can()` permission helper.
 *
 * Validates: Requirements 26.1, 26.2, 26.3, 26.4, 26.5
 */

import { describe, it, expect, vi } from 'vitest';
import * as fc from 'fast-check';

// Mock the supabase server module so the pure `can()` function can be imported
// without requiring a Next.js server context.
vi.mock('@/lib/supabase/server', () => ({
    createClient: vi.fn(),
}));

import { can, type PermissionRecord } from '../permissions';

// ─── Arbitraries ─────────────────────────────────────────────────────────────

/** Arbitrary non-empty string (group / action names) */
const arbString = fc.string({ minLength: 1, maxLength: 20 });

/** Arbitrary PermissionRecord */
const arbPermissionRecord: fc.Arbitrary<PermissionRecord> = fc.record({
    group: arbString,
    action: arbString,
});

/** Arbitrary non-empty array of PermissionRecords */
const arbPermissions = fc.array(arbPermissionRecord, { minLength: 0, maxLength: 10 });

// ─── Property 1: Always returns boolean ──────────────────────────────────────
// **Validates: Requirements 26.1**

describe('Property 1: Always returns boolean', () => {
    it('typeof can(...) === "boolean" for all inputs', () => {
        fc.assert(
            fc.property(arbPermissions, arbString, arbString, (permissions, group, action) => {
                const result = can(permissions, group, action);
                expect(typeof result).toBe('boolean');
                // Strictly true or false — not truthy/falsy non-boolean
                expect(result === true || result === false).toBe(true);
            }),
        );
    });
});

// ─── Property 2: Empty permissions always returns false ───────────────────────
// **Validates: Requirements 26.2**

describe('Property 2: Empty permissions always returns false', () => {
    it('can([], group, action) === false for all group/action pairs', () => {
        fc.assert(
            fc.property(arbString, arbString, (group, action) => {
                expect(can([], group, action)).toBe(false);
            }),
        );
    });
});

// ─── Property 3: manage action grants all ────────────────────────────────────
// **Validates: Requirements 26.3**

describe('Property 3: manage action grants all', () => {
    it('returns true when any entry has { group, action: "manage" }', () => {
        fc.assert(
            fc.property(
                arbString, // group
                arbString, // queried action (any)
                fc.array(arbPermissionRecord, { minLength: 0, maxLength: 5 }), // extra entries
                (group, queriedAction, extras) => {
                    const manageEntry: PermissionRecord = { group, action: 'manage' };
                    // Place the manage entry anywhere in the array
                    const permissions = [...extras, manageEntry];
                    expect(can(permissions, group, queriedAction)).toBe(true);
                },
            ),
        );
    });
});

// ─── Property 4: Pure function / idempotence ─────────────────────────────────
// **Validates: Requirements 26.4**

describe('Property 4: Pure function / idempotence', () => {
    it('calling can() twice with the same args returns the same result', () => {
        fc.assert(
            fc.property(arbPermissions, arbString, arbString, (permissions, group, action) => {
                const first = can(permissions, group, action);
                const second = can(permissions, group, action);
                expect(first).toBe(second);
            }),
        );
    });
});

// ─── Property 5: No matching group returns false ──────────────────────────────
// **Validates: Requirements 26.5**

describe('Property 5: No matching group returns false', () => {
    it('returns false when no entry matches the queried group', () => {
        fc.assert(
            fc.property(
                // Generate a group name that is guaranteed not to appear in the permissions
                fc.uniqueArray(arbString, { minLength: 1, maxLength: 6 }).chain((groups) => {
                    // queriedGroup is the last element; permissions only use the other groups
                    const queriedGroup = groups[groups.length - 1];
                    const otherGroups = groups.slice(0, -1);

                    const permissionsArb =
                        otherGroups.length === 0
                            ? fc.constant<PermissionRecord[]>([])
                            : fc.array(
                                fc.record({
                                    group: fc.constantFrom(...otherGroups),
                                    action: arbString,
                                }),
                                { minLength: 0, maxLength: 8 },
                            );

                    return permissionsArb.map((permissions) => ({ permissions, queriedGroup }));
                }),
                arbString, // queried action
                ({ permissions, queriedGroup }, action) => {
                    expect(can(permissions, queriedGroup, action)).toBe(false);
                },
            ),
        );
    });
});
