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
          enabledProviders={{ google: true, x: true, linkedin: true }} 
        />
      );

      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.getByText('X')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('should hide providers when disabled', () => {
      render(
        <LoginForm 
          enabledProviders={{ google: false, x: false, linkedin: false }} 
        />
      );

      expect(screen.queryByText('Google')).not.toBeInTheDocument();
      expect(screen.queryByText('X')).not.toBeInTheDocument();
      expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument();
    });

    it('should render mixed configuration', () => {
      render(
        <LoginForm 
          enabledProviders={{ google: true, x: false, linkedin: true }} 
        />
      );

      expect(screen.getByText('Google')).toBeInTheDocument();
      expect(screen.queryByText('X')).not.toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });
  });

  describe('Feature Flag Mapping Logic', () => {
    // This tests the logic used in LoginPage to map features to enabledProviders
    const mapFeaturesToProviders = (features: any[]) => ({
      google: features.some(f => f.key === 'auth_google'),
      x: features.some(f => f.key === 'auth_x'),
      linkedin: features.some(f => f.key === 'auth_linkedin'),
    });

    it('should correctly map features to providers', () => {
      const features = [
        { key: 'auth_google', is_enabled: true },
        { key: 'other_feature', is_enabled: true }
      ];

      const result = mapFeaturesToProviders(features);

      expect(result.google).toBe(true);
      expect(result.x).toBe(false);
      expect(result.linkedin).toBe(false);
    });

    it('should handle empty features list', () => {
      const features: any[] = [];
      const result = mapFeaturesToProviders(features);

      expect(result.google).toBe(false);
      expect(result.x).toBe(false);
      expect(result.linkedin).toBe(false);
    });
  });
});
