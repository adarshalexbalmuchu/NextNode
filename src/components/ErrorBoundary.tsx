import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      eventId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Report error to external service
    this.reportError(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In production, you would send this to your error reporting service
      // Examples: Sentry, LogRocket, Bugsnag, etc.
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        eventId: this.state.eventId,
      };

      // For development, log to console
      if (process.env.NODE_ENV === 'development') {
        console.group('🐛 Error Report');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.table(errorReport);
        console.groupEnd();
      }

      // TODO: Replace with actual error reporting service
      // await errorReportingService.report(errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    // Clear error state and retry
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleReportBug = () => {
    const { error, errorInfo, eventId } = this.state;
    const subject = encodeURIComponent(`Bug Report - ${eventId}`);
    const body = encodeURIComponent(`
Error: ${error?.message}
Event ID: ${eventId}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Stack Trace:
${error?.stack}

Component Stack:
${errorInfo?.componentStack}

Please describe what you were doing when this error occurred:
    `);
    
    window.open(`mailto:support@quantumreadflow.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-xl">Something went wrong</CardTitle>
              <CardDescription>
                We're sorry, but something unexpected happened. Our team has been notified.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {this.props.showDetails && this.state.error && (
                <Alert>
                  <Bug className="h-4 w-4" />
                  <AlertDescription className="font-mono text-sm">
                    <details>
                      <summary className="cursor-pointer mb-2">Error Details</summary>
                      <div className="space-y-2">
                        <div>
                          <strong>Error:</strong> {this.state.error.message}
                        </div>
                        <div>
                          <strong>Event ID:</strong> {this.state.eventId}
                        </div>
                        {process.env.NODE_ENV === 'development' && (
                          <div>
                            <strong>Stack:</strong>
                            <pre className="mt-1 whitespace-pre-wrap text-xs">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={this.handleReload} variant="secondary" className="flex-1">
                  Reload Page
                </Button>
                <Button onClick={this.handleReportBug} variant="outline" className="flex-1">
                  <Bug className="mr-2 h-4 w-4" />
                  Report Bug
                </Button>
              </div>

              {this.state.eventId && (
                <p className="text-center text-sm text-muted-foreground">
                  Error ID: {this.state.eventId}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for programmatically triggering error boundaries
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    // This will trigger the nearest error boundary
    throw error;
  };
}

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null,
    };
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = new Error(event.reason?.message || 'Unhandled promise rejection');
    error.stack = event.reason?.stack || error.stack;
    
    this.setState({
      hasError: true,
      error,
      errorInfo: { componentStack: 'Promise rejection' } as ErrorInfo,
      eventId: `async-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    // Prevent the default browser error handling
    event.preventDefault();
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      eventId: `async-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AsyncErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorBoundary {...this.props} />;
    }

    return this.props.children;
  }
}
