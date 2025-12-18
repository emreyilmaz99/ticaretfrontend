import React, { useState, useEffect } from 'react';
import { FaThLarge, FaList, FaChevronDown } from 'react-icons/fa';
// styles.js dosyasını düzelttiğimiz için artık bu import sorunsuz çalışır
import { styles } from '../styles'; 

// --- HATA ÇÖZÜMÜ ---
// Aşağıda 'export const SortBar' diyerek "Named Export" yapıyoruz.
// Bu sayede index.js dosyası { SortBar } şeklinde aradığında bulabilecek.

export const SortBar = ({ 
  productCount = 0, 
  viewMode, 
  setViewMode, 
  sortBy, 
  setSortBy,
  isMobile,
  onOpenMobileFilter
}) => {
  const [isReallyMobile, setIsReallyMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsReallyMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mobileStyles = {
    toolbar: {
      ...styles.toolbar,
      flexDirection: isReallyMobile ? 'column' : 'row',
      padding: isReallyMobile ? '16px' : '18px 32px',
      gap: isReallyMobile ? '12px' : '0',
      minHeight: isReallyMobile ? 'auto' : '72px',
      alignItems: isReallyMobile ? 'stretch' : 'center',
    },
    resultCount: {
      ...styles.resultCount,
      fontSize: isReallyMobile ? '14px' : '15px',
      textAlign: isReallyMobile ? 'center' : 'left',
      flex: isReallyMobile ? 'none' : 1,
    },
    controlsRight: {
      ...styles.controlsRight,
      flexDirection: isReallyMobile ? 'row' : 'row',
      gap: isReallyMobile ? '8px' : '16px',
      marginLeft: isReallyMobile ? '0' : 'auto',
      justifyContent: 'space-between',
      flex: isReallyMobile ? 1 : 'none',
    },
    sortWrapper: {
      ...styles.sortWrapper,
      minWidth: isReallyMobile ? 'auto' : '180px',
      flex: isReallyMobile ? 1 : 'none',
    },
    sortSelect: {
      ...styles.sortSelect,
      fontSize: isReallyMobile ? '13px' : '14px',
      padding: isReallyMobile ? '10px 36px 10px 12px' : '12px 40px 12px 16px',
    },
    viewToggle: {
      ...styles.viewToggle,
      padding: isReallyMobile ? '3px' : '4px',
    },
    viewBtn: {
      ...styles.viewBtn,
      width: isReallyMobile ? '32px' : '36px',
      height: isReallyMobile ? '32px' : '36px',
    },
    viewBtnActive: {
      ...styles.viewBtnActive,
      width: isReallyMobile ? '32px' : '36px',
      height: isReallyMobile ? '32px' : '36px',
    },
  };

  return (
    <div style={mobileStyles.toolbar}>
      
      {/* Sol Taraf: Ürün Sayısı */}
      <div style={mobileStyles.resultCount}>
        Toplam <span style={styles.resultNumber}>{productCount}</span> ürün bulundu
      </div>

      {/* Sağ Taraf: Kontroller */}
      <div style={mobileStyles.controlsRight}>
        
        {/* Sıralama Seçimi */}
        <div style={mobileStyles.sortWrapper}>
          <select 
            style={mobileStyles.sortSelect} 
            value={sortBy || 'featured'} 
            onChange={(e) => {
              console.log('Sort değişti:', e.target.value);
              if (setSortBy) {
                setSortBy(e.target.value);
              }
            }}
          >
            <option value="newest">En Yeniler</option>
            <option value="featured">Öne Çıkanlar</option>
            <option value="price_asc">En Düşük Fiyat</option>
            <option value="price_desc">En Yüksek Fiyat</option>
          </select>
          <FaChevronDown style={styles.sortIcon} />
        </div>

        {/* Görünüm Değiştirme (Izgara / Liste) - Hide list view on mobile */}
        <div style={mobileStyles.viewToggle}>
          <button 
            style={viewMode === 'grid' ? mobileStyles.viewBtnActive : mobileStyles.viewBtn} 
            onClick={() => {
              console.log('Grid görünüm seçildi');
              if (setViewMode) {
                setViewMode('grid');
              }
            }}
            title="Izgara Görünüm"
          >
            <FaThLarge size={isReallyMobile ? 14 : 16} />
          </button>
          {!isReallyMobile && (
            <button 
              style={viewMode === 'list' ? mobileStyles.viewBtnActive : mobileStyles.viewBtn} 
              onClick={() => {
                console.log('List görünüm seçildi');
                if (setViewMode) {
                  setViewMode('list');
                }
              }}
              title="Liste Görünüm"
            >
              <FaList size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

// Hem Named hem Default export veriyoruz ki her türlü çalışsın.
export default SortBar;