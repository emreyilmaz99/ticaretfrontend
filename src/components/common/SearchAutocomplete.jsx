// src/components/common/SearchAutocomplete.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaShoppingBag, FaStore, FaTag } from 'react-icons/fa';
import { searchAutocomplete } from '../../services/searchService';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * SearchAutocomplete Component - Performance Optimized
 * Elasticsearch ile gerçek zamanlı arama önerileri
 * 
 * Performance Features:
 * - ✅ React.memo for preventing unnecessary re-renders
 * - ✅ useMemo for expensive calculations
 * - ✅ useCallback for stable function references
 * - ✅ Client-side cache for instant results
 * - ✅ Debounce for reducing API calls
 * - ✅ Lazy image loading
 * - ✅ AbortController for canceling pending requests
 * 
 * Props:
 * - placeholder: Input placeholder metni
 * - showIcon: Arama ikonu gösterilsin mi (varsayılan: true)
 * - autoFocus: Otomatik focus (varsayılan: false)
 * - minChars: Minimum karakter sayısı (varsayılan: 2)
 * - debounceDelay: Debounce gecikmesi ms (varsayılan: 300)
 * - maxResults: Maksimum sonuç sayısı (varsayılan: 8)
 * - onSearch: Arama sonrası callback (opsiyonel)
 */
const SearchAutocomplete = React.memo(({
  placeholder = 'Ürün, kategori veya marka ara...',
  showIcon = true,
  autoFocus = false,
  minChars = 2,
  debounceDelay = 300,
  maxResults = 8,
  onSearch
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isCached, setIsCached] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);
  const cacheRef = useRef(new Map()); // Client-side cache
  const debouncedQuery = useDebounce(query, debounceDelay);

  /**
   * API çağrısı - Client-side cache + AbortController ile optimize edildi
   */
  const fetchResults = useCallback(async (searchQuery) => {
    if (searchQuery.length < minChars) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Client-side cache kontrolü (instant results!)
    const cacheKey = searchQuery.toLowerCase();
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      setResults(cached.products);
      setIsCached(true);
      setIsOpen(cached.products.length > 0);
      return;
    }

    // Önceki request'i iptal et
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setIsCached(false);
    
    try {
      const response = await searchAutocomplete(searchQuery, {
        signal: abortControllerRef.current.signal
      });
      
      if (response.success) {
        const products = response.data.products.slice(0, maxResults);
        
        // Client-side cache'e kaydet (5 dakika TTL)
        cacheRef.current.set(cacheKey, {
          products,
          timestamp: Date.now()
        });
        
        // Cache temizleme (5 dakikadan eski olanları sil)
        const fiveMinutes = 5 * 60 * 1000;
        for (const [key, value] of cacheRef.current.entries()) {
          if (Date.now() - value.timestamp > fiveMinutes) {
            cacheRef.current.delete(key);
          }
        }
        
        setResults(products);
        setIsCached(response.data.cached || false);
        setIsOpen(products.length > 0);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('🚫 Request cancelled');
        return;
      }
      console.error('Arama hatası:', error);
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  }, [minChars, maxResults]);

  /**
   * Debounced query değiştiğinde arama yap
   */
  useEffect(() => {
    if (debouncedQuery) {
      fetchResults(debouncedQuery);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, fetchResults]);

  /**
   * Dışarı tıklandığında dropdown'u kapat
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Input değişikliği - useCallback ile optimize edildi
   */
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
  }, []);

  /**
   * Input temizle - useCallback ile optimize edildi
   */
  const handleClear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  /**
   * Ürün seçimi - useCallback ile optimize edildi
   */
  const handleSelectProduct = useCallback((product) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/product/${product.slug}`);
    
    if (onSearch) {
      onSearch(product);
    }
  }, [navigate, onSearch]);

  /**
   * Enter tuşu ile arama - useCallback ile optimize edildi
   */
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'Enter' && query.trim()) {
        // Sonuç sayfasına git
        navigate(`/products?q=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectProduct(results[selectedIndex]);
        } else if (query.trim()) {
          navigate(`/products?q=${encodeURIComponent(query)}`);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  }, [isOpen, query, results, selectedIndex, handleSelectProduct, navigate]);

  /**
   * Fiyat formatlama - useMemo ile memoize edildi
   */
  const formatPrice = useMemo(() => {
    const formatter = new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return (price) => formatter.format(price);
  }, []);

  /**
   * Image URL helper - useMemo ile memoize edildi
   */
  const getImageUrl = useCallback((product) => {
    const image = product.image || product.main_image;
    if (!image) return null;
    return image.startsWith('http') ? image : `http://localhost:8000${image}`;
  }, []);

  return (
    <div style={styles.container}>
      {/* Input */}
      <div style={styles.inputWrapper}>
        {showIcon && (
          <FaSearch style={styles.searchIcon} />
        )}
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{
            ...styles.input,
            paddingLeft: showIcon ? '52px' : '24px',
            paddingRight: query || isLoading ? '52px' : '24px'
          }}
        />

        {/* Clear/Loading Button */}
        {(query || isLoading) && (
          <button
            onClick={handleClear}
            style={styles.clearButton}
            aria-label="Temizle"
          >
            {isLoading ? (
              <div style={styles.spinner} />
            ) : (
              <FaTimes />
            )}
          </button>
        )}

        {/* Cache Badge */}
        {isCached && isOpen && (
          <div style={styles.cacheBadge} title="Anında sonuç - Cache">
            ⚡
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {/* Başlık */}
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>
              <FaShoppingBag style={{ marginRight: '8px' }} />
              {results.length} ürün bulundu
            </span>
            {isCached && (
              <span style={styles.cacheLabel}>
                ⚡ Anında
              </span>
            )}
          </div>

          {/* Ürün listesi */}
          <div style={styles.resultsList}>
            {results.map((product, index) => {
              const imageUrl = getImageUrl(product);
              const isSelected = selectedIndex === index;
              
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    ...styles.resultItem,
                    ...(isSelected ? styles.resultItemHover : {})
                  }}
                >
                  {/* Ürün Resmi - Lazy loading ile optimize edildi */}
                  <div style={styles.productImage}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        style={styles.image}
                        loading="lazy" // ⚡ Lazy loading
                        decoding="async" // ⚡ Async decoding
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div style={styles.imagePlaceholder}>
                        <FaShoppingBag />
                      </div>
                    )}
                  </div>

                  {/* Ürün Bilgileri */}
                  <div style={styles.productInfo}>
                    <div style={styles.productName}>
                      {product.name}
                    </div>
                    
                    {/* Kategori & Satıcı */}
                    <div style={styles.productMeta}>
                      {product.category && (
                        <span style={styles.metaItem}>
                          <FaTag style={{ fontSize: '10px' }} />
                          {product.category.name}
                        </span>
                      )}
                      {product.vendor && (
                        <span style={styles.metaItem}>
                          <FaStore style={{ fontSize: '10px' }} />
                          {product.vendor.name}
                        </span>
                      )}
                    </div>

                    {/* Fiyat */}
                    <div style={styles.priceContainer}>
                      <span style={styles.price}>
                        {formatPrice(product.price || product.min_price)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer - Tümünü Göster */}
          <div
            style={styles.dropdownFooter}
            onClick={() => {
              navigate(`/products?q=${encodeURIComponent(query)}`);
              setIsOpen(false);
            }}
          >
            <span>Tüm sonuçları göster</span>
            <span style={styles.footerArrow}>→</span>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && !isLoading && query.length >= minChars && results.length === 0 && (
        <div ref={dropdownRef} style={styles.dropdown}>
          <div style={styles.noResults}>
            <FaSearch style={{ fontSize: '32px', opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ margin: '0', color: '#64748b' }}>
              "{query}" için sonuç bulunamadı
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * Styles
 */
const styles = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '20px',
    fontSize: '18px',
    color: '#94a3b8',
    pointerEvents: 'none',
    zIndex: 1,
  },
  input: {
    width: '100%',
    padding: '12px 24px 12px 52px',
    borderRadius: '24px',
    border: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.3s',
    fontFamily: 'inherit',
  },
  clearButton: {
    position: 'absolute',
    right: '16px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#94a3b8',
    fontSize: '14px',
    transition: 'color 0.2s',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #e2e8f0',
    borderTop: '2px solid #059669',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  cacheBadge: {
    position: 'absolute',
    right: '52px',
    fontSize: '16px',
    cursor: 'default',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
    zIndex: 1000,
    maxHeight: '480px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownHeader: {
    padding: '12px 16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  dropdownTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
  },
  cacheLabel: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '6px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    fontWeight: '600',
  },
  resultsList: {
    overflowY: 'auto',
    maxHeight: '360px',
  },
  resultItem: {
    display: 'flex',
    gap: '12px',
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f1f5f9',
    transition: 'all 0.2s',
  },
  resultItemHover: {
    backgroundColor: '#f8fafc',
  },
  productImage: {
    width: '60px',
    height: '60px',
    flexShrink: 0,
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imagePlaceholder: {
    color: '#cbd5e1',
    fontSize: '24px',
  },
  productInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  },
  productName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  productMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: '#64748b',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: 'auto',
  },
  price: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#059669',
  },
  stockBadge: {
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    fontWeight: '500',
  },
  outOfStockBadge: {
    fontSize: '11px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    fontWeight: '500',
  },
  dropdownFooter: {
    padding: '12px 16px',
    borderTop: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
    fontWeight: '500',
    color: '#059669',
    transition: 'all 0.2s',
  },
  footerArrow: {
    fontSize: '16px',
  },
  noResults: {
    padding: '32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

// Display name for debugging
SearchAutocomplete.displayName = 'SearchAutocomplete';

export default SearchAutocomplete;
