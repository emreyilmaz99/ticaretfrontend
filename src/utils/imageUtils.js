// src/utils/imageUtils.js

/**
 * Get backend base URL without /api suffix
 * For image URLs we need: http://127.0.0.1:8000
 * Not: http://127.0.0.1:8000/api
 */
export const getBackendBaseURL = () => {
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
  // Remove /api suffix if exists
  return apiBaseURL.replace(/\/api\/?$/, '');
};

/**
 * Convert backend image path to full URL
 * @param {string} path - Image path from backend (e.g., "/storage/products/xxx.jpg" or "storage/products/xxx.jpg")
 * @returns {string} Full image URL
 */
export const getImageURL = (path) => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const baseURL = getBackendBaseURL();
  
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseURL}${normalizedPath}`;
};

/**
 * Get product image URL from various possible paths
 * @param {Object} product - Product object with various image properties
 * @returns {string|null} Full image URL or null
 */
export const getProductImageURL = (product) => {
  if (!product) return null;
  
  let imagePath = null;
  
  // Try different possible image paths in priority order
  if (product.image) {
    imagePath = product.image;
  } else if (product.thumbnail) {
    imagePath = product.thumbnail;
  } else if (product.image_url) {
    imagePath = product.image_url;
  } else if (product.main_image) {
    imagePath = product.main_image;
  } else if (product.photos?.[0]?.url) {
    imagePath = product.photos[0].url;
  } else if (product.photos?.[0]?.file_path) {
    imagePath = product.photos[0].file_path;
  } else if (product.images?.[0]) {
    // Handle if images is array of strings or objects
    const firstImage = product.images[0];
    imagePath = typeof firstImage === 'string' 
      ? firstImage 
      : (firstImage.url || firstImage.path || firstImage.image_path);
  } else if (product.image_gallery?.[0]) {
    const firstGalleryImage = product.image_gallery[0];
    imagePath = typeof firstGalleryImage === 'string'
      ? firstGalleryImage
      : (firstGalleryImage.url || firstGalleryImage.path || firstGalleryImage.image_path);
  }
  
  return getImageURL(imagePath);
};
