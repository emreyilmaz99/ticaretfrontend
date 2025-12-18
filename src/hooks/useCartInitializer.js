// src/hooks/useCartInitializer.js
import { useEffect, useRef } from 'react';
import useCartStore from '../stores/useCartStore';

/**
 * Sepet store'unu başlangıçta yükleyen hook
 * PERFORMANCE OPTIMIZATION: Sadece ilk mount'ta fetch eder
 */
export const useCartInitializer = () => {
  const fetchCart = useCartStore((state) => state.fetchCart);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Sadece ilk mount'ta çalışır, route değişimlerinde tekrar çağrılmaz
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchCart();
    }
  }, []); // FIXED: fetchCart dependency kaldırıldı
};

export default useCartInitializer;
