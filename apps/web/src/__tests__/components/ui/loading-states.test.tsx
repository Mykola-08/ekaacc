import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  LoadingSpinner,
  LoadingSkeleton,
  CardSkeleton,
  ErrorState,
  LoadingContainer,
  AsyncContent,
  TableSkeleton,
  FormSkeleton,
  ChartSkeleton,
} from '@/components/ui/loading-states';

describe('LoadingStates Components', () => {
  describe('LoadingSpinner', () => {
    it('renders with default props', () => {
      render(<LoadingSpinner />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveClass('animate-spin');
    });

    it('renders with custom size', () => {
      render(<LoadingSpinner size="lg" />);
      
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('h-12 w-12');
    });

    it('renders with custom message', () => {
      render(<LoadingSpinner message="Loading data..." />);
      
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('renders with custom className', () => {
      render(<LoadingSpinner className="custom-class" />);
      
      const container = screen.getByRole('status').parentElement;
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('LoadingSkeleton', () => {
    it('renders with default number of lines', () => {
      render(<LoadingSkeleton />);
      
      const lines = screen.getByTestId('loading-skeleton').children;
      expect(lines).toHaveLength(3);
    });

    it('renders with custom number of lines', () => {
      render(<LoadingSkeleton lines={5} />);
      
      const lines = screen.getByTestId('loading-skeleton').children;
      expect(lines).toHaveLength(5);
    });

    it('renders with custom height', () => {
      render(<LoadingSkeleton height="h-6" />);
      
      const lines = screen.getByTestId('loading-skeleton').children;
      expect(lines[0]).toHaveClass('h-6');
    });

    it('renders with custom className', () => {
      render(<LoadingSkeleton className="custom-class" />);
      
      const container = screen.getByTestId('loading-skeleton');
      expect(container).toHaveClass('custom-class');
    });
  });

  describe('CardSkeleton', () => {
    it('renders with header and footer by default', () => {
      render(<CardSkeleton />);
      
      const card = screen.getByRole('article');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('animate-pulse');
    });

    it('renders without header when showHeader is false', () => {
      render(<CardSkeleton showHeader={false} />);
      
      const cardHeader = screen.queryByRole('banner');
      expect(cardHeader).not.toBeInTheDocument();
    });

    it('renders without footer when showFooter is false', () => {
      render(<CardSkeleton showFooter={false} />);
      
      // Card footer doesn't have a specific role, so we check for the button skeleton
      const buttonSkeleton = screen.queryByRole('button');
      expect(buttonSkeleton).not.toBeInTheDocument();
    });
  });

  describe('ErrorState', () => {
    it('renders with default props', () => {
      render(<ErrorState />);
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('We encountered an unexpected error. Please try again.')).toBeInTheDocument();
    });

    it('renders with custom title and message', () => {
      render(
        <ErrorState
          title="Custom Error"
          message="This is a custom error message"
        />
      );
      
      expect(screen.getByText('Custom Error')).toBeInTheDocument();
      expect(screen.getByText('This is a custom error message')).toBeInTheDocument();
    });

    it('renders retry button when onRetry is provided', () => {
      const onRetry = jest.fn();
      render(<ErrorState onRetry={onRetry} />);
      
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toBeInTheDocument();
      
      fireEvent.click(retryButton);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('renders go home button when onGoHome is provided', () => {
      const onGoHome = jest.fn();
      render(<ErrorState onGoHome={onGoHome} />);
      
      const goHomeButton = screen.getByRole('button', { name: /go home/i });
      expect(goHomeButton).toBeInTheDocument();
      
      fireEvent.click(goHomeButton);
      expect(onGoHome).toHaveBeenCalledTimes(1);
    });

    it('renders error details in development mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      const error = new Error('Test error message');
      render(<ErrorState error={error} />);
      
      expect(screen.getByText('Error Details:')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('does not render error details in production mode', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      const error = new Error('Test error message');
      render(<ErrorState error={error} />);
      
      expect(screen.queryByText('Error Details:')).not.toBeInTheDocument();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('LoadingContainer', () => {
    it('renders loading state', () => {
      render(
        <LoadingContainer isLoading={true}>
          <div>Content</div>
        </LoadingContainer>
      );
      
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders error state', () => {
      const error = new Error('Test error');
      const onRetry = jest.fn();
      
      render(
        <LoadingContainer isLoading={false} isError={true} error={error} onRetry={onRetry}>
          <div>Content</div>
        </LoadingContainer>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('renders children when not loading or error', () => {
      render(
        <LoadingContainer isLoading={false} isError={false}>
          <div>Content</div>
        </LoadingContainer>
      );
      
      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('renders with custom loading message', () => {
      render(
        <LoadingContainer isLoading={true} loadingMessage="Custom loading...">
          <div>Content</div>
        </LoadingContainer>
      );
      
      expect(screen.getByText('Custom loading...')).toBeInTheDocument();
    });

    it('renders with custom error title and message', () => {
      const error = new Error('Test error');
      
      render(
        <LoadingContainer
          isLoading={false}
          isError={true}
          error={error}
          errorTitle="Custom Error Title"
          errorMessage="Custom error message"
        >
          <div>Content</div>
        </LoadingContainer>
      );
      
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
    });
  });

  describe('AsyncContent', () => {
    it('renders loading state', () => {
      render(
        <AsyncContent data={null} isLoading={true}>
          {(data) => <div>{data}</div>}
        </AsyncContent>
      );
      
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders error state', () => {
      const error = new Error('Test error');
      const onRetry = jest.fn();
      
      render(
        <AsyncContent data={null} isLoading={false} isError={true} error={error} onRetry={onRetry}>
          {(data) => <div>{data}</div>}
        </AsyncContent>
      );
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders children with data when not loading or error', () => {
      render(
        <AsyncContent data="test data" isLoading={false} isError={false}>
          {(data) => <div>{data}</div>}
        </AsyncContent>
      );
      
      expect(screen.getByText('test data')).toBeInTheDocument();
    });

    it('renders custom loading component', () => {
      const customLoading = <div>Custom Loading...</div>;
      
      render(
        <AsyncContent
          data={null}
          isLoading={true}
          loadingComponent={customLoading}
        >
          {(data) => <div>{data}</div>}
        </AsyncContent>
      );
      
      expect(screen.getByText('Custom Loading...')).toBeInTheDocument();
    });

    it('renders custom error component', () => {
      const customError = <div>Custom Error!</div>;
      
      render(
        <AsyncContent
          data={null}
          isLoading={false}
          isError={true}
          errorComponent={customError}
        >
          {(data) => <div>{data}</div>}
        </AsyncContent>
      );
      
      expect(screen.getByText('Custom Error!')).toBeInTheDocument();
    });
  });

  describe('Specialized Skeletons', () => {
    it('renders TableSkeleton with default props', () => {
      render(<TableSkeleton />);
      
      const table = screen.getByTestId('table-skeleton');
      expect(table).toBeInTheDocument();
      
      // Should have header row + 5 data rows
      const rows = table.querySelectorAll('div > div');
      expect(rows).toHaveLength(6); // 1 header + 5 data rows
    });

    it('renders TableSkeleton with custom rows and columns', () => {
      render(<TableSkeleton rows={3} columns={2} />);
      
      const table = screen.getByTestId('table-skeleton');
      const rows = table.querySelectorAll('div > div');
      expect(rows).toHaveLength(4); // 1 header + 3 data rows
    });

    it('renders FormSkeleton with default props', () => {
      render(<FormSkeleton />);
      
      const form = screen.getByTestId('form-skeleton');
      expect(form).toBeInTheDocument();
      
      // Should have 3 field groups + 1 submit button
      const fieldGroups = form.querySelectorAll('div > div');
      expect(fieldGroups).toHaveLength(4);
    });

    it('renders FormSkeleton with custom number of fields', () => {
      render(<FormSkeleton fields={5} />);
      
      const form = screen.getByTestId('form-skeleton');
      const fieldGroups = form.querySelectorAll('div > div');
      expect(fieldGroups).toHaveLength(6); // 5 fields + 1 submit button
    });

    it('renders ChartSkeleton', () => {
      render(<ChartSkeleton />);
      
      const chart = screen.getByTestId('chart-skeleton');
      expect(chart).toBeInTheDocument();
      
      // Should have title and chart area
      const elements = chart.querySelectorAll('div > div');
      expect(elements).toHaveLength(2);
    });
  });
});