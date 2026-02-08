'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { ErrorBoundary } from '@/components/platform/providers/error-boundary';
import { logger } from '@/lib/platform/services/logging';
import { errorHandler, AppError, ErrorContext } from '@/lib/platform/utils/error-handling';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
import { PageContainer } from '@/components/platform/eka/page-container';
import { SurfacePanel } from '@/components/platform/eka/surface-panel';

import { cn } from '@/lib/platform/utils/css-utils';
import { sendClientErrorReport } from '@/lib/observability/client-error-reporting';

interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  fallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onFeedbackSubmit?: (feedback: string, errorId: string) => Promise<void>;
  errorContext?: ErrorContext;
  showErrorReport?: boolean;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  className?: string;
}

interface EnhancedErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  userFeedback: string;
  showFeedbackForm: boolean;
  feedbackError: string | null;
}

/**
 * Enhanced Error Boundary with advanced error handling and user feedback
 */
export class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, EnhancedErrorBoundaryState> {
  private resetKeys: Array<string | number> = [];

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: EnhancedErrorBoundary.generateErrorId(),
      userFeedback: '',
      showFeedbackForm: false,
      feedbackError: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<EnhancedErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: EnhancedErrorBoundary.generateErrorId(),
    };
  }

  static generateErrorId(): string {
    return `err_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`.toUpperCase();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with enhanced context
    const appError = errorHandler.handleError(error, {
      ...this.props.errorContext,
      operation: this.props.errorContext?.operation || 'EnhancedErrorBoundary',
    });

    logger.error('EnhancedErrorBoundary caught an error', error, {
      errorInfo: errorInfo.componentStack,
      errorId: this.state.errorId,
      context: this.props.errorContext,
    });

    // Call custom error handler
    this.props.onError?.(error, errorInfo);

    // Send error report to server
    this.sendErrorReport(error, errorInfo);
  }

  componentDidUpdate(prevProps: EnhancedErrorBoundaryProps) {
    if (this.props.resetOnPropsChange && this.props.resetKeys) {
      const hasResetKeyChanged = this.props.resetKeys.some(
        (resetKey, index) => prevProps.resetKeys?.[index] !== resetKey
      );

      if (hasResetKeyChanged && this.state.hasError) {
        this.resetError();
      }
    }
  }

  private async sendErrorReport(error: Error, errorInfo: ErrorInfo) {
    await sendClientErrorReport({
      message: error.message || error.toString(),
      stack: error.stack ?? errorInfo.componentStack,
      level: 'error',
      context: {
        source: 'react.enhanced-error-boundary',
        ...this.props.errorContext,
      },
      metadata: {
        errorId: this.state.errorId,
      },
      additionalData: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  private handleReset = () => {
    this.resetError();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReportBug = () => {
    this.setState({ showFeedbackForm: true });
  };

  private handleFeedbackSubmit = async () => {
    try {
      if (this.props.onFeedbackSubmit) {
        await this.props.onFeedbackSubmit(this.state.userFeedback, this.state.errorId);
      } else {
        await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'error_report',
            errorId: this.state.errorId,
            feedback: this.state.userFeedback,
            timestamp: new Date().toISOString(),
          }),
        });
      }

      this.setState({ showFeedbackForm: false, userFeedback: '', feedbackError: null });
    } catch (error) {
      logger.error('Failed to submit feedback', error as Error);
      this.setState({ feedbackError: 'Failed to submit feedback. Please try again.' });
    }
  };

  private resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      userFeedback: '',
      showFeedbackForm: false,
      feedbackError: null,
    });
  };

  private renderFallbackComponent() {
    const { error, errorId, showFeedbackForm, userFeedback } = this.state;
    const { fallbackComponent: FallbackComponent } = this.props;

    if (FallbackComponent) {
      return <FallbackComponent error={error!} resetError={this.resetError} />;
    }

    return (
      <PageContainer>
        <SurfacePanel className="flex items-center justify-center p-4">
          <Card className={cn("max-w-2xl w-full", this.props.className)} role="alert">
            <CardHeader>
              <div className="flex items-center gap-2 text-destructive mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h1 className="text-2xl font-semibold leading-none tracking-tight">Something went wrong</h1>
              </div>
              <CardDescription>
                We apologize for the inconvenience. This error has been automatically reported to our team.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && error && (
                <div className="rounded-lg bg-muted p-4 text-sm">
                  <p className="font-semibold text-destructive mb-2">Error Details:</p>
                  <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40">
                    {error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40 mt-2 text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              )}

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Error Reference:</strong> <code className="bg-muted px-1 py-0.5 rounded text-xs">{errorId}</code>
                </p>
                <p className="mt-2">
                  Please include this reference code when contacting support.
                </p>
              </div>

              {this.props.showErrorReport && (
                <div className="space-y-4">
                  {!showFeedbackForm ? (
                    <Button
                      onClick={this.handleReportBug}
                      variant="outline"
                      className="w-full"
                    >
                      <Bug className="mr-2 h-4 w-4" />
                      Report this issue
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      {this.state.feedbackError && (
                        <div className="text-sm text-destructive font-medium">
                          {this.state.feedbackError}
                        </div>
                      )}
                      <div>
                        <label htmlFor="feedback" className="block text-sm font-medium mb-2">
                          What were you trying to do when this error occurred?
                        </label>
                        <textarea
                          id="feedback"
                          value={userFeedback}
                          onChange={(e) => this.setState({ userFeedback: e.target.value })}
                          className="w-full min-h-25 p-3 border-none bg-secondary/50 rounded-xl resize-none"
                          placeholder="Please describe what happened..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={this.handleFeedbackSubmit}
                          disabled={!userFeedback.trim()}
                          className="flex-1"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Submit Feedback
                        </Button>
                        <Button
                          onClick={() => this.setState({ showFeedbackForm: false, userFeedback: '' })}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex gap-2 flex-wrap">
              <Button onClick={this.handleReset} variant="default" className="flex-1 sm:flex-none" autoFocus>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={this.handleReload} variant="outline" className="flex-1 sm:flex-none">
                Reload Page
              </Button>
              <Button onClick={this.handleGoHome} variant="outline" className="flex-1 sm:flex-none">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </CardFooter>
          </Card>
        </SurfacePanel>
      </PageContainer>
    );
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return this.renderFallbackComponent();
    }

    return this.props.children;
  }
}

/**
 * Safe Component wrapper with enhanced error boundary
 */
export function SafeEnhancedComponent({ 
  children, 
  fallback,
  fallbackComponent,
  onError,
  errorContext,
  showErrorReport = true,
  resetOnPropsChange = false,
  resetKeys,
}: Omit<EnhancedErrorBoundaryProps, 'children'> & { children: ReactNode }) {
  return (
    <EnhancedErrorBoundary
      fallback={fallback}
      fallbackComponent={fallbackComponent}
      onError={onError}
      errorContext={errorContext}
      showErrorReport={showErrorReport}
      resetOnPropsChange={resetOnPropsChange}
      resetKeys={resetKeys}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

/**
 * Error boundary for specific sections of the app
 */
export function SectionErrorBoundary({ 
  children, 
  sectionName,
  onError,
}: { 
  children: ReactNode;
  sectionName: string;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}) {
  return (
    <EnhancedErrorBoundary
      errorContext={{ operation: `section_${sectionName}` }}
      onError={onError}
      fallbackComponent={({ error, resetError }) => (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error in {sectionName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This section encountered an error. Try refreshing or contact support if the problem persists.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={resetError} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardFooter>
        </Card>
      )}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

