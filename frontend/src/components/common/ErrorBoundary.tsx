import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

void React;

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Root and route-level ErrorBoundary that intercepts uncaught render errors,
 * prevents white-screen crashes, and provides branded recovery controls.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary caught error]:', error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.state = { hasError: false, error: null };
    try {
      this.setState({ hasError: false, error: null });
    } catch {
      // Ignore if unmounted in test harness
    }
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleReturnHome = (): void => {
    this.handleReset();
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-[60vh] flex items-center justify-center p-6 bg-primary-bg text-primary-text"
        >
          <div className="w-full max-w-lg p-8 bg-surface-light border border-border-primary rounded-2xl shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-primary-text">
                Something went wrong
              </h2>
              <p className="text-sm text-secondary-text leading-relaxed">
                An unexpected interface error occurred. You can reload the page to restore the application state or return to the homepage.
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error.message && (
              <div className="p-3 bg-black/5 dark:bg-white/5 rounded-lg border border-border-primary text-left text-xs font-mono text-secondary-text overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-accent-primary hover:bg-accent-secondary text-white transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleReturnHome}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm border border-border-primary text-primary-text hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
