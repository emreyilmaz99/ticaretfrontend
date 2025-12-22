// src/pages/vendor/Products/components/modal/ModalFooter.jsx
import React from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { styles } from '../../styles';

const ModalFooter = ({ mode, onClose, onSubmit, isSubmitting, isMobile = false }) => {
  const footerStyle = isMobile ? {
    ...styles.modalFooter,
    padding: '16px',
    flexDirection: mode === 'view' ? 'row' : 'column-reverse',
    gap: '8px'
  } : styles.modalFooter;

  const buttonStyle = isMobile ? {
    width: '100%',
    justifyContent: 'center',
    padding: '12px 16px'
  } : {};

  if (mode === 'view') {
    return (
      <>
        <button 
          type="button" 
          style={{ ...styles.cancelBtn, ...buttonStyle }}
          onClick={onClose}
        >
          Kapat
        </button>
      </>
    );
  }

  return (
    <>
      <button 
        type="button" 
        style={{ ...styles.cancelBtn, ...buttonStyle }}
        onClick={onClose}
        disabled={isSubmitting}
      >
        <FaTimes style={{ marginRight: 6 }} />
        İptal
      </button>
      <button 
        type="submit" 
        style={{ ...styles.submitBtn, ...buttonStyle }}
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        <FaSave style={{ marginRight: 6 }} />
        {isSubmitting ? 'Kaydediliyor...' : (mode === 'create' ? 'Ürün Ekle' : 'Güncelle')}
      </button>
    </>
  );
};

export default ModalFooter;
