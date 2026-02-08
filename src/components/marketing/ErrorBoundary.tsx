import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // In production, you might want to send this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>

            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Ups! Alguna cosa ha anat malament
            </h1>

            <p className="mb-8 text-gray-600">
              Ho sentim, s'ha produït un error inesperat. Prova de recarregar la pàgina o torna a
              l'inici.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left" open>
                <summary className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-700">
                  Detalls de l'error
                </summary>
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-100 p-4">
                  <p className="mb-2 font-mono text-sm font-bold text-red-700">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  <pre className="max-h-60 overflow-auto text-xs whitespace-pre-wrap text-gray-700">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Tornar a intentar
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center rounded-xl bg-gray-200 px-6 py-3 font-medium text-gray-900 transition-colors hover:bg-gray-300"
              >
                <Home className="mr-2 h-4 w-4" />
                Anar a l'inici
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple error fallback component
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
      <div className="mb-4 flex items-center">
        <AlertTriangle className="mr-3 h-6 w-6 text-red-500" />
        <h2 className="text-lg font-medium text-red-900">Error en aquesta secció</h2>
      </div>

      <p className="mb-4 text-red-700">S'ha produït un error en aquesta part de l'aplicació.</p>

      <button
        onClick={resetError}
        className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
      >
        Tornar a intentar
      </button>

      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-red-600">Detalls de l'error</summary>
          <pre className="mt-2 text-xs whitespace-pre-wrap text-red-800">{error.message}</pre>
        </details>
      )}
    </div>
  );
}
