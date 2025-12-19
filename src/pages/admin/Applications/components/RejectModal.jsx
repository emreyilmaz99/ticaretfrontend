// src/pages/admin/Applications/components/RejectModal.jsx
import React from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Başvuru reddetme modalı
 */
const RejectModal = ({
  isOpen,
  vendor,
  reason,
  onReasonChange,
  onClose,
  onSubmit,
  isSubmitting,
  minLength = 10
}) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !vendor) return null;

  const isValid = reason.length >= minLength;

  const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease',
  };

  const contentStyle = {
    backgroundColor: 'white',
    borderRadius: isMobile ? '20px 20px 0 0' : '20px',
    width: '100%',
    maxWidth: isMobile ? '100%' : '580px',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    animation: 'slideUp 0.3s ease',
    overflow: 'hidden',
    ...(isMobile ? {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: '95vh'
    } : {})
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    padding: isMobile ? '24px 16px' : '32px',
    borderBottom: '1px solid #fecaca',
    position: 'relative',
  };

  const iconContainerStyle = {
    width: isMobile ? '56px' : '64px',
    height: isMobile ? '56px' : '64px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: isMobile ? '16px' : '20px',
    right: isMobile ? '16px' : '20px',
    background: 'white',
    border: 'none',
    width: isMobile ? '44px' : '36px',
    height: isMobile ? '44px' : '36px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
  };

  const bodyStyle = {
    padding: isMobile ? '20px 16px' : '32px',
  };

  const textareaStyle = {
    width: '100%',
    minHeight: isMobile ? '120px' : '140px',
    padding: isMobile ? '14px' : '16px',
    border: `2px solid ${reason.length > 0 && !isValid ? '#fca5a5' : '#e5e7eb'}`,
    borderRadius: '12px',
    fontSize: isMobile ? '16px' : '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    transition: 'all 0.2s',
    lineHeight: '1.6',
    backgroundColor: '#fafafa',
  };

  const footerStyle = {
    padding: isMobile ? '16px' : '24px 32px',
    background: '#f9fafb',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: isMobile ? '10px' : '12px',
    borderTop: '1px solid #e5e7eb',
    flexDirection: isMobile ? 'column-reverse' : 'row'
  };

  const cancelButtonStyle = {
    padding: isMobile ? '14px 24px' : '12px 28px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    background: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: isMobile ? '15px' : '14px',
    color: '#6b7280',
    transition: 'all 0.2s',
    width: isMobile ? '100%' : 'auto',
    minHeight: isMobile ? '44px' : 'auto'
  };

  const rejectButtonStyle = {
    padding: isMobile ? '14px 24px' : '12px 28px',
    borderRadius: '12px',
    border: 'none',
    background: !isValid
      ? '#d1d5db'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: 'white',
    cursor: !isValid ? 'not-allowed' : 'pointer',
    fontWeight: '700',
    fontSize: isMobile ? '15px' : '14px',
    width: isMobile ? '100%' : 'auto',
    minHeight: isMobile ? '44px' : 'auto',
    fontSize: '14px',
    boxShadow: isValid ? '0 6px 20px rgba(239, 68, 68, 0.4)' : 'none',
    transition: 'all 0.2s',
    opacity: !isValid ? 0.6 : 1,
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'white';
            }}
          >
            <FaTimes size={16} />
          </button>
          
          <div style={iconContainerStyle}>
            <FaExclamationTriangle size={32} color="white" />
          </div>
          
          <h2 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '800',
            color: '#991b1b',
            marginBottom: '8px',
            letterSpacing: '-0.02em'
          }}>
            Başvuruyu Reddet
          </h2>
          
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#7f1d1d',
            lineHeight: '1.5',
            fontWeight: '500'
          }}>
            <strong>{vendor.full_name || vendor.owner}</strong> adlı başvuruyu reddetmek üzeresiniz
          </p>
        </div>

        <div style={bodyStyle}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '12px'
          }}>
            Red Nedeni <span style={{ color: '#ef4444' }}>*</span>
          </label>
          
          <textarea
            style={textareaStyle}
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Örn: Belgeleriniz eksik veya hatalı..."
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.backgroundColor = 'white';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = reason.length > 0 && !isValid ? '#fca5a5' : '#e5e7eb';
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
          />
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
          }}>
            <div style={{
              fontSize: '12px',
              color: !isValid && reason.length > 0 ? '#ef4444' : '#9ca3af',
              fontWeight: '600'
            }}>
              {!isValid && reason.length > 0 && (
                <span>⚠️ En az {minLength} karakter gerekli</span>
              )}
            </div>
            <div style={{
              fontSize: '12px',
              color: !isValid ? '#9ca3af' : '#10b981',
              fontWeight: '600'
            }}>
              {reason.length} / 1000
            </div>
          </div>
        </div>

        <div style={footerStyle}>
          <button
            onClick={onClose}
            style={cancelButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            İptal
          </button>
          <button
            onClick={onSubmit}
            disabled={!isValid || isSubmitting}
            style={rejectButtonStyle}
            onMouseEnter={(e) => {
              if (isValid && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (isValid && !isSubmitting) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
              }
            }}
          >
            {isSubmitting ? '🔄 Reddediliyor...' : '✕ Reddet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;
