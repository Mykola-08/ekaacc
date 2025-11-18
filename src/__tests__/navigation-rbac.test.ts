import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { SystemRole, hasPermission } from '../lib/role-permissions';
import { 
  getAccessibleNavigationItems, 
  checkNavigationPermission,
  canAccessRoute 
} from '../lib/permission-service';
import { 
  NAVIGATION_CONFIG, 
  getNavigationItemsByRole,
  findNavigationItemByHref,
  NavigationCategory
} from '../lib/navigation-config';

// Mock user data for testing
interface MockUser {
  id: string;
  role: SystemRole;
  email: string;
}

const mockUsers: Record<string, MockUser> = {
  admin: {
    id: 'admin-123',
    role: 'Admin' as SystemRole,
    email: 'admin@example.com'
  },
  therapist: {
    id: 'therapist-123',
    role: 'Therapist' as SystemRole,
    email: 'therapist@example.com'
  },
  patient: {
    id: 'patient-123',
    role: 'Patient' as SystemRole,
    email: 'patient@example.com'
  },
  vipPatient: {
    id: 'vip-patient-123',
    role: 'VIP Patient' as SystemRole,
    email: 'vip@example.com'
  },
  reception: {
    id: 'reception-123',
    role: 'Reception' as SystemRole,
    email: 'reception@example.com'
  },
  contentManager: {
    id: 'content-manager-123',
    role: 'Content Manager' as SystemRole,
    email: 'content@example.com'
  },
  marketing: {
    id: 'marketing-123',
    role: 'Marketing' as SystemRole,
    email: 'marketing@example.com'
  },
  accountant: {
    id: 'accountant-123',
    role: 'Accountant' as SystemRole,
    email: 'accountant@example.com'
  },
  corporateClient: {
    id: 'corporate-123',
    role: 'Corporate Client' as SystemRole,
    email: 'corporate@example.com'
  }
};

describe('Role-Based Navigation System', () => {
  describe('Permission Service', () => {
    describe('checkNavigationPermission', () => {
      it('should allow Admin access to admin panel', () => {
        const adminPanel = findNavigationItemByHref('/admin');
        expect(adminPanel).toBeDefined();
        
        const result = checkNavigationPermission('Admin', adminPanel!);
        expect(result.hasAccess).toBe(true);
        expect(result.reason).toBe('Permission granted');
      });

      it('should deny Patient access to admin panel', () => {
        const adminPanel = findNavigationItemByHref('/admin');
        expect(adminPanel).toBeDefined();
        
        const result = checkNavigationPermission('Patient', adminPanel!);
        expect(result.hasAccess).toBe(false);
        expect(result.reason).toContain('Missing required permissions');
      });

      it('should allow Therapist access to therapist-specific items', () => {
        const therapistDashboard = findNavigationItemByHref('/therapist/dashboard');
        expect(therapistDashboard).toBeDefined();
        
        const result = checkNavigationPermission('Therapist', therapistDashboard!);
        expect(result.hasAccess).toBe(true);
      });

      it('should deny non-Therapist access to therapist-specific items', () => {
        const therapistDashboard = findNavigationItemByHref('/therapist/dashboard');
        expect(therapistDashboard).toBeDefined();
        
        const result = checkNavigationPermission('Patient', therapistDashboard!);
        expect(result.hasAccess).toBe(false);
      });

      it('should allow universal access items for all authenticated users', () => {
        const home = findNavigationItemByHref('/home');
        expect(home).toBeDefined();
        
        Object.values(mockUsers).forEach(user => {
          const result = checkNavigationPermission(user.role, home!);
          expect(result.hasAccess).toBe(true);
        });
      });
    });

    describe('getAccessibleNavigationItems', () => {
      it('should return correct items for Admin role', () => {
        const items = getAccessibleNavigationItems(mockUsers.admin.id, 'Admin');
        
        // Admin should have access to all items except role-specific ones
        const adminPanel = items.find(item => item.href === '/admin');
        expect(adminPanel).toBeDefined();
        
        const userManagement = items.find(item => item.href === '/admin/users');
        expect(userManagement).toBeDefined();
        
        const therapistDashboard = items.find(item => item.href === '/therapist/dashboard');
        expect(therapistDashboard).toBeUndefined(); // Role-specific to Therapist
      });

      it('should return correct items for Patient role', () => {
        const items = getAccessibleNavigationItems(mockUsers.patient.id, 'Patient');
        
        // Patient should have limited access
        const home = items.find(item => item.href === '/home');
        expect(home).toBeDefined();
        
        const journal = items.find(item => item.href === '/journal');
        expect(journal).toBeDefined();
        
        const adminPanel = items.find(item => item.href === '/admin');
        expect(adminPanel).toBeUndefined();
        
        const userManagement = items.find(item => item.href === '/admin/users');
        expect(userManagement).toBeUndefined();
      });

      it('should return correct items for Therapist role', () => {
        const items = getAccessibleNavigationItems(mockUsers.therapist.id, 'Therapist');
        
        // Therapist should have access to therapy tools and patient data
        const therapistDashboard = items.find(item => item.href === '/therapist/dashboard');
        expect(therapistDashboard).toBeDefined();
        
        const clients = items.find(item => item.href === '/therapist/clients');
        expect(clients).toBeDefined();
        
        const templates = items.find(item => item.href === '/therapist/templates');
        expect(templates).toBeDefined();
        
        const patients = items.find(item => item.href === '/patients');
        expect(patients).toBeDefined(); // Should have limited patient access
      });

      it('should return correct items for Content Manager role', () => {
        const items = getAccessibleNavigationItems(mockUsers.contentManager.id, 'Content Manager');
        
        // Content Manager should have access to content management
        const forms = items.find(item => item.href === '/forms');
        expect(forms).toBeDefined();
        
        const therapists = items.find(item => item.href === '/therapists');
        expect(therapists).toBeDefined();
        
        const adminPanel = items.find(item => item.href === '/admin');
        expect(adminPanel).toBeUndefined(); // No admin access
      });

      it('should return correct items for Accountant role', () => {
        const items = getAccessibleNavigationItems(mockUsers.accountant.id, 'Accountant');
        
        // Accountant should have access to financial data
        const payments = items.find(item => item.href === '/admin/payments');
        expect(payments).toBeDefined();
        
        const donations = items.find(item => item.href === '/donations');
        expect(donations).toBeDefined();
        
        const userManagement = items.find(item => item.href === '/admin/users');
        expect(userManagement).toBeUndefined(); // No user management access
      });
    });

    describe('canAccessRoute', () => {
      it('should allow access to routes based on permissions', () => {
        // Admin should access admin routes
        const adminResult = canAccessRoute('Admin', '/admin/users');
        expect(adminResult.hasAccess).toBe(true);
        
        // Patient should not access admin routes
        const patientResult = canAccessRoute('Patient', '/admin/users');
        expect(patientResult.hasAccess).toBe(false);
        
        // Therapist should access therapy tools
        const therapistResult = canAccessRoute('Therapist', '/therapist/templates');
        expect(therapistResult.hasAccess).toBe(true);
        
        // Patient should not access therapy tools
        const patientTherapyResult = canAccessRoute('Patient', '/therapist/templates');
        expect(patientTherapyResult.hasAccess).toBe(false);
      });

      it('should handle non-existent routes', () => {
        const result = canAccessRoute('Admin', '/non-existent-route');
        expect(result.hasAccess).toBe(false);
        expect(result.reason).toBe('Route not found in navigation configuration');
      });

      it('should handle universal access routes', () => {
        Object.values(mockUsers).forEach(user => {
          const homeResult = canAccessRoute(user.role, '/home');
          expect(homeResult.hasAccess).toBe(true);
          
          const settingsResult = canAccessRoute(user.role, '/settings');
          expect(settingsResult.hasAccess).toBe(true);
          
          const accountResult = canAccessRoute(user.role, '/myaccount');
          expect(accountResult.hasAccess).toBe(true);
        });
      });
    });
  });

  describe('Role-Specific Navigation Items', () => {
    it('should only show therapist-specific items to therapists', () => {
      const therapistItems = getNavigationItemsByRole('Therapist');
      const patientItems = getNavigationItemsByRole('Patient');
      
      // Therapist should see therapist-specific items
      const therapistDashboard = therapistItems.find(item => item.href === '/therapist/dashboard');
      expect(therapistDashboard).toBeDefined();
      
      // Patient should not see therapist-specific items
      const patientTherapistDashboard = patientItems.find(item => item.href === '/therapist/dashboard');
      expect(patientTherapistDashboard).toBeUndefined();
    });

    it('should handle role-specific metadata correctly', () => {
      const allItems = NAVIGATION_CONFIG.items;
      
      // Find role-specific items
      const roleSpecificItems = allItems.filter(item => item.metadata?.roleSpecific);
      expect(roleSpecificItems.length).toBeGreaterThan(0);
      
      // Verify each role-specific item
      roleSpecificItems.forEach(item => {
        expect(item.metadata?.roleSpecific).toBeDefined();
        
        // Should be accessible only by the specified role
        const specifiedRole = item.metadata!.roleSpecific;
        const allowedResult = checkNavigationPermission(specifiedRole, item);
        expect(allowedResult.hasAccess).toBe(true);
        
        // Should be denied to other roles
        const otherRoles = Object.keys(mockUsers).filter(role => role !== specifiedRole);
        otherRoles.forEach(role => {
          const deniedResult = checkNavigationPermission(role as SystemRole, item);
          expect(deniedResult.hasAccess).toBe(false);
        });
      });
    });
  });

  describe('Permission-Based Filtering', () => {
    it('should filter items based on permission groups', () => {
      // Test user management permissions
      const adminItems = getAccessibleNavigationItems(mockUsers.admin.id, 'Admin');
      const adminUserItems = adminItems.filter(item => 
        item.permissions.some(p => p.group === 'user_management')
      );
      expect(adminUserItems.length).toBeGreaterThan(0);
      
      const patientItems = getAccessibleNavigationItems(mockUsers.patient.id, 'Patient');
      const patientUserItems = patientItems.filter(item => 
        item.permissions.some(p => p.group === 'user_management')
      );
      expect(patientUserItems.length).toBe(0); // Patients should not have user management access
    });

    it('should handle conditional permissions correctly', () => {
      // Therapist should have conditional access to patients based on assignment
      const therapistItems = getAccessibleNavigationItems(mockUsers.therapist.id, 'Therapist');
      const therapistPatients = therapistItems.find(item => item.href === '/patients');
      expect(therapistPatients).toBeDefined();
      
      // But they should also have access to their assigned clients
      const therapistClients = therapistItems.find(item => item.href === '/therapist/clients');
      expect(therapistClients).toBeDefined();
    });

    it('should handle universal access items', () => {
      const universalItems = NAVIGATION_CONFIG.items.filter(item => item.metadata?.universal);
      expect(universalItems.length).toBeGreaterThan(0);
      
      // All users should have access to universal items
      Object.values(mockUsers).forEach(user => {
        const items = getAccessibleNavigationItems(user.id, user.role);
        universalItems.forEach(universalItem => {
          const foundItem = items.find(item => item.id === universalItem.id);
          expect(foundItem).toBeDefined();
        });
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle invalid roles gracefully', () => {
      const invalidRole = 'InvalidRole' as SystemRole;
      const result = checkNavigationPermission(invalidRole, NAVIGATION_CONFIG.items[0]);
      expect(result.hasAccess).toBe(false);
      expect(result.reason).toContain('Invalid role');
    });

    it('should handle empty navigation configurations', () => {
      const emptyItem = {
        id: 'empty',
        label: 'Empty',
        href: '/empty',
        icon: 'Empty',
        category: 'tools' as NavigationCategory,
        permissions: [],
        order: 1
      };
      
      const result = checkNavigationPermission('Admin', emptyItem);
      expect(result.hasAccess).toBe(false); // No permissions defined
    });

    it('should handle complex permission conditions', () => {
      const complexItem = findNavigationItemByHref('/therapist/clients');
      expect(complexItem).toBeDefined();
      
      // Should work with correct conditions
      const therapistResult = checkNavigationPermission('Therapist', complexItem!, { assigned: true });
      expect(therapistResult.hasAccess).toBe(true);
      
      // Should fail with incorrect conditions
      const patientResult = checkNavigationPermission('Patient', complexItem!, { assigned: true });
      expect(patientResult.hasAccess).toBe(false);
    });
  });

  describe('Performance and Caching', () => {
    it('should efficiently handle multiple role checks', () => {
      const startTime = Date.now();
      
      // Perform multiple permission checks
      for (let i = 0; i < 100; i++) {
        Object.values(mockUsers).forEach(user => {
          getAccessibleNavigationItems(user.id, user.role);
        });
      }
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Should complete reasonably quickly (adjust threshold as needed)
      expect(executionTime).toBeLessThan(5000); // 5 seconds for 900 operations
    });

    it('should cache permission results effectively', () => {
      const user = mockUsers.admin;
      
      // First call should populate cache
      const firstCall = getAccessibleNavigationItems(user.id, user.role);
      expect(firstCall.length).toBeGreaterThan(0);
      
      // Second call should use cache
      const secondCall = getAccessibleNavigationItems(user.id, user.role);
      expect(secondCall.length).toBe(firstCall.length);
      expect(secondCall).toEqual(firstCall);
    });
  });

  describe('Security and Audit Trail', () => {
    it('should log permission checks for audit trail', () => {
      // This would test the audit logging functionality
      // In a real implementation, you'd check that logs are created
      const result = checkNavigationPermission('Patient', findNavigationItemByHref('/admin')!);
      expect(result.hasAccess).toBe(false);
      
      // The audit log would be created internally by the permission service
      // You could verify this by checking a mock or spy if implemented
    });

    it('should handle security events appropriately', () => {
      // Test unauthorized access attempts
      const restrictedItems = NAVIGATION_CONFIG.items.filter(item => 
        !item.metadata?.universal && !item.metadata?.roleSpecific
      );
      
      restrictedItems.forEach(item => {
        const patientResult = checkNavigationPermission('Patient', item);
        if (!patientResult.hasAccess) {
          expect(patientResult.reason).toBeDefined();
          expect(patientResult.reason).not.toBe('');
        }
      });
    });
  });
});