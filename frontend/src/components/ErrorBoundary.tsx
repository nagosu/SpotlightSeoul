import React, { type ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

type ErrorBoundaryProps = {
  children: ReactNode;
  mode?: 'page' | 'section';
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: unknown;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(): void {
    // 에러 리포팅 도구가 있다면 이곳에서 연동할 수 있습니다.
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          mode={this.props.mode}
          onRetry={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
