/**
 * Registration Service
 * 
 * Handles multi-role user registration with automatic wallet and loyalty initialization
 */

import type { 
  RegistrationData, 
  RegistrationResult,
  RegistrationMethod 
} from '@/lib/wallet-types';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

/**
 * Registration Service Interface
 */
export interface IRegistrationService {
  /**
   * Register a new user
   * - Self-registration: User creates their own account
   * - Admin-created: Admin creates account and sends credentials
   * - Therapist-created: Therapist creates account and sends credentials
   */
  registerUser(data: RegistrationData): Promise<RegistrationResult>;
  
  /**
   * Validate registration data before submission
   */
  validateRegistrationData(data: RegistrationData): { valid: boolean; errors: string[] };
  
  /**
   * Check if email is already registered
   */
  isEmailAvailable(email: string): Promise<boolean>;
  
  /**
   * Generate a temporary password for admin/therapist-created accounts
   */
  generateTemporaryPassword(): string;
  
  /**
   * Send welcome email with credentials (for admin/therapist-created accounts)
   */
  sendWelcomeEmail(userId: string, email: string, tempPassword?: string): Promise<void>;
}

/**
 * Helper: Generate random temporary password
 */
function generatePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]; // Uppercase
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]; // Lowercase
  password += '0123456789'[Math.floor(Math.random() * 10)]; // Number
  password += '!@#$%&*'[Math.floor(Math.random() * 7)]; // Special
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

/**
 * Mock Registration Service Implementation
 */
class MockRegistrationService implements IRegistrationService {
  private registeredEmails: Set<string> = new Set([
    'john@example.com',
    'jane@example.com',
    'admin@ekaacc.com',
    'therapist@ekaacc.com',
  ]);

  async registerUser(data: RegistrationData): Promise<RegistrationResult> {
    // Validate data
    const validation = this.validateRegistrationData(data);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }

    // Check email availability
    const emailAvailable = await this.isEmailAvailable(data.email);
    if (!emailAvailable) {
      return {
        success: false,
        error: 'Email is already registered',
      };
    }

    // Generate user ID
    const userId = `user_${Date.now()}`;

    // Handle password based on registration method
    let temporaryPassword: string | undefined;
    if (data.method !== 'self') {
      temporaryPassword = this.generateTemporaryPassword();
      console.log(`[MOCK] Generated temporary password for ${data.email}: ${temporaryPassword}`);
    }

    // Create user account
    console.log(`[MOCK] Creating ${data.role} account via ${data.method}:`, {
      userId,
      email: data.email,
      name: data.name,
      createdBy: data.createdByName || 'Self',
    });

    // Initialize wallet
    const walletId = `wallet_${userId}`;
    const initialBalance = data.initialWalletBalance || 0;
    console.log(`[MOCK] Initializing wallet ${walletId} with balance: €${initialBalance}`);

    // Initialize loyalty program (if patient)
    if (data.role === 'Patient') {
      console.log(`[MOCK] Auto-enrolling ${data.email} in loyalty program`);
    }

    // Handle referral code
    if (data.referralCode) {
      console.log(`[MOCK] Applying referral code: ${data.referralCode}`);
    }

    // Send welcome email
    if (data.sendWelcomeEmail) {
      await this.sendWelcomeEmail(userId, data.email, temporaryPassword);
    }

    // Mark email as registered
    this.registeredEmails.add(data.email.toLowerCase());

    return {
      success: true,
      userId,
      walletId,
      user: {
        id: userId,
        email: data.email,
        name: data.name,
        displayName: data.displayName || data.name,
        role: data.role,
        phoneNumber: data.phoneNumber,
        createdAt: new Date().toISOString(),
      },
      requiresEmailVerification: data.method === 'self',
      temporaryPassword: data.method !== 'self' ? temporaryPassword : undefined,
    };
  }

  validateRegistrationData(data: RegistrationData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    if (!data.email || !data.email.includes('@')) {
      errors.push('Valid email is required');
    }

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    // Password validation (only for self-registration)
    if (data.method === 'self') {
      if (!data.password || data.password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
    }

    // Role validation
    if (!['Patient', 'Therapist', 'Admin'].includes(data.role)) {
      errors.push('Invalid role');
    }

    // Created by validation (for admin/therapist-created)
    if (data.method !== 'self' && !data.createdBy) {
      errors.push('Creator ID is required for admin/therapist-created accounts');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    return !this.registeredEmails.has(email.toLowerCase());
  }

  generateTemporaryPassword(): string {
    return generatePassword();
  }

  async sendWelcomeEmail(userId: string, email: string, tempPassword?: string): Promise<void> {
    console.log(`[MOCK] Sending welcome email to ${email}`);
    if (tempPassword) {
      console.log(`[MOCK] Email includes temporary password: ${tempPassword}`);
      console.log(`[MOCK] User will be required to change password on first login`);
    }
    // In production, this would use Firebase Auth email templates or a service like SendGrid
  }
}

/**
 * Firestore Registration Service Implementation
 */
class FirestoreRegistrationService implements IRegistrationService {
  async registerUser(data: RegistrationData): Promise<RegistrationResult> {
    try {
      // Validate data
      const validation = this.validateRegistrationData(data);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }

      // Check email availability
      const emailAvailable = await this.isEmailAvailable(data.email);
      if (!emailAvailable) {
        return {
          success: false,
          error: 'Email is already registered',
        };
      }

      // In production, this should call a Cloud Function that:
      // 1. Creates Firebase Auth user
      // 2. Creates Firestore user document
      // 3. Initializes wallet (via createUserWallet Cloud Function)
      // 4. Auto-enrolls in loyalty program if Patient
      // 5. Processes referral code if provided
      // 6. Sends welcome email with credentials if admin/therapist-created

      console.log('[FIRESTORE] Registration should be handled by Cloud Function:', {
        endpoint: 'registerUser',
        data: {
          email: data.email,
          name: data.name,
          role: data.role,
          method: data.method,
          createdBy: data.createdBy,
          referralCode: data.referralCode,
        },
      });

      throw new Error(
        'User registration must be done via Cloud Functions. ' +
        'Please implement a Cloud Function that handles Firebase Auth creation, ' +
        'Firestore user document creation, wallet initialization, and loyalty enrollment.'
      );
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Registration failed',
      };
    }
  }

  validateRegistrationData(data: RegistrationData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation
    if (!data.email || !data.email.includes('@')) {
      errors.push('Valid email is required');
    }

    // Name validation
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    }

    // Password validation (only for self-registration)
    if (data.method === 'self') {
      if (!data.password || data.password.length < 8) {
        errors.push('Password must be at least 8 characters');
      }
    }

    // Role validation
    if (!['Patient', 'Therapist', 'Admin'].includes(data.role)) {
      errors.push('Invalid role');
    }

    // Created by validation (for admin/therapist-created)
    if (data.method !== 'self' && !data.createdBy) {
      errors.push('Creator ID is required for admin/therapist-created accounts');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  async isEmailAvailable(email: string): Promise<boolean> {
    // In production, check Firebase Auth and Firestore
    console.log('[FIRESTORE] Checking email availability via Cloud Function');
    
    // This should call a Cloud Function or check Firestore users collection
    // For now, return true to avoid blocking (will be validated server-side)
    return true;
  }

  generateTemporaryPassword(): string {
    return generatePassword();
  }

  async sendWelcomeEmail(userId: string, email: string, tempPassword?: string): Promise<void> {
    console.log('[FIRESTORE] Triggering welcome email via Cloud Function:', {
      userId,
      email,
      hasTemporaryPassword: !!tempPassword,
    });
    
    // In production, this would trigger a Cloud Function that sends email
    // via Firebase Auth email templates or SendGrid
  }
}

// Singleton instances
let mockInstance: MockRegistrationService | null = null;
let firestoreInstance: FirestoreRegistrationService | null = null;

/**
 * Get Registration Service instance based on environment
 */
export async function getRegistrationService(): Promise<IRegistrationService> {
  if (USE_MOCK_DATA) {
    if (!mockInstance) {
      mockInstance = new MockRegistrationService();
    }
    return mockInstance;
  } else {
    if (!firestoreInstance) {
      firestoreInstance = new FirestoreRegistrationService();
    }
    return firestoreInstance;
  }
}
