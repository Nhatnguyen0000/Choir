import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--background)]">
        <div className="w-full max-w-md p-8 text-center space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--background-elevated)] shadow-[var(--shadow-lg)]">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-[var(--error-bg)]">
            <AlertTriangle size={32} className="text-[var(--error)]" />
          </div>
          <h2 className="page-title">Đã xảy ra lỗi</h2>
          <p className="text-sm leading-relaxed text-[var(--foreground-muted)]">
            Ứng dụng gặp sự cố không mong muốn. Vui lòng thử tải lại trang.
          </p>
          {this.state.error && (
            <pre className="text-xs text-left rounded-xl p-4 overflow-auto max-h-32 border bg-[var(--background-muted)] text-[var(--foreground-muted)] border-[var(--border)]">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={this.handleReset} className="btn-secondary flex-1">
              Thử lại
            </button>
            <button onClick={() => window.location.reload()} className="btn-primary flex-1">
              <RefreshCw size={14} /> Tải lại
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
