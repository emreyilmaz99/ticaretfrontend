// src/pages/user/Favorites/useFavoritesPage.js
import { useState, useEffect } from 'react';
import { useFavorites } from '../../../context/FavoritesContext';
import useCartStore from '../../../stores/useCartStore';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../components/common/Toast';

export const useFavoritesPage = () => {
  const { favorites, removeFromFavorites, clearFavorites, loading, count, fetchFavorites } = useFavorites();
  const addToCart = useCartStore((state) => state.addToCart);
  const { user } = useAuth();
  const toast = useToast();
  const [sortBy, setSortBy] = useState('date'); // date, price-asc, price-desc
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Sayfa açıldığında favorileri yenile
  useEffect(() => {
    fetchFavorites(true);
  }, []);

  // Helper: API formatı veya localStorage formatı
  const getProduct = (item) => {
    // API formatı: { id, product: {...} }
    // localStorage formatı: { id, title, price, image, ... }
    if (item.product) {
      return {
        id: item.product.id,
        title: item.product.name,
        slug: item.product.slug,
        image: item.product.image,
        price: item.product.price,
        oldPrice: item.product.compare_price,
        inStock: item.product.in_stock,
        stock: item.product.stock,
        vendor: item.product.vendor,
        dateAdded: item.added_at,
        discount_percent: item.product.discount_percent
      };
    }
    // localStorage formatı
    return {
      id: item.id,
      title: item.title || item.name,
      slug: item.slug,
      image: item.image,
      price: item.price,
      oldPrice: item.oldPrice || item.compare_price,
      inStock: item.inStock !== undefined ? item.inStock : true,
      stock: item.stock,
      dateAdded: item.dateAdded,
      discount_percent: item.discount_percent
    };
  };

  // Sort logic
  const sortedFavorites = [...favorites].sort((a, b) => {
    const productA = getProduct(a);
    const productB = getProduct(b);
    
    if (sortBy === 'price-asc') return (productA.price || 0) - (productB.price || 0);
    if (sortBy === 'price-desc') return (productB.price || 0) - (productA.price || 0);
    // Default: date added
    return new Date(productB.dateAdded || 0) - new Date(productA.dateAdded || 0);
  });

  const handleAddToCart = async (product) => {
    await addToCart({ id: product.id, name: product.title }, 1, null, toast);
  };

  const handleMoveAllToCart = async () => {
    if (favorites.length === 0) return;
    let addedCount = 0;
    for (const item of favorites) {
      const product = getProduct(item);
      if (product.inStock) {
        const result = await addToCart({ id: product.id, name: product.title }, 1, null, null);
        if (result?.success) addedCount++;
      }
    }
    if (addedCount > 0) {
      toast.success('Başarılı', `${addedCount} ürün sepete eklendi.`);
    } else {
      toast.warning('Uyarı', 'Stokta ürün bulunamadı.');
    }
  };

  const handleRemove = async (productId) => {
    await removeFromFavorites(productId);
    toast.info('Bilgi', 'Ürün favorilerden kaldırıldı.');
  };

  const handleClearAll = async () => {
    if (window.confirm('Tüm favorileri silmek istediğinize emin misiniz?')) {
      await clearFavorites();
      toast.success('Başarılı', 'Favoriler temizlendi.');
    }
  };

  return {
    favorites: sortedFavorites,
    loading,
    count,
    sortBy,
    setSortBy,
    isMobile,
    getProduct,
    handleAddToCart,
    handleMoveAllToCart,
    handleRemove,
    handleClearAll
  };
};
