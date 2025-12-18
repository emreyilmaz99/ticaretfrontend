import React, { useState, useEffect } from 'react';
import { FaStore, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * Registration page header
 */
const RegisterHeader = ({ step, styles }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      {/* Back Button - Mobile Only */}
      {isMobile && (
        <button onClick={handleBack} style={styles.backButton}>
          <FaArrowLeft />
        </button>
      )}
      
      <div style={styles.header}>
        <div style={styles.iconWrapper}>
          <FaStore />
        </div>
        <h1 style={styles.title}>Satıcı Başvurusu</h1>
        <p style={styles.subtitle}>
          Platformumuzda mağazanızı açın ve satışa başlayın.<br/>
          <span style={styles.subtitleHighlight}>
            {step === 1 ? 'Hesap Bilgileri' : 'Mağaza Detayları'}
          </span>
        </p>
      </div>
    </>
  );
};

export default RegisterHeader;
