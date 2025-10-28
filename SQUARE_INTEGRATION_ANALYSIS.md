# Square API Integration Analysis

## Current State

The ekaacc repository has a **basic Square API integration** implemented with the following components:

### Existing Implementation

1. **Server-Side Client** (`src/server/square-client.ts`)
   - Uses Square SDK v43.1.1
   - Provides three core functions:
     - `listBookings()` - Fetch bookings list
     - `findCustomerByEmail()` - Search customers by email
     - `createPayment()` - Process payments
   - Configuration via environment variables (`SQUARE_ACCESS_TOKEN`, `SQUARE_ENV`)

2. **API Route** (`src/app/api/square/bookings/route.ts`)
   - GET endpoint to fetch and filter bookings
   - Normalizes Square booking data
   - Filters by email, phone, or userId
   - Returns up to 50 bookings with filtering support

3. **AI Integration** (`src/ai/flows/triage-therapy.ts`)
   - Generates Square booking links based on therapy recommendations
   - Uses hardcoded service IDs and location IDs
   - Creates booking URLs in format: `https://squareup.com/appointments/book/{locationId}/{serviceId}/start`

4. **Documentation** (`docs/SQUARE_INTEGRATION.md`)
   - Comprehensive setup guide
   - Environment variable configuration
   - API usage examples

## Issues and Improvement Opportunities

### 1. **Missing Environment Configuration File**
- **Issue**: No `.env.local.example` file exists despite documentation references
- **Impact**: Developers don't have a template for required environment variables
- **Priority**: High

### 2. **Hardcoded Service and Location IDs**
- **Issue**: Service IDs are hardcoded in `triage-therapy.ts` with placeholder values
- **Current Code**:
  ```typescript
  const serviceMap: Record<string, string> = {
    "massage-therapy": "L5D2M7J4K9N1R/services/6Z3X5Y7A9B1C2D4E",
    "feldenkrais-method": "L5D2M7J4K9N1R/services/7A9B1C2D4E6Z3X5Y",
    "kinesiology": "L5D2M7J4K9N1R/services/8B1C2D4E6Z3X5Y7A",
    "360-therapy": "L5D2M7J4K9N1R/services/9C1D2E4F6G3H5I7J"
  };
  ```
- **Impact**: Booking links won't work in production; requires manual code changes
- **Priority**: High

### 3. **Limited Square Client Functionality**
- **Issue**: Only 3 basic functions implemented
- **Missing Features**:
  - Create/update/cancel bookings
  - List/search catalog items
  - Retrieve customer details
  - Handle webhooks for payment events
  - Refund processing
  - Location management
  - Team member (staff) management
- **Priority**: Medium

### 4. **Weak Error Handling**
- **Issue**: Generic error handling with minimal context
- **Current Approach**: Simple try-catch with basic error messages
- **Missing**:
  - Retry logic for transient failures
  - Rate limit handling
  - Specific error types (authentication, validation, network)
  - Logging and monitoring integration
- **Priority**: Medium

### 5. **No Type Safety for Square API Responses**
- **Issue**: Heavy use of `any` types throughout the codebase
- **Examples**:
  - `createPayment(body: any)`
  - `const page: any = res as any;`
  - `const body: any = resp as any;`
- **Impact**: No compile-time type checking, potential runtime errors
- **Priority**: Medium

### 6. **Missing Webhook Integration**
- **Issue**: No webhook handlers for Square events
- **Missing Functionality**:
  - Payment completion notifications
  - Booking creation/updates
  - Customer updates
  - Signature verification
- **Priority**: Medium

### 7. **No Payment UI Integration**
- **Issue**: Backend payment processing exists but no frontend UI
- **Missing**:
  - Square Web Payments SDK integration
  - Card input forms
  - Payment confirmation flows
  - Receipt generation
- **Priority**: Low (mentioned in future enhancements)

### 8. **Deprecated Square Library Still Present**
- **Issue**: `src/lib/square.ts` exists as a deprecated shim
- **Impact**: Confusion for developers, potential accidental usage
- **Priority**: Low

### 9. **No Integration Tests**
- **Issue**: No tests for Square client wrapper
- **Impact**: Changes could break integration without detection
- **Priority**: Medium

### 10. **Booking Normalization Complexity**
- **Issue**: Complex normalization logic in API route with many fallbacks
- **Impact**: Difficult to maintain, potential bugs with different Square API versions
- **Priority**: Low

## Recommended Improvements (Priority Order)

### High Priority
1. ✅ Create `.env.local.example` with all required variables
2. ✅ Move service/location IDs to environment variables
3. ✅ Add proper TypeScript types for Square API responses
4. ✅ Improve error handling with specific error types

### Medium Priority
5. ✅ Extend Square client with additional API methods
6. ✅ Add webhook handler for Square events
7. ✅ Create integration tests for Square client
8. ✅ Add retry logic and rate limit handling

### Low Priority
9. Document migration path from deprecated `square.ts`
10. Add payment UI components (future phase)

## Next Steps

Implement the high-priority improvements first, then proceed with medium-priority items based on project needs.
