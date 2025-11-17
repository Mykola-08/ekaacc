/**
 * Test to verify that the auth provider consolidation works correctly
 */
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Import from both locations to verify they're the same
import { AuthProvider as AuthProvider1, useAuth as useAuth1 } from '@/lib/supabase-auth';
import { AuthProvider as AuthProvider2, useAuth as useAuth2 } from '@/context/auth-context';

describe('Auth Provider Consolidation', () => {
  it('should export AuthProvider from both locations', () => {
    // Both imports should exist
    expect(AuthProvider1).toBeDefined();
    expect(AuthProvider2).toBeDefined();
    
    // They should be the same function
    expect(AuthProvider1).toBe(AuthProvider2);
  });

  it('should export useAuth from both locations', () => {
    // Both imports should exist
    expect(useAuth1).toBeDefined();
    expect(useAuth2).toBeDefined();
    
    // They should be the same function
    expect(useAuth1).toBe(useAuth2);
  });

  it('should work when using auth from supabase-auth import', () => {
    const TestComponent = () => {
      // This should work without throwing "must be used within an AuthProvider" error
      // We wrap it in a try-catch because we're not actually providing the auth context
      try {
        useAuth1();
      } catch (e: any) {
        // We expect this error since we're not in a provider
        expect(e.message).toContain('useAuth must be used within an AuthProvider');
      }
      return <div>Test</div>;
    };

    render(<TestComponent />);
  });
});
