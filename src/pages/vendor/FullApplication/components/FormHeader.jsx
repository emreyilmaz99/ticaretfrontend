import React, { useState, useEffect } from 'react';
import { FaStore, FaArrowLeft } from 'react-icons/fa';
import { styles } from '../styles';

/**
 * Form header with back button and title
 */
const FormHeader = ({ vendorName, onGoBack }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Back Button */}
      <button onClick={onGoBack} style={styles.backButton}>
        <FaArrowLeft /> {isMobile ? '' : 'Duruma Dön'}
      </button>

      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          <FaStore />
        </div>
        <h1 style={styles.title}>Tam Başvuru Formu</h1>
        <p style={styles.subtitle}>
          Merhaba <strong>{vendorName}</strong>! Hesabınızı aktifleştirmek için kalan bilgileri tamamlayın.
        </p>
      </div>
    </>
  );
};

export default FormHeader;
