// src/hooks/useCartInitializer.js
import { useEffect } from 'react';
import useCartStore from '../stores/useCartStore';

/**
 * Sepet store'unu başlangıçta yükleyen hook
 * Kullanıcı giriş yaptığında otomatik olarak sepeti yükler
 */
export const useCartInitializer = () => {
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    // Sayfa yüklendiğinde sepeti getir
    fetchCart();
  }, [fetchCart]);
};

export default useCartInitializer;
