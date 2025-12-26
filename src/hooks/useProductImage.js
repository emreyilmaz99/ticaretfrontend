// src/hooks/useProductImage.js
import { useMemo } from 'react';
import { getProductImageURL } from '../utils/imageUtils';

const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23fafafa" width="400" height="400"/%3E%3Ctext fill="%23cbd5e1" font-family="system-ui" font-size="18" font-weight="600" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EÜrün Görseli%3C/text%3E%3C/svg%3E';

/**
 * Custom hook for getting product image URL with fallback
 * @param {Object} product - Product object
 * @returns {string} - Image URL
 */
export const useProductImage = (product) => {
  return useMemo(() => {
    if (!product) return FALLBACK_IMAGE;

    // Use the utility function to get product image
    const imageUrl = getProductImageURL(product);
    
    return imageUrl || FALLBACK_IMAGE;
  }, [product]);
};
