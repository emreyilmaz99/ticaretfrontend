// src/pages/admin/Categories/CategoryFormModal.jsx
import React, { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaImage, FaCheck } from 'react-icons/fa';
import { getIconEmoji } from './styles';

/**
 * Kategori oluşturma/düzenleme modal formu
 */
const CategoryFormModal = ({
  isOpen,
  mode,
  formData,
  imagePreview,
  parentOptions,
  onFormChange,
  onImageChange,
  onSubmit,
  onClose,
  isSubmitting,
  styles
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={{
        ...styles.modalContent,
        ...(isMobile ? {
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 'auto',
          maxWidth: '100%',
          maxHeight: '90vh',
          borderRadius: '20px 20px 0 0',
          margin: 0,
          transform: 'none'
        } : {})
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          ...styles.modalHeader,
          padding: isMobile ? '16px' : styles.modalHeader.padding
        }}>
          <h2 style={{
            ...styles.modalTitle,
            fontSize: isMobile ? '18px' : styles.modalTitle.fontSize
          }}>
            {mode === 'create' ? 'Yeni Kategori Oluştur' : 'Kategori Düzenle'}
          </h2>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#64748b',
              minWidth: isMobile ? '44px' : 'auto',
              minHeight: isMobile ? '44px' : 'auto'
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
            overflowY: 'auto'
          }}>
            {/* Name */}
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>Kategori Adı *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange('name', e.target.value)}
                style={{
                  ...styles.input,
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '16px' : styles.input.fontSize
                }}
                placeholder="Örn: Elektronik"
                required
              />
            </div>

            {/* Parent Category */}
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>Üst Kategori</label>
              <select
                value={formData.parent_id}
                onChange={(e) => onFormChange('parent_id', e.target.value)}
                style={{
                  ...styles.input,
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '16px' : styles.input.fontSize
                }}
              >
                {parentOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

            {/* Icon */}
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>İkon (React Icon Adı)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => onFormChange('icon', e.target.value)}
                style={{
                  ...styles.input,
                  minHeight: isMobile ? '44px' : 'auto',
                  fontSize: isMobile ? '16px' : styles.input.fontSize
                }}
                placeholder="Örn: FaMobileAlt"
              />
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Önizleme: {getIconEmoji(formData.icon)}
              </p>
            </div>

            {/* Description */}
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>Açıklama</label>
              <textarea
                value={formData.description}
                onChange={(e) => onFormChange('description', e.target.value)}
                style={{
                  ...styles.textarea,
                  minHeight: isMobile ? '100px' : styles.textarea.minHeight,
                  fontSize: isMobile ? '16px' : styles.textarea.fontSize
                }}
                placeholder="Kategori açıklaması..."
              />
            </div>

            {/* Image */}
            <div style={styles.formGroup}>
              <label style={{
                ...styles.label,
                fontSize: isMobile ? '13px' : styles.label.fontSize
              }}>Görsel</label>
              <div style={{ 
                display: 'flex', 
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '12px' : '16px', 
                alignItems: isMobile ? 'stretch' : 'flex-start' 
              }}>
                {imagePreview && (
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    style={{ 
                      width: isMobile ? '100%' : '80px', 
                      height: isMobile ? '120px' : '80px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0' 
                    }} 
                  />
                )}
                <div style={{ flex: 1 }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    style={{ display: 'none' }}
                    id="category-image"
                  />
                  <label 
                    htmlFor="category-image"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: isMobile ? '12px 16px' : '8px 16px',
                      borderRadius: '8px',
                      border: '1px dashed #cbd5e1',
                      cursor: 'pointer',
                      fontSize: isMobile ? '15px' : '14px',
                      color: '#64748b',
                      width: isMobile ? '100%' : 'auto',
                      minHeight: isMobile ? '44px' : 'auto'
                    }}
                  >
                    <FaImage size={14} /> Görsel Seç
                  </label>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Max 2MB (JPG, PNG, WEBP)
                  </p>
                </div>
              </div>
            </div>

            {/* Sort Order & Status */}
            <div style={{
              ...styles.grid2,
              gridTemplateColumns: isMobile ? '1fr' : styles.grid2.gridTemplateColumns,
              gap: isMobile ? '16px' : styles.grid2.gap
            }}>
              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  fontSize: isMobile ? '13px' : styles.label.fontSize
                }}>Sıra Numarası</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => onFormChange('sort_order', parseInt(e.target.value) || 0)}
                  style={{
                    ...styles.input,
                    minHeight: isMobile ? '44px' : 'auto',
                    fontSize: isMobile ? '16px' : styles.input.fontSize
                  }}
                  min="0"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={{
                  ...styles.label,
                  fontSize: isMobile ? '13px' : styles.label.fontSize
                }}>Durum</label>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  paddingTop: '8px',
                  flexDirection: isMobile ? 'column' : 'row'
                }}>
                  <button
                    type="button"
                    onClick={() => onFormChange('is_active', true)}
                    style={{
                      padding: isMobile ? '12px 16px' : '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: formData.is_active ? '#16a34a' : '#e2e8f0',
                      backgroundColor: formData.is_active ? '#dcfce7' : 'white',
                      color: formData.is_active ? '#166534' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: isMobile ? '15px' : '14px',
                      minHeight: isMobile ? '44px' : 'auto',
                      width: isMobile ? '100%' : 'auto',
                      flex: isMobile ? 1 : 'none'
                    }}
                  >
                    <FaCheck size={12} /> Aktif
                  </button>
                  <button
                    type="button"
                    onClick={() => onFormChange('is_active', false)}
                    style={{
                      padding: isMobile ? '12px 16px' : '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: !formData.is_active ? '#dc2626' : '#e2e8f0',
                      backgroundColor: !formData.is_active ? '#fee2e2' : 'white',
                      color: !formData.is_active ? '#991b1b' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: isMobile ? '15px' : '14px',
                      minHeight: isMobile ? '44px' : 'auto',
                      width: isMobile ? '100%' : 'auto',
                      flex: isMobile ? 1 : 'none'
                    }}
                  >
                    <FaTimes size={12} /> Pasif
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            ...styles.modalFooter,
            flexDirection: isMobile ? 'column-reverse' : 'row',
            gap: isMobile ? '12px' : styles.modalFooter.gap,
            padding: isMobile ? '16px' : styles.modalFooter.padding
          }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{
                ...styles.btnSecondary,
                width: isMobile ? '100%' : 'auto',
                minHeight: isMobile ? '44px' : 'auto',
                fontSize: isMobile ? '15px' : '14px'
              }}
            >
              İptal
            </button>
            <button 
              type="submit" 
              style={{
                ...styles.btnPrimary,
                width: isMobile ? '100%' : 'auto',
                minHeight: isMobile ? '44px' : 'auto',
                fontSize: isMobile ? '15px' : '14px'
              }}
              disabled={isSubmitting}
            >
              <FaSave size={14} /> {mode === 'create' ? 'Oluştur' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;
