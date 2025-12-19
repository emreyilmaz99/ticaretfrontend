import React, { useState, useEffect } from 'react';
import apiClient from '@lib/apiClient';

/**
 * Authenticated image component - fetches images with auth token
 */
const SecureImage = ({ src, alt, style, onError, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) return;

    // Eğer storage URL'i ise, API üzerinden çek
    if (src.includes('/storage/')) {
      const fetchImage = async () => {
        try {
          const response = await apiClient.get(src, {
            responseType: 'blob',
          });
          const imageObjectURL = URL.createObjectURL(response.data);
          setImageSrc(imageObjectURL);
        } catch (err) {
          console.error('Image fetch error:', err);
          setError(true);
          onError?.(err);
        }
      };
      fetchImage();
    } else {
      // Normal URL ise direkt kullan
      setImageSrc(src);
    }

    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (error || !src) {
    return <div style={{ ...style, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#cbd5e1' }}>No Image</span>
    </div>;
  }

  if (!imageSrc) {
    return <div style={{ ...style, backgroundColor: '#f1f5f9' }} />;
  }

  return <img src={imageSrc} alt={alt} style={style} {...props} />;
};

export default SecureImage;
