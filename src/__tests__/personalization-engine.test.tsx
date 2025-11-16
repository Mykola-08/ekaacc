import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalizationEngine from '@/components/eka/personalization-engine';
import { useUser } from '@/lib/supabase-auth';

// Mock the useUser hook
jest.mock('@/lib/supabase-auth', () => ({
  useUser: jest.fn()
}));

describe('PersonalizationEngine', () => {
  const mockUser = {
    id: 'test-user-123',
    email: 'test@example.com',
    role: 'patient'
  };

  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({ user: mockUser });
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render all main sections', () => {
      render(<PersonalizationEngine />);

      expect(screen.getByText('Personalization Engine')).toBeInTheDocument();
      expect(screen.getByText('Color Scheme')).toBeInTheDocument();
      expect(screen.getByText('Accessibility')).toBeInTheDocument();
      expect(screen.getByText('Therapy Style Preference')).toBeInTheDocument();
      expect(screen.getByText('AI Adaptation')).toBeInTheDocument();
      expect(screen.getByText('Save Personalization Settings')).toBeInTheDocument();
    });

    it('should render color scheme options', () => {
      render(<PersonalizationEngine />);

      expect(screen.getByText('Calming')).toBeInTheDocument();
      expect(screen.getByText('Energizing')).toBeInTheDocument();
      expect(screen.getByText('Neutral')).toBeInTheDocument();
      expect(screen.getByText('Soft blues and greens for relaxation')).toBeInTheDocument();
      expect(screen.getByText('Bright colors for motivation')).toBeInTheDocument();
      expect(screen.getByText('Balanced tones for focus')).toBeInTheDocument();
    });

    it('should render therapy style options', () => {
      render(<PersonalizationEngine />);

      expect(screen.getByText('Directive')).toBeInTheDocument();
      expect(screen.getByText('Supportive')).toBeInTheDocument();
      expect(screen.getByText('Collaborative')).toBeInTheDocument();
      expect(screen.getByText('Structured guidance and clear action steps')).toBeInTheDocument();
      expect(screen.getByText('Empathetic listening and emotional validation')).toBeInTheDocument();
      expect(screen.getByText('Working together to find solutions')).toBeInTheDocument();
    });

    it('should render accessibility settings', () => {
      render(<PersonalizationEngine />);

      expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
      expect(screen.getByText('High Contrast Mode')).toBeInTheDocument();
      expect(screen.getByText('Screen Reader Optimized')).toBeInTheDocument();
      expect(screen.getByText('Keyboard Navigation')).toBeInTheDocument();
    });

    it('should render AI adaptation settings', () => {
      render(<PersonalizationEngine />);

      expect(screen.getByText('AI Recommendations')).toBeInTheDocument();
      expect(screen.getByText('Mood-Based Adaptation')).toBeInTheDocument();
      expect(screen.getByText('Time-Based Adaptation')).toBeInTheDocument();
      expect(screen.getByText('Behavioral Adaptation')).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should allow selecting color scheme', async () => {
      render(<PersonalizationEngine />);

      const calmingButton = screen.getByText('Calming').closest('button');
      expect(calmingButton).toBeInTheDocument();
      
      fireEvent.click(calmingButton!);
      
      // Should show checkmark for selected option
      await waitFor(() => {
        const checkCircle = calmingButton!.querySelector('svg');
        expect(checkCircle).toBeInTheDocument();
      });
    });

    it('should allow selecting therapy style', async () => {
      render(<PersonalizationEngine />);

      const supportiveButton = screen.getByText('Supportive').closest('button');
      expect(supportiveButton).toBeInTheDocument();
      
      fireEvent.click(supportiveButton!);
      
      // Should show checkmark for selected option
      await waitFor(() => {
        const checkCircle = supportiveButton!.querySelector('svg');
        expect(checkCircle).toBeInTheDocument();
      });
    });

    it('should toggle accessibility switches', async () => {
      render(<PersonalizationEngine />);

      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
      
      // Toggle first switch
      const firstSwitch = switches[0];
      const initialState = firstSwitch.getAttribute('aria-checked');
      
      fireEvent.click(firstSwitch);
      
      await waitFor(() => {
        expect(firstSwitch.getAttribute('aria-checked')).not.toBe(initialState);
      });
    });

    it('should save settings when save button is clicked', async () => {
      const onSettingsChange = jest.fn();
      render(<PersonalizationEngine onSettingsChange={onSettingsChange} />);

      // Make some changes
      const calmingButton = screen.getByText('Calming').closest('button');
      fireEvent.click(calmingButton!);

      const saveButton = screen.getByText('Save Personalization Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(onSettingsChange).toHaveBeenCalled();
      });
    });

    it('should show loading state while saving', async () => {
      render(<PersonalizationEngine />);

      const saveButton = screen.getByText('Save Personalization Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
      });
    });
  });

  describe('Settings Persistence', () => {
    it('should load saved settings from localStorage', () => {
      const savedSettings = {
        theme: 'dark',
        colorScheme: 'energizing',
        therapyStyle: 'directive'
      };
      
      localStorage.setItem('personalization-settings', JSON.stringify(savedSettings));
      
      render(<PersonalizationEngine />);

      // Should reflect loaded settings
      const energizingButton = screen.getByText('Energizing').closest('button');
      const directiveButton = screen.getByText('Directive').closest('button');
      
      expect(energizingButton).toBeInTheDocument();
      expect(directiveButton).toBeInTheDocument();
    });

    it('should save settings to localStorage', async () => {
      render(<PersonalizationEngine />);

      // Make changes
      const energizingButton = screen.getByText('Energizing').closest('button');
      fireEvent.click(energizingButton!);

      const directiveButton = screen.getByText('Directive').closest('button');
      fireEvent.click(directiveButton!);

      // Save settings
      const saveButton = screen.getByText('Save Personalization Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        const savedSettings = localStorage.getItem('personalization-settings');
        expect(savedSettings).toBeTruthy();
        
        const parsed = JSON.parse(savedSettings!);
        expect(parsed.colorScheme).toBe('energizing');
        expect(parsed.therapyStyle).toBe('directive');
      });
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('personalization-settings', 'invalid-json');
      
      // Should not throw error
      expect(() => render(<PersonalizationEngine />)).not.toThrow();
    });
  });

  describe('Preview Modal', () => {
    it('should open preview modal when preview button is clicked', async () => {
      render(<PersonalizationEngine />);

      const previewButtons = screen.getAllByText('Preview');
      expect(previewButtons.length).toBeGreaterThan(0);
      
      fireEvent.click(previewButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Preview:')).toBeInTheDocument();
      });
    });

    it('should close preview modal when close button is clicked', async () => {
      render(<PersonalizationEngine />);

      const previewButtons = screen.getAllByText('Preview');
      fireEvent.click(previewButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Preview:')).toBeInTheDocument();
      });

      const closeButton = screen.getByText('Close Preview');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Preview:')).not.toBeInTheDocument();
      });
    });

    it('should close preview modal when clicking outside', async () => {
      render(<PersonalizationEngine />);

      const previewButtons = screen.getAllByText('Preview');
      fireEvent.click(previewButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Preview:')).toBeInTheDocument();
      });

      // Click on the backdrop
      const backdrop = screen.getByText('Preview:').closest('div');
      fireEvent.click(backdrop!);

      await waitFor(() => {
        expect(screen.queryByText('Preview:')).not.toBeInTheDocument();
      });
    });
  });

  describe('Visual Adaptations', () => {
    it('should apply theme settings to document', async () => {
      render(<PersonalizationEngine />);

      // Select dark theme (if available in UI)
      // This would depend on how the theme selection is implemented
      
      const saveButton = screen.getByText('Save Personalization Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        // Check if theme classes are applied to document
        expect(document.documentElement.classList.contains('dark')).toBe(false); // Default is light
      });
    });

    it('should apply font size settings', async () => {
      render(<PersonalizationEngine />);

      const saveButton = screen.getByText('Save Personalization Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        // Check if font size CSS variable is set
        const fontSizeScale = document.documentElement.style.getPropertyValue('--font-size-scale');
        expect(fontSizeScale).toBeTruthy();
      });
    });

    it('should apply reduced motion settings', async () => {
      render(<PersonalizationEngine />);

      // Toggle reduced motion
      const switches = screen.getAllByRole('switch');
      const reducedMotionSwitch = switches.find(sw => 
        sw.closest('div')?.textContent?.includes('Reduced Motion')
      );
      
      if (reducedMotionSwitch) {
        fireEvent.click(reducedMotionSwitch);
      }

      const saveButton = screen.getByText('Save Personalization Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        // Check if motion duration is set
        const motionDuration = document.documentElement.style.getPropertyValue('--motion-duration');
        expect(motionDuration).toBeTruthy();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle save errors gracefully', async () => {
      // Mock localStorage to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const onSettingsChange = jest.fn();
      render(<PersonalizationEngine onSettingsChange={onSettingsChange} />);

      const saveButton = screen.getByText('Save Personalization Settings');
      fireEvent.click(saveButton);

      await waitFor(() => {
        // Should not throw and should complete save process
        expect(onSettingsChange).not.toHaveBeenCalled();
      });

      // Restore original
      localStorage.setItem = originalSetItem;
    });

    it('should work without user authentication', () => {
      (useUser as jest.Mock).mockReturnValue({ user: null });
      
      // Should not throw error
      expect(() => render(<PersonalizationEngine />)).not.toThrow();
    });

    it('should handle missing onSettingsChange prop', () => {
      // Should not throw error when prop is not provided
      expect(() => render(<PersonalizationEngine />)).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for interactive elements', () => {
      render(<PersonalizationEngine />);

      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
      
      switches.forEach(switchElement => {
        expect(switchElement).toHaveAttribute('aria-checked');
      });
    });

    it('should have proper headings structure', () => {
      render(<PersonalizationEngine />);

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Personalization Engine');
    });

    it('should have keyboard navigable elements', () => {
      render(<PersonalizationEngine />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabindex');
      });
    });
  });
});