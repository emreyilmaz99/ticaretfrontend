// src/pages/vendor/Products/components/modal/ModalHeader.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { styles } from '../../styles';

const ModalHeader = ({ mode, onClose, isMobile = false }) => {
  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Yeni Ürün Ekle';
      case 'edit': return 'Ürün Düzenle';
      case 'view': return 'Ürün Detayları';
      default: return 'Ürün';
    }
  };

  const titleStyle = isMobile ? {
    ...styles.modalTitle,
    fontSize: '16px'
  } : styles.modalTitle;

  return (
    <>
      <h2 style={titleStyle}>{getTitle()}</h2>
      <button style={styles.modalCloseBtn} onClick={onClose}>
        <FaTimes size={isMobile ? 18 : 20} />
      </button>
    </>
  );
};

export default ModalHeader;
