import apiClient from '../lib/apiClient';

/**
 * Autocomplete arama servisi (Hızlı arama)
 * Arama kutusunda kullanıcı yazarken öneriler göstermek için
 * 
 * @param {string} query - Arama terimi
 * @param {Object} options - Axios options (signal için AbortController)
 */
export const searchAutocomplete = async (query, options = {}) => {
  try {
    const response = await apiClient.get('/v1/search', {
      params: { q: query },
      ...options
    });
    return response.data;
  } catch (error) {
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      throw { name: 'AbortError', message: 'Request aborted' };
    }
    console.error('Autocomplete arama hatası:', error);
    throw error;
  }
};

/**
 * Gelişmiş ürün arama servisi (Filtreleme ve sıralama ile)
 * Arama sonuç sayfasında kullanılmak için
 */
export const searchProductsAdvanced = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.q) params.append('q', filters.q);
    if (filters.categoryId) params.append('category_id', filters.categoryId);
    if (filters.vendorId) params.append('vendor_id', filters.vendorId);
    if (filters.minPrice) params.append('min_price', filters.minPrice);
    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
    if (filters.inStock) params.append('in_stock', '1');
    if (filters.isFeatured) params.append('is_featured', '1');
    if (filters.sortBy) params.append('sort_by', filters.sortBy);
    if (filters.sortDirection) params.append('sort_direction', filters.sortDirection);
    if (filters.page) params.append('page', filters.page);
    if (filters.perPage) params.append('per_page', filters.perPage);
    if (filters.highlight) params.append('highlight', '1');
    
    const response = await apiClient.get('/v1/products/search', {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Gelişmiş arama hatası:', error);
    throw error;
  }
};

export default {
  searchAutocomplete,
  searchProductsAdvanced
};
