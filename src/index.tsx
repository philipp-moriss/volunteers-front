import { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import './index.css';

// Error Boundary компонент
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          fontFamily: 'system-ui',
          maxWidth: '600px',
          margin: '0 auto',
          marginTop: '50px'
        }}>
          <h1>Ошибка загрузки приложения</h1>
          <p>{this.state.error?.message || 'Произошла неизвестная ошибка'}</p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Перезагрузить приложение
          </button>
          <details style={{ marginTop: '20px' }}>
            <summary>Детали ошибки</summary>
            <pre style={{ 
              marginTop: '10px', 
              padding: '10px', 
              background: '#f5f5f5',
              overflow: 'auto',
              fontSize: '12px'
            }}>
              {this.state.error?.stack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Обработка ошибок рендеринга
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  console.error('Promise rejection details:', {
    reason: event.reason,
    stack: event.reason?.stack
  });
});

// Логирование для отладки
console.log('🚀 App initialization started');
console.log('📍 User Agent:', navigator.userAgent);
console.log('📍 Platform:', navigator.platform);
console.log('📍 Location:', window.location.href);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

try {
  console.log('📦 Rendering app...');
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>
  );
  console.log('✅ App rendered successfully');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="padding: 20px; font-family: system-ui; max-width: 600px; margin: 0 auto;">
      <h1>Ошибка загрузки приложения</h1>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <p>Проверьте консоль для подробностей.</p>
      <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer;">
        Перезагрузить
      </button>
    </div>
  `;
}
