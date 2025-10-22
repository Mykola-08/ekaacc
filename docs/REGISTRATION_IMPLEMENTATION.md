# Registration Flow Implementation

## Overview

The multi-role registration system allows users to be created through three different methods:

1. **Self-Registration**: Users create their own account
2. **Admin-Created**: Admins create accounts for users
3. **Therapist-Created**: Therapists create patient accounts

## Architecture

### Service Layer

**File**: `src/services/registration-service.ts`

```typescript
interface IRegistrationService {
  registerUser(data: RegistrationData): Promise<RegistrationResult>;
  validateRegistrationData(data: RegistrationData): { valid: boolean; errors: string[] };
  isEmailAvailable(email: string): Promise<boolean>;
  generateTemporaryPassword(): string;
  sendWelcomeEmail(userId: string, email: string, tempPassword?: string): Promise<void>;
}
```

### Registration Data Structure

```typescript
interface RegistrationData {
  email: string;
  password?: string; // Not required for admin/therapist-created accounts
  name: string;
  displayName?: string;
  phoneNumber?: string;
  role: 'Patient' | 'Therapist' | 'Admin';
  method: 'self' | 'admin-created' | 'therapist-created';
  createdBy?: string; // Admin or Therapist user ID
  createdByName?: string;
  sendWelcomeEmail: boolean;
  initialWalletBalance?: number;
  referralCode?: string;
  metadata?: {
    notes?: string;
    [key: string]: any;
  };
}
```

### Registration Result

```typescript
interface RegistrationResult {
  success: boolean;
  userId?: string;
  user?: any;
  walletId?: string;
  error?: string;
  requiresEmailVerification?: boolean;
  temporaryPassword?: string; // For admin/therapist-created accounts
}
```

## Registration Flows

### 1. Self-Registration Flow

**User Journey:**

1. User visits registration page
2. Fills out form with email, password, name
3. Optionally enters referral code
4. Submits registration
5. Receives email verification link
6. Verifies email
7. Wallet and loyalty program auto-initialized

**Implementation:**

- Requires password (min 8 characters)
- Email verification required
- Auto-enrolls in loyalty program (if Patient)
- Creates wallet with €0 balance
- Processes referral code if provided

### 2. Admin-Created Flow

**Admin Journey:**

1. Admin navigates to `/admin/create-user`
2. Fills out user details
3. Selects role (Patient, Therapist, or Admin)
4. Optionally sets initial wallet balance
5. Optionally enters referral code
6. Chooses to send welcome email
7. Submits form
8. System generates temporary password
9. Password displayed to admin
10. Email sent to user if enabled

**Implementation:**

- No password required from admin
- System generates secure temporary password (12 chars)
- User must change password on first login
- Can set initial wallet balance
- Can apply referral codes
- Auto-initializes wallet and loyalty

**Admin UI**: `src/app/admin/create-user/page.tsx`

### 3. Therapist-Created Flow

**Therapist Journey:**

1. Therapist creates patient account during session
2. Fills out basic patient info
3. System generates temporary password
4. Therapist shares credentials with patient
5. Patient logs in and changes password

**Implementation:**

- Same as admin-created but limited to Patient role
- Therapist cannot create Admin or Therapist accounts
- Same auto-initialization features

## Features

### Automatic Initialization

When a new user registers (any method), the system automatically:

1. **Creates Wallet**
   - Initial balance: €0 (or custom amount for admin/therapist-created)
   - Currency: EUR
   - Status: Active
   - Welcome bonus can be configured

2. **Enrolls in Loyalty Program** (Patients only)
   - Starting tier: Bronze
   - Initial points: 100 (welcome bonus)
   - Multiplier: 1x
   - Auto-activated

3. **Processes Referral Code** (if provided)
   - Validates code exists and is active
   - Creates referral record
   - Status: 'registered' (becomes 'completed' after first session)
   - Prepares rewards for both referrer and referee

### Password Management

**Self-Registration:**

- User creates own password
- Must meet minimum requirements (8+ chars)
- Standard Firebase Auth password policies apply

**Admin/Therapist-Created:**

- System generates random secure password
- Format: 12 characters (uppercase, lowercase, numbers, symbols)
- Displayed once to creator
- Optionally emailed to user
- User must change on first login

**Generation Algorithm:**

```typescript
function generatePassword(): string {
  // Ensures at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  // Total length: 12 characters
  // Excludes ambiguous characters (0, O, l, I)
}
```

### Email Notifications

**Welcome Email** (optional):

- Sent to newly created users
- Contains temporary credentials
- Includes first login instructions
- Password change requirement notice

**Verification Email** (self-registration):

- Sent automatically by Firebase Auth
- Contains verification link
- Account activated upon click

## Validation

### Client-Side Validation

```typescript
validateRegistrationData(data: RegistrationData): {
  valid: boolean;
  errors: string[];
}
```

**Checks:**

- Email format (contains @)
- Name length (min 2 characters)
- Password strength (8+ chars, self-registration only)
- Valid role selection
- Creator ID present (admin/therapist-created)
- Initial balance >= 0

### Server-Side Validation

**Cloud Function Requirements:**

1. Verify email not already registered
2. Validate role permissions (who can create what)
3. Verify referral code if provided
4. Confirm creator has permission
5. Apply rate limiting

## Mock vs Firestore

### Mock Implementation

**Features:**

- Full registration flow simulation
- Console logging for tracking
- Temporary password generation
- Email availability checking
- In-memory user storage

**Purpose:**

- Development without Firebase setup
- Testing registration flows
- UI development and debugging

### Firestore Implementation

**Requirements:**
Must implement Cloud Functions:

1. **registerUser** (HTTP Callable)

   ```typescript
   Input: RegistrationData
   Output: RegistrationResult
   
   Process:
   - Create Firebase Auth user
   - Create Firestore user document
   - Trigger createUserWallet Cloud Function
   - Auto-enroll in loyalty (if Patient)
   - Process referral code (if provided)
   - Send welcome email
   - Return result with user ID and temp password
   ```

2. **checkEmailAvailability** (HTTP Callable)

   ```typescript
   Input: email
   Output: { available: boolean }
   ```

## Security Considerations

### Firestore Rules

```javascript
// Users collection
match /users/{userId} {
  // Admins can create any user
  allow create: if isAdmin();
  
  // Therapists can only create Patients
  allow create: if isTherapist() && 
                   request.resource.data.role == 'Patient' &&
                   request.resource.data.createdBy == request.auth.uid;
  
  // Self-registration creates own account
  allow create: if request.auth.uid == userId &&
                   request.resource.data.method == 'self';
}
```

### Best Practices

1. **Password Security**
   - Never store passwords in Firestore
   - Use Firebase Auth for password management
   - Temporary passwords expire after first login
   - Enforce password change on first login

2. **Email Verification**
   - Required for self-registration
   - Optional for admin/therapist-created
   - Use Firebase Auth email templates

3. **Role Assignment**
   - Only admins can create Admin accounts
   - Therapists limited to Patient creation
   - Validate role permissions server-side

4. **Data Privacy**
   - Don't log sensitive data
   - Encrypt temporary passwords in transit
   - Delete temporary credentials after use

## UI Components

### Admin Create User Page

**Path**: `/admin/create-user`

**Features:**

- Form with validation
- Role selection dropdown
- Initial balance input
- Referral code field
- Welcome email checkbox
- Success dialog with temp password
- Copy password button
- Reset form button

**Permissions:**

- Admins: Full access
- Therapists: Limited to Patient creation
- Patients: No access

## Testing

### Test Scenarios

1. **Self-Registration**
   - Valid email/password
   - Duplicate email
   - Invalid email format
   - Weak password
   - With referral code
   - Without referral code

2. **Admin-Created**
   - Create Patient
   - Create Therapist
   - Create Admin
   - With initial balance
   - With referral code
   - Send welcome email
   - Don't send welcome email

3. **Therapist-Created**
   - Create Patient (allowed)
   - Attempt create Therapist (should fail)
   - Attempt create Admin (should fail)

4. **Wallet Initialization**
   - Verify wallet created
   - Check initial balance
   - Confirm currency is EUR
   - Verify wallet is active

5. **Loyalty Enrollment**
   - Patients auto-enrolled
   - Starting points: 100
   - Tier: Bronze
   - Status: Active

6. **Referral Processing**
   - Valid code applied
   - Invalid code rejected
   - Expired code rejected
   - Usage limit respected

## Error Handling

### Common Errors

```typescript
{
  success: false,
  error: "Email is already registered"
}

{
  success: false,
  error: "Invalid referral code"
}

{
  success: false,
  error: "You don't have permission to create Admin accounts"
}

{
  success: false,
  error: "Initial wallet balance cannot be negative"
}
```

### Error Display

- Client-side validation shows inline errors
- Server errors displayed in toast notifications
- Form maintains state on error
- Clear error messages guide user

## Future Enhancements

1. **Bulk Import**
   - CSV upload for multiple users
   - Batch processing
   - Progress tracking

2. **Custom Welcome Templates**
   - Personalized email templates
   - Multiple languages
   - Custom branding

3. **Advanced Permissions**
   - Department-based access
   - Time-limited accounts
   - Custom roles

4. **Audit Logging**
   - Track who created whom
   - Registration history
   - Failed attempt monitoring

5. **Two-Factor Authentication**
   - Optional 2FA for admins
   - SMS verification
   - Authenticator app support

## Environment Variables

```env
# Registration Settings
NEXT_PUBLIC_USE_MOCK_DATA=true  # Use mock registration service

# Firebase (Production)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Email Settings
SENDGRID_API_KEY=...  # For welcome emails
DEFAULT_FROM_EMAIL=noreply@ekaacc.com
```

## Quick Start

### Using Mock Service (Development)

```typescript
// 1. Import service
import { getRegistrationService } from '@/services/registration-service';

// 2. Get instance
const service = await getRegistrationService();

// 3. Register user
const result = await service.registerUser({
  email: 'user@example.com',
  name: 'John Doe',
  role: 'Patient',
  method: 'self',
  password: 'SecurePass123!',
  sendWelcomeEmail: true,
});

// 4. Handle result
if (result.success) {
  console.log('User created:', result.userId);
  console.log('Wallet ID:', result.walletId);
} else {
  console.error('Error:', result.error);
}
```

### Admin Creating User

```typescript
const result = await service.registerUser({
  email: 'patient@example.com',
  name: 'Jane Smith',
  role: 'Patient',
  method: 'admin-created',
  createdBy: currentUser.id,
  createdByName: currentUser.name,
  sendWelcomeEmail: true,
  initialWalletBalance: 50,
  referralCode: 'EKA2024ABC',
});

if (result.success) {
  // Show temp password to admin
  console.log('Temporary password:', result.temporaryPassword);
}
```

## Summary

The registration system provides:

- ✅ Multi-role registration (self, admin, therapist)
- ✅ Automatic wallet initialization
- ✅ Automatic loyalty enrollment
- ✅ Referral code processing
- ✅ Temporary password generation
- ✅ Welcome email notifications
- ✅ Complete validation
- ✅ Mock and Firestore implementations
- ✅ Admin UI for user creation
- ✅ Security best practices
