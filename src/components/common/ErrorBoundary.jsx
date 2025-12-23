// src/components/common/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <h2 style={{ color: '#ef4444', fontSize: '24px', fontWeight: '600' }}>
            ⚠️ Bir Hata Oluştu
          </h2>
          <p style={{ color: '#64748b', maxWidth: '500px' }}>
            {this.state.error?.message?.includes('Failed to fetch') 
              ? 'Backend sunucuya bağlanılamıyor. Lütfen backend sunucusunun çalıştığından emin olun.'
              : 'Sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#059669',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Sayfayı Yenile
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e2e8f0',
                color: '#334155',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Ana Sayfaya Dön
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '24px', textAlign: 'left', width: '100%', maxWidth: '600px' }}>
              <summary style={{ cursor: 'pointer', color: '#64748b', fontSize: '14px' }}>
                Hata Detayları (Geliştirici)
              </summary>
              <pre style={{
                marginTop: '12px',
                padding: '16px',
                backgroundColor: '#1e293b',
                color: '#e2e8f0',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
