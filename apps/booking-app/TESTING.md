# Testing

## Framework
Uses Vitest for unit-style testing of Next.js route handlers without spinning up a full server.

## Running
```
npm run test
```
Use watch mode during development:
```
npm run test:watch
```

## Approach
Route handlers are pure async functions accepting `Request` + params. Tests construct mock `Request` objects and monkey patch Supabase client methods.

### Mocking Supabase
Temporarily override `supabase.from` to return objects implementing chained methods used in handlers. Keep mocks minimal.

### Mocking Stripe
Vitest module mock for `stripe` returning predictable refund behavior.

### Future Enhancements
- Integration tests using local Supabase (Docker emulator) applying full schema.
- Stripe test mode simulation verifying webhook interactions end-to-end.
- Load tests for availability endpoint concurrency.
- Snapshot tests for structured responses (e.g., API schema validation via Zod).

## Coverage Targets
Focus on:
1. Booking creation (slot conflict, deposit validation)
2. Availability generation (staff schedules + overlap filtering)
3. Cancellation refund logic
4. Token security (expiry, rotation) – add tests with injected secrets.

## Adding New Tests
Place files under `tests/*.test.ts`. Each test should isolate side-effects and restore original implementations in `afterEach`.
