// src/components/modals/shared/ModalOverlay.jsx
import React, { useEffect, useCallback, useState } from 'react';
import { getModalBaseStyles } from './styles/modalBase';
import './styles/animations.css';

const ModalOverlay = React.memo(({ isOpen, onClose, children, closeOnClickOutside = true, alignItems }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEscKey = useCallback((e) => {
    if (e.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen, handleEscKey]);

  if (!isOpen) return null;

  const handleOverlayClick = useCallback((e) => {
    if (closeOnClickOutside && e.target === e.currentTarget && onClose) {
      onClose();
    }
  }, [closeOnClickOutside, onClose]);

  const styles = getModalBaseStyles(isMobile, alignItems);

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      {children}
    </div>
  );
});

ModalOverlay.displayName = 'ModalOverlay';

export default ModalOverlay;
