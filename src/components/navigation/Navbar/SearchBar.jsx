// src/components/Navbar/SearchBar.jsx
import React from 'react';
import PropTypes from 'prop-types';
import SearchAutocomplete from '../../common/SearchAutocomplete';

/**
 * Arama çubuğu bileşeni - Elasticsearch Autocomplete ile
 * 
 * Artık SearchAutocomplete component'ini kullanıyoruz:
 * - Elasticsearch ile hızlı arama
 * - Redis cache desteği
 * - Debounce ile optimize edilmiş
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Cache durumu gösterimi (⚡ badge)
 * 
 * @param {string} searchTerm - Eski API uyumluluğu için (kullanılmıyor)
 * @param {function} setSearchTerm - Eski API uyumluluğu için (kullanılmıyor)
 * @param {function} handleSearch - Enter tuşu callback (kullanılmıyor, SearchAutocomplete kendi yönetiyor)
 * @param {object} styles - Navbar'dan gelen dinamik stil objesi (kullanılmıyor, SearchAutocomplete kendi stilleri var)
 */
const SearchBar = ({ searchTerm, setSearchTerm, handleSearch, styles }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <SearchAutocomplete
        placeholder="Ürün, kategori veya marka ara..."
        showIcon={true}
        autoFocus={false}
        minChars={2}
        debounceDelay={300}
        maxResults={8}
        onSearch={(product) => {
          // Opsiyonel: Arama sonrası analytics tracking
          console.log('Ürün seçildi:', product);
        }}
      />
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string,
  setSearchTerm: PropTypes.func,
  handleSearch: PropTypes.func,
  styles: PropTypes.object,
};

SearchBar.defaultProps = {
  searchTerm: '',
  setSearchTerm: () => {},
  handleSearch: () => {},
  styles: {},
};

export default SearchBar;