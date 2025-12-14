import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';

// Mock child component that throws errors
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

// Test component that can trigger errors
const TestComponent = ({ onError }: { onError?: (error: Error, errorInfo: React.ErrorInfo) => void }) => {
  const [shouldThrow, setShouldThrow] = React.useState(false);
  
  return (
    <EnhancedErrorBoundary onError={onError}>
      <ThrowError shouldThrow={shouldThrow} />
      <button onClick={() => setShouldThrow(true)}>Trigger Error</button>
    </EnhancedErrorBoundary>
  );
};

describe('EnhancedErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Basic Error Handling', () => {
    it('renders children when there is no error', () => {
      render(
        <EnhancedErrorBoundary>
          <div>Child content</div>
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('displays error UI when child component throws', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
      expect(screen.getByText(/we're sorry, but something went wrong/i)).toBeInTheDocument();
    });

    it('calls onError callback when error occurs', () => {
      const onError = jest.fn();
      render(
        <EnhancedErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String)
        })
      );
    });
  });

  describe('Error Recovery', () => {
    it('allows error recovery with reset button', () => {
      const { rerender } = render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const resetButton = screen.getByRole('button', { name: /try again/i });
      expect(resetButton).toBeInTheDocument();
      
      // Reset should clear the error
      fireEvent.click(resetButton);
      
      // Re-render without error
      rerender(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={false} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.queryByRole('heading', { name: /something went wrong/i })).not.toBeInTheDocument();
    });

    it('calls onReset callback when reset button is clicked', () => {
      const onReset = jest.fn();
      render(
        <EnhancedErrorBoundary onReset={onReset}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const resetButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(resetButton);
      
      expect(onReset).toHaveBeenCalled();
    });
  });

  describe('Error Details', () => {
    it('displays error ID when provided', () => {
      render(
        <EnhancedErrorBoundary errorId="TEST-123">
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByText(/error id: test-123/i)).toBeInTheDocument();
    });

    it('generates error ID when not provided', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByText(/error id: /i)).toBeInTheDocument();
      const errorIdText = screen.getByText(/error id: /i).textContent;
      expect(errorIdText).toMatch(/error id: [a-z0-9]{8}/i);
    });

    it('shows error details when showDetails is true', () => {
      render(
        <EnhancedErrorBoundary showDetails>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByText(/error details/i)).toBeInTheDocument();
      expect(screen.getByText(/test error/i)).toBeInTheDocument();
    });

    it('hides error details by default', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.queryByText(/error details/i)).not.toBeInTheDocument();
    });
  });

  describe('User Feedback', () => {
    it('shows feedback form when feedback option is enabled', () => {
      render(
        <EnhancedErrorBoundary enableFeedback>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByRole('button', { name: /report this issue/i })).toBeInTheDocument();
    });

    it('hides feedback form by default', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.queryByRole('button', { name: /report this issue/i })).not.toBeInTheDocument();
    });

    it('shows feedback form when report button is clicked', async () => {
      render(
        <EnhancedErrorBoundary enableFeedback>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report this issue/i });
      fireEvent.click(reportButton);
      
      expect(screen.getByLabelText(/describe what happened/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
    });

    it('submits feedback successfully', async () => {
      const onFeedbackSubmit = jest.fn();
      render(
        <EnhancedErrorBoundary enableFeedback onFeedbackSubmit={onFeedbackSubmit}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report this issue/i });
      fireEvent.click(reportButton);
      
      const textarea = screen.getByLabelText(/describe what happened/i);
      await userEvent.type(textarea, 'This is a test feedback');
      
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(onFeedbackSubmit).toHaveBeenCalledWith('This is a test feedback', expect.any(String));
      });
      
      expect(screen.getByText(/thank you for your feedback/i)).toBeInTheDocument();
    });

    it('shows error when feedback submission fails', async () => {
      const onFeedbackSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
      render(
        <EnhancedErrorBoundary enableFeedback onFeedbackSubmit={onFeedbackSubmit}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report this issue/i });
      fireEvent.click(reportButton);
      
      const textarea = screen.getByLabelText(/describe what happened/i);
      await userEvent.type(textarea, 'This is a test feedback');
      
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Reporting', () => {
    it('calls onErrorReport when report error button is clicked', () => {
      const onErrorReport = jest.fn();
      render(
        <EnhancedErrorBoundary enableErrorReporting onErrorReport={onErrorReport}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report error/i });
      fireEvent.click(reportButton);
      
      expect(onErrorReport).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(String),
        expect.any(String)
      );
    });

    it('shows success message when error report is submitted', async () => {
      const onErrorReport = jest.fn();
      render(
        <EnhancedErrorBoundary enableErrorReporting onErrorReport={onErrorReport}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report error/i });
      fireEvent.click(reportButton);
      
      await waitFor(() => {
        expect(screen.getByText(/error reported successfully/i)).toBeInTheDocument();
      });
    });

    it('shows error message when error report fails', async () => {
      const onErrorReport = jest.fn().mockRejectedValue(new Error('Report failed'));
      render(
        <EnhancedErrorBoundary enableErrorReporting onErrorReport={onErrorReport}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report error/i });
      fireEvent.click(reportButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to report error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Custom Styling', () => {
    it('applies custom className to error container', () => {
      render(
        <EnhancedErrorBoundary className="custom-error-class">
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const container = screen.getByRole('heading', { name: /something went wrong/i }).closest('div.min-h-screen');
      expect(container).toHaveClass('custom-error-class');
    });

    it('applies custom styles to error card', () => {
      render(
        <EnhancedErrorBoundary cardClassName="custom-card-class">
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const card = screen.getByRole('heading', { name: /something went wrong/i }).closest('div.bg-white');
      expect(card).toHaveClass('custom-card-class');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const heading = screen.getByRole('heading', { name: /something went wrong/i });
      expect(heading).toHaveAttribute('role', 'heading');
      expect(heading).toHaveAttribute('aria-level', '1');
    });

    it('focuses reset button after error occurs', async () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const resetButton = screen.getByRole('button', { name: /try again/i });
      expect(resetButton).toHaveFocus();
    });

    it('announces error to screen readers', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
    });
  });

  describe('Error Boundary Lifecycle', () => {
    it('does not catch errors in event handlers', () => {
      const onError = jest.fn();
      const ThrowInEvent = () => {
        const handleClick = () => {
          throw new Error('Event handler error');
        };
        return <button onClick={handleClick}>Click me</button>;
      };

      render(
        <EnhancedErrorBoundary onError={onError}>
          <ThrowInEvent />
        </EnhancedErrorBoundary>
      );
      
      fireEvent.click(screen.getByRole('button', { name: /click me/i }));
      
      // Error boundary should not catch this error
      expect(onError).not.toHaveBeenCalled();
      expect(screen.queryByRole('heading', { name: /something went wrong/i })).not.toBeInTheDocument();
    });

    it('catches errors during rendering', () => {
      const onError = jest.fn();
      render(
        <EnhancedErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(onError).toHaveBeenCalled();
      expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    });

    it('catches errors in lifecycle methods', () => {
      const onError = jest.fn();
      class LifecycleError extends React.Component {
        componentDidMount() {
          throw new Error('Lifecycle error');
        }
        render() {
          return <div>Component</div>;
        }
      }

      render(
        <EnhancedErrorBoundary onError={onError}>
          <LifecycleError />
        </EnhancedErrorBoundary>
      );
      
      expect(onError).toHaveBeenCalled();
      expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    });
  });

  describe('Error State Management', () => {
    it('maintains error state until reset', () => {
      const { rerender } = render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
      
      // Re-render with no error should still show error state
      rerender(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={false} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    });

    it('clears error state on reset', () => {
      const { rerender } = render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const resetButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(resetButton);
      
      // Re-render with no error should show normal content
      rerender(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={false} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.queryByRole('heading', { name: /something went wrong/i })).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });
});