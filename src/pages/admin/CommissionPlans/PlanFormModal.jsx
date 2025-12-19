// src/pages/admin/CommissionPlans/PlanFormModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

/**
 * Plan oluşturma/düzenleme modal formu
 */
const PlanFormModal = ({
  isOpen,
  isEditing,
  formData,
  onFormChange,
  onSubmit,
  onClose,
  styles
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={{
        ...styles.modalContent,
        width: isMobile ? '100%' : styles.modalContent.width,
        maxWidth: isMobile ? '100%' : styles.modalContent.maxWidth,
        margin: isMobile ? '0' : styles.modalContent.margin,
        borderRadius: isMobile ? '20px 20px 0 0' : styles.modalContent.borderRadius,
        maxHeight: isMobile ? '90vh' : styles.modalContent.maxHeight,
        position: isMobile ? 'fixed' : 'relative',
        bottom: isMobile ? '0' : 'auto',
        left: isMobile ? '0' : 'auto',
        right: isMobile ? '0' : 'auto',
        animation: isMobile ? 'slideUp 0.3s ease-out' : 'none'
      }}>
        <div style={{
          ...styles.modalHeader,
          padding: isMobile ? '20px 16px' : styles.modalHeader.padding
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: isMobile ? '18px' : '20px', 
            color: '#0f172a',
            fontWeight: '600'
          }}>
            {isEditing ? 'Planı Düzenle' : 'Yeni Plan Ekle'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#94a3b8',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: isMobile ? '44px' : 'auto',
              minWidth: isMobile ? '44px' : 'auto'
            }}
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div style={{
            ...styles.modalBody,
            padding: isMobile ? '16px' : styles.modalBody.padding,
            maxHeight: isMobile ? 'calc(90vh - 180px)' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>
                Plan Adı
              </label>
              <input 
                type="text" 
                style={{
                  ...styles.input,
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '16px' : styles.input.fontSize
                }}
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>
                Komisyon Oranı (%)
              </label>
              <input 
                type="number" 
                step="0.01"
                style={{
                  ...styles.input,
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '16px' : styles.input.fontSize
                }}
                value={formData.rate}
                onChange={(e) => onFormChange('rate', e.target.value)}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>
                Açıklama
              </label>
              <textarea 
                style={{
                  ...styles.textarea,
                  minHeight: isMobile ? '100px' : styles.textarea.minHeight,
                  fontSize: isMobile ? '16px' : styles.textarea.fontSize
                }}
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
              />
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: isMobile ? '12px' : '8px',
              backgroundColor: isMobile ? '#f8fafc' : 'transparent',
              borderRadius: isMobile ? '8px' : '0'
            }}>
              <input 
                type="checkbox" 
                id="isActive"
                checked={formData.is_active}
                onChange={(e) => onFormChange('is_active', e.target.checked)}
                style={{
                  width: isMobile ? '20px' : '16px',
                  height: isMobile ? '20px' : '16px',
                  cursor: 'pointer'
                }}
              />
              <label 
                htmlFor="isActive" 
                style={{ 
                  fontSize: isMobile ? '15px' : '14px', 
                  color: '#334155', 
                  cursor: 'pointer',
                  fontWeight: isMobile ? '500' : 'normal'
                }}
              >
                Aktif
              </label>
            </div>
          </div>
          
          <div style={{
            ...styles.modalFooter,
            padding: isMobile ? '16px' : styles.modalFooter.padding,
            flexDirection: isMobile ? 'column-reverse' : 'row',
            gap: isMobile ? '12px' : '12px'
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{
                ...styles.cancelBtn,
                width: isMobile ? '100%' : 'auto',
                minHeight: isMobile ? '44px' : 'auto',
                fontSize: isMobile ? '15px' : styles.cancelBtn.fontSize,
                order: isMobile ? 2 : 1
              }}
            >
              İptal
            </button>
            <button 
              type="submit" 
              style={{
                ...styles.primaryBtn,
                width: isMobile ? '100%' : 'auto',
                minHeight: isMobile ? '44px' : 'auto',
                fontSize: isMobile ? '15px' : styles.primaryBtn.fontSize,
                order: isMobile ? 1 : 2
              }}
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanFormModal;
