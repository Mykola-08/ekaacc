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
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
          <div className="bg-card rounded-3xl shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Ups! Alguna cosa ha anat malament
            </h1>
            
            <p className="text-muted-foreground mb-8">
              Ho sentim, s'ha produït un error inesperat. Prova de recarregar la pàgina o torna a l'inici.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left" open>
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground/90 font-medium">
                  Detalls de l'error
                </summary>
                <div className="mt-4 p-4 bg-muted rounded-lg border border-gray-200">
                  <p className="font-mono text-sm font-bold text-red-700 mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </p>
                  <pre className="text-xs text-foreground/90 whitespace-pre-wrap overflow-auto max-h-60">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tornar a intentar
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-foreground font-medium rounded-xl transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
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
export function ErrorFallback({ 
  error, 
  resetError 
}: { 
  error: Error; 
  resetError: () => void; 
}) {
  return (
    <div className="p-8 bg-red-50 border border-red-200 rounded-2xl">
      <div className="flex items-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
        <h2 className="text-lg font-medium text-red-900">
          Error en aquesta secció
        </h2>
      </div>
      
      <p className="text-red-700 mb-4">
        S'ha produït un error en aquesta part de l'aplicació.
      </p>
      
      <button
        onClick={resetError}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
      >
        Tornar a intentar
      </button>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-red-600">
            Detalls de l'error
          </summary>
          <pre className="mt-2 text-xs text-red-800 whitespace-pre-wrap">
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}
