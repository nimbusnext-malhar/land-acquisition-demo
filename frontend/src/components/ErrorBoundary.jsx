import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

/**
 * Error Boundary component to catch and display errors gracefully
 * Prevents the entire app from crashing on component errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === "production") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
          <Card className="max-w-md w-full bg-white border-red-200 shadow-lg">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h1 className="font-display font-semibold text-red-900">Something went wrong</h1>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-600">
                  An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>

                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="mt-4 p-3 bg-slate-50 rounded border border-slate-200">
                    <summary className="cursor-pointer font-mono text-xs font-semibold text-slate-700">
                      Error details (dev only)
                    </summary>
                    <pre className="mt-2 text-xs text-slate-600 overflow-auto max-h-48">
                      {this.state.error.toString()}
                      {"\n\n"}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={this.resetError}
                  className="flex-1 bg-[#0A2540] hover:bg-[#0F365A]"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => (window.location.href = "/dashboard")}
                  variant="outline"
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
