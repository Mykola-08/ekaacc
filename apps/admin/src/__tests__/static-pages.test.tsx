import { render, screen } from '@testing-library/react';
import PrivacyPage from '@/app/privacy/page';
import TermsPage from '@/app/terms/page';

describe('Static Pages (Admin)', () => {
  describe('PrivacyPage', () => {
    it('renders privacy policy content', () => {
      render(<PrivacyPage />);
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText(/Information We Collect/i)).toBeInTheDocument();
      expect(screen.getByText(/How We Use Your Information/i)).toBeInTheDocument();
    });
  });

  describe('TermsPage', () => {
    it('renders terms of service content', () => {
      render(<TermsPage />);
      expect(screen.getAllByText('Terms of Service').length).toBeGreaterThan(0);
      expect(screen.getByText(/Acceptance of Terms/i)).toBeInTheDocument();
      expect(screen.getByText(/No Medical Advice/i)).toBeInTheDocument();
    });
  });
});
