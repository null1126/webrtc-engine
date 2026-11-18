import { Component, type ErrorInfo, type ReactNode } from 'react';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="var(--color-danger, #e74c3c)" strokeWidth="1.3" />
            <path
              d="M10 6v4"
              stroke="var(--color-danger, #e74c3c)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <circle cx="10" cy="13.5" r="0.6" fill="var(--color-danger, #e74c3c)" />
          </svg>
          <div className="error-boundary-content">
            <strong>组件异常</strong>
            <span>{this.state.error?.message ?? '未知错误'}</span>
          </div>
          <button onClick={this.handleReset} className="error-boundary-reset">
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
