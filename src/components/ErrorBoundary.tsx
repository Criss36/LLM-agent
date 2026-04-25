import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-8"
          style={{ background: 'var(--void)', color: 'var(--text)' }}
        >
          <div className="text-center max-w-md">
            <div
              className="text-6xl mb-6"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan)' }}
            >
              !
            </div>
            <h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              渲染异常
            </h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>
              页面遇到意外错误。请尝试刷新。
            </p>
            <p
              className="text-xs p-4 rounded-lg mb-6 text-left overflow-auto"
              style={{
                fontFamily: 'var(--font-mono)',
                background: 'var(--deep)',
                border: '1px solid var(--border)',
                color: 'var(--text-3)',
              }}
            >
              {this.state.error?.message}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-glow"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
