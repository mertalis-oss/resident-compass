import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackPath?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('[ErrorBoundary]', error);
  }

  render() {
    if (this.state.hasError) {
      const path = this.props.fallbackPath || '/';
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6">
          <h1 className="heading-section mb-4">Bir sorun oluştu</h1>
          <p className="text-sm text-muted-foreground mb-8">Sayfa yeniden yükleniyor...</p>
          <a href={path} className="btn-luxury-primary px-8 py-3 text-xs tracking-[0.15em] uppercase">
            Ana Sayfaya Dön
          </a>
          <script dangerouslySetInnerHTML={{ __html: `setTimeout(function(){window.location.href='${path}'},3000)` }} />
        </div>
      );
    }
    return this.props.children;
  }
}
