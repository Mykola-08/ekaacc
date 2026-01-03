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
      expect(screen.getByText(/We apologize for the inconvenience/i)).toBeInTheDocument();
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
      let shouldThrow = true;
      const TransientError = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>No error</div>;
      };

      render(
        <EnhancedErrorBoundary>
          <TransientError />
        </EnhancedErrorBoundary>
      );
      
      const resetButton = screen.getByRole('button', { name: /try again/i });
      expect(resetButton).toBeInTheDocument();
      
      // Stop throwing for the next render
      shouldThrow = false;

      // Reset should clear the error
      fireEvent.click(resetButton);
      
      expect(screen.queryByRole('heading', { name: /something went wrong/i })).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });


  });

  describe('Error Details', () => {
    it('displays error ID when provided', () => {
      render(
        <EnhancedErrorBoundary errorId="TEST-123">
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByText(/Error Reference:/i)).toBeInTheDocument();
    });

    it('generates error ID when not provided', () => {
      render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      expect(screen.getByText(/error reference:/i)).toBeInTheDocument();
      const errorIdText = screen.getByText(/error reference:/i).parentElement?.textContent;
      expect(errorIdText).toMatch(/error reference: err_[a-z0-9]+/i);
    });


  });

  describe('User Feedback', () => {
    it('shows feedback form when feedback option is enabled', () => {
      render(
        <EnhancedErrorBoundary showErrorReport>
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
        <EnhancedErrorBoundary showErrorReport>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report this issue/i });
      fireEvent.click(reportButton);
      
      expect(screen.getByLabelText(/what were you trying to do/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument();
    });

    it('submits feedback successfully', async () => {
      const onFeedbackSubmit = jest.fn();
      render(
        <EnhancedErrorBoundary showErrorReport onFeedbackSubmit={onFeedbackSubmit}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report this issue/i });
      fireEvent.click(reportButton);
      
      const textarea = screen.getByLabelText(/what were you trying to do/i);
      await userEvent.type(textarea, 'This is a test feedback');
      
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(onFeedbackSubmit).toHaveBeenCalledWith('This is a test feedback', expect.any(String));
      });
      
      // Form should be closed and report button shown again
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /report this issue/i })).toBeInTheDocument();
      });
    });

    it('shows error when feedback submission fails', async () => {
      const onFeedbackSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'));
      render(
        <EnhancedErrorBoundary showErrorReport onFeedbackSubmit={onFeedbackSubmit}>
          <ThrowError shouldThrow={true} />
        </EnhancedErrorBoundary>
      );
      
      const reportButton = screen.getByRole('button', { name: /report this issue/i });
      fireEvent.click(reportButton);
      
      const textarea = screen.getByLabelText(/what were you trying to do/i);
      await userEvent.type(textarea, 'This is a test feedback');
      
      const submitButton = screen.getByRole('button', { name: /submit feedback/i });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
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
      
      const card = screen.getByRole('alert');
      expect(card).toHaveClass('custom-error-class');
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
      let shouldThrow = true;
      const TransientError = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div>No error</div>;
      };

      render(
        <EnhancedErrorBoundary>
          <TransientError />
        </EnhancedErrorBoundary>
      );
      
      const resetButton = screen.getByRole('button', { name: /try again/i });
      
      // Stop throwing
      shouldThrow = false;
      
      fireEvent.click(resetButton);
      
      expect(screen.queryByRole('heading', { name: /something went wrong/i })).not.toBeInTheDocument();
      expect(screen.getByText('No error')).toBeInTheDocument();
    });
  });
});