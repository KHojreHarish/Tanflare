import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In production, you might want to send this to a monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to monitoring service
      // monitoringService.captureException(error, { extra: errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[400px] flex items-center justify-center p-8"
        >
          <div className="text-center max-w-md mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-4"
            >
              ⚠️
            </motion.div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              Something went wrong
            </h2>

            <p className="text-muted-foreground mb-6">
              We're sorry, but something unexpected happened. Please try
              refreshing the page.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Refresh Page
              </button>

              <button
                onClick={() =>
                  this.setState({ hasError: false, error: undefined })
                }
                className="block mx-auto px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Try Again
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </motion.div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // monitoringService.captureException(error, { extra: errorInfo })
    }
  }
}

// Higher-order component for wrapping components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`

  return WrappedComponent
}
