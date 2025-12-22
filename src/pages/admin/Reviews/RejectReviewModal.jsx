// src/pages/admin/Reviews/RejectReviewModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';

const RejectReviewModal = ({ 
  isBulk = false, 
  count = 1, 
  rejectionReason = '', 
  setRejectionReason, 
  onSubmit, 
  onClose, 
  isLoading, 
  styles 
}) => {
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = () => {
    if (!rejectionReason.trim()) {
      setError('Lütfen bir ret nedeni yazınız.');
      return;
    }
    if (rejectionReason.length < 10) {
      setError('Ret nedeni en az 10 karakter olmalıdır.');
      return;
    }
    onSubmit();
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div 
        style={{ 
          ...styles.modalContent, 
          maxWidth: isMobile ? '100%' : '500px',
          maxHeight: isMobile ? '90vh' : '400px',
          ...(isMobile ? {
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            top: 'auto',
            borderRadius: '20px 20px 0 0',
            margin: 0,
            transform: 'none'
          } : {})
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ 
          ...styles.modalHeader, 
          backgroundColor: '#fef2f2', 
          borderBottom: '1px solid #fecaca',
          padding: isMobile ? '16px' : styles.modalHeader.padding
        }}>
          <h2 style={{ 
            ...styles.modalTitle, 
            color: '#991b1b',
            fontSize: isMobile ? '18px' : styles.modalTitle.fontSize
          }}>
            <FaExclamationTriangle style={{ marginRight: '8px' }} />
            Yorumu Reddet
          </h2>
          <button style={{
            ...styles.modalCloseBtn,
            minWidth: isMobile ? '44px' : 'auto',
            minHeight: isMobile ? '44px' : 'auto'
          }} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div style={{
          ...styles.modalBody,
          padding: isMobile ? '16px' : styles.modalBody.padding
        }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
              {isBulk 
                ? `${count} yorum reddedilecek. Lütfen ret nedenini yazınız:` 
                : 'Yorum reddedilecek. Lütfen ret nedenini yazınız:'
              }
            </p>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              Ret Nedeni <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setError('');
              }}
              placeholder="Bu yorum neden reddediliyor? (örn: uygunsuz içerik, spam vb.)"
              style={{
                width: '100%',
                minHeight: isMobile ? '100px' : '120px',
                padding: '12px',
                fontSize: isMobile ? '16px' : '14px',
                border: error ? '1px solid #ef4444' : '1px solid #d1d5db',
                borderRadius: '8px',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = '#6366f1';
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = '#d1d5db';
              }}
              disabled={isLoading}
            />
            {error && (
              <p style={{ 
                fontSize: '12px', 
                color: '#ef4444', 
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <FaExclamationTriangle size={12} /> {error}
              </p>
            )}
            <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
              {rejectionReason.length}/500 karakter
            </p>
          </div>

          {/* Quick Reasons */}
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
              Hızlı seçim:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'Uygunsuz içerik',
                'Spam / Reklam',
                'Sahte değerlendirme',
                'Hakaret içerikli',
                'Ürünle ilgisiz',
              ].map((quickReason) => (
                <button
                  key={quickReason}
                  type="button"
                  onClick={() => setRejectionReason(quickReason)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    backgroundColor: rejectionReason === quickReason ? '#6366f1' : '#f3f4f6',
                    color: rejectionReason === quickReason ? '#fff' : '#4b5563',
                    border: 'none',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  disabled={isLoading}
                >
                  {quickReason}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          ...styles.modalFooter,
          flexDirection: isMobile ? 'column-reverse' : styles.modalFooter.flexDirection,
          gap: isMobile ? '8px' : styles.modalFooter.gap,
          padding: isMobile ? '16px' : styles.modalFooter.padding
        }}>
          <button 
            style={{
              ...styles.modalCancelBtn,
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '44px' : 'auto',
              fontSize: isMobile ? '15px' : styles.modalCancelBtn.fontSize
            }} 
            onClick={onClose}
            disabled={isLoading}
          >
            İptal
          </button>
          <button 
            style={{
              ...styles.modalRejectBtn,
              width: isMobile ? '100%' : 'auto',
              minHeight: isMobile ? '44px' : 'auto',
              fontSize: isMobile ? '15px' : styles.modalRejectBtn.fontSize,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'İşleniyor...' : isBulk ? `${count} Yorumu Reddet` : 'Yorumu Reddet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReviewModal;
