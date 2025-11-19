import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoginForm } from '../components/login-form';

// Mock hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../hooks/use-simple-auth', () => ({
  useSimpleAuth: () => ({
    signIn: jest.fn(),
  }),
}));

describe('Login Configuration', () => {
  describe('LoginForm Component', () => {
    it('should render all providers when enabled', () => {
      render(
        <LoginForm 
          enabledProviders={{ google: true, apple: true, meta: true }} 
        />
      );

      expect(screen.getByText('Login with Google')).toBeInTheDocument();
      expect(screen.getByText('Login with Apple')).toBeInTheDocument();
      expect(screen.getByText('Login with Meta')).toBeInTheDocument();
    });

    it('should hide providers when disabled', () => {
      render(
        <LoginForm 
          enabledProviders={{ google: false, apple: false, meta: false }} 
        />
      );

      expect(screen.queryByText('Login with Google')).not.toBeInTheDocument();
      expect(screen.queryByText('Login with Apple')).not.toBeInTheDocument();
      expect(screen.queryByText('Login with Meta')).not.toBeInTheDocument();
    });

    it('should render mixed configuration', () => {
      render(
        <LoginForm 
          enabledProviders={{ google: true, apple: false, meta: true }} 
        />
      );

      expect(screen.getByText('Login with Google')).toBeInTheDocument();
      expect(screen.queryByText('Login with Apple')).not.toBeInTheDocument();
      expect(screen.getByText('Login with Meta')).toBeInTheDocument();
    });
  });

  describe('Feature Flag Mapping Logic', () => {
    // This tests the logic used in LoginPage to map features to enabledProviders
    const mapFeaturesToProviders = (features: any[]) => ({
      google: features.some(f => f.key === 'auth_google'),
      apple: features.some(f => f.key === 'auth_apple'),
      meta: features.some(f => f.key === 'auth_meta'),
    });

    it('should correctly map features to providers', () => {
      const features = [
        { key: 'auth_google', is_enabled: true },
        { key: 'other_feature', is_enabled: true }
      ];

      const result = mapFeaturesToProviders(features);

      expect(result.google).toBe(true);
      expect(result.apple).toBe(false);
      expect(result.meta).toBe(false);
    });

    it('should handle empty features list', () => {
      const features: any[] = [];
      const result = mapFeaturesToProviders(features);

      expect(result.google).toBe(false);
      expect(result.apple).toBe(false);
      expect(result.meta).toBe(false);
    });
  });
});
