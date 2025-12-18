// src/pages/user/Favorites/components/FavoritesHeader.jsx
import React, { useState, useEffect } from 'react';
import { FaTrash, FaShoppingCart, FaSortAmountDown } from 'react-icons/fa';

export const FavoritesHeader = ({ 
  count, 
  sortBy, 
  setSortBy, 
  onMoveAllToCart, 
  onClearAll, 
  styles 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={styles.header}>
      <div style={styles.titleGroup}>
        <h1 style={styles.title}>Favorilerim</h1>
        <span style={styles.countBadge}>{count} Ürün</span>
      </div>

      <div style={styles.actions}>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            ...styles.actionBtn,
            outline: 'none',
            cursor: 'pointer',
            minWidth: isMobile ? '80px' : 'auto',
          }}
        >
          <option value="date">{isMobile ? 'Tarih' : 'Eklenme Tarihi'}</option>
          <option value="price-asc">{isMobile ? 'Fiyat ↑' : 'Fiyat (Artan)'}</option>
          <option value="price-desc">{isMobile ? 'Fiyat ↓' : 'Fiyat (Azalan)'}</option>
        </select>

        <button 
          onClick={onMoveAllToCart}
          style={{...styles.actionBtn, ...styles.primaryBtn}}
        >
          <FaShoppingCart size={isMobile ? 12 : 14} /> 
          <span>{isMobile ? 'Sepete Ekle' : 'Tümünü Sepete Ekle'}</span>
        </button>

        <button 
          onClick={onClearAll}
          style={{...styles.actionBtn, color: '#ef4444', border: '1px solid #fee2e2'}}
        >
          <FaTrash size={isMobile ? 12 : 14} /> 
          <span>{isMobile ? 'Sil' : 'Tümünü Sil'}</span>
        </button>
      </div>
    </div>
  );
};
