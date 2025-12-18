// src/components/common/Footer.jsx
import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const styles = {
    footer: {
      background: '#0f172a',
      color: 'white',
      padding: isMobile ? '20px 20px 80px 20px' : '40px 20px',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
      marginTop: 'auto',
    },
    footerText: {
      fontSize: isMobile ? '13px' : '14px',
      opacity: 0.7,
      fontFamily: '"Inter", sans-serif',
    },
  };

  return (
    <footer style={styles.footer}>
      <p style={styles.footerText}>
        © {new Date().getFullYear()} E-Ticaret. Tüm hakları saklıdır.
      </p>
    </footer>
  );
};

export default React.memo(Footer);
