'use client';

import { Component, ReactNode } from 'react';
import { PageContainer } from '@/components/platform/eka/page-container';
import { SurfacePanel } from '@/components/platform/eka/surface-panel';
import { Button } from '@/components/platform/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/platform/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { sendClientErrorReport } from '@/lib/observability/client-error-reporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

/**
 * Global Error Boundary Component
 *
 * Catches React errors and displays a user-friendly error page
 * Logs errors to console (and can be extended to log to monitoring services)
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    void sendClientErrorReport({
      message: error.message || error.toString(),
      stack: error.stack ?? errorInfo.componentStack,
      level: 'error',
      context: {
        source: 'react.error-boundary',
      },
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <PageContainer>
          <SurfacePanel className="flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
              <CardHeader>
                <div className="text-destructive mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <CardTitle>Something went wrong</CardTitle>
                </div>
                <CardDescription>
                  We encountered an unexpected error. Please try one of the options below.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-muted rounded-lg p-4 text-sm">
                    <p className="text-destructive mb-2 font-semibold">Error Details:</p>
                    <pre className="max-h-40 overflow-auto text-xs whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </pre>
                    {this.state.errorInfo && (
                      <pre className="text-muted-foreground mt-2 max-h-40 overflow-auto text-xs whitespace-pre-wrap">
                        {this.state.errorInfo}
                      </pre>
                    )}
                  </div>
                )}

                <div className="text-muted-foreground text-sm">
                  <p>This error has been logged and we'll work on fixing it.</p>
                  <p className="mt-2">
                    If this problem persists, please contact support with the error code:{' '}
                    <code className="bg-muted rounded px-1 py-0.5 text-xs">
                      {Date.now().toString(36).toUpperCase()}
                    </code>
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-wrap gap-2">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  className="flex-1 sm:flex-none"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleReload}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  Reload Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 sm:flex-none"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </CardFooter>
            </Card>
          </SurfacePanel>
        </PageContainer>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for use with suspense
 * Usage: Wrap components that might throw errors
 */
export function SafeComponent({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}
