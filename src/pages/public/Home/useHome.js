// src/pages/public/Home/useHome.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import { useAuth } from '../../../context/AuthContext';
import useCartStore from '../../../stores/useCartStore';
import { getProducts, getCategories } from '../../../api/publicApi';
import apiClient from '@lib/apiClient';

/**
 * Custom hook for Home page state and logic
 */
export const useHome = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const { showToast } = useToast();
  const { user } = useAuth();
  const addToCart = useCartStore((state) => state.addToCart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const navigate = useNavigate();
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // UI States
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [minRating, setMinRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('featured');

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync category with URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // ============================================================================
  // PERFORMANCE OPTIMIZATION: Paralel API Calls using useQueries
  // Categories ve Products aynı anda fetch ediliyor (waterfall önlendi)
  // ============================================================================
  const [categoriesQuery, productsQuery] = useQueries({
    queries: [
      {
        queryKey: ['categories'], // Unified key - Navbar ile paylaşılıyor
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000, // 5 dakika cache
      },
      {
        queryKey: ['public-products', selectedCategory, priceRange, sortOrder],
        queryFn: () => getProducts({
          category_id: selectedCategory !== 'all' ? selectedCategory : undefined,
          min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
          max_price: priceRange[1] < 100000 ? priceRange[1] : undefined,
          sort_by: sortOrder === 'price-asc' ? 'price_asc' : sortOrder === 'price-desc' ? 'price_desc' : 'featured',
          per_page: 8,
        }),
        staleTime: 5 * 60 * 1000, // Artırıldı: 1 dakika -> 5 dakika
      },
    ],
  });

  // Extract data from queries
  const categoriesData = categoriesQuery.data;
  const productsData = productsQuery.data;
  const productsLoading = productsQuery.isLoading;
  const productsError = productsQuery.error;

  // ============================================================================
  // PERFORMANCE OPTIMIZATION: Memoized Categories Transformation
  // Categories array sadece categoriesData değiştiğinde yeniden oluşturulur
  // ============================================================================
  const categories = useMemo(() => {
    const dataArray = Array.isArray(categoriesData?.data) ? categoriesData.data : [];
    return [
      { id: 'all', name: 'Tüm Ürünler' },
      ...dataArray.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        image: cat.image,
      })),
    ];
  }, [categoriesData]);

  // Get products from API response
  const products = productsData?.data || [];

  // ============================================================================
  // PERFORMANCE OPTIMIZATION: Memoized Product Filtering
  // filteredProducts sadece products veya minRating değiştiğinde hesaplanır
  // ============================================================================
  const filteredProducts = useMemo(() => 
    products.filter(product => (product.rating || 0) >= minRating),
    [products, minRating]
  );

  // Add to cart handler - Zustand ile
  const addToCartAction = useCallback(async (product) => {
    const result = await addToCart(product, product.quantity || 1, null, toast, navigate);
    
    if (result?.success) {
      if (quickViewProduct) setQuickViewProduct(null);
    }
  }, [addToCart, toast, navigate, quickViewProduct]);

  // Toggle favorite handler - productId veya event alabilir
  const toggleFavorite = useCallback((productIdOrEvent, productId) => {
    // Eğer ilk parametre event ise
    if (productIdOrEvent?.stopPropagation) {
      productIdOrEvent.stopPropagation();
      productIdOrEvent.preventDefault();
    } else {
      // İlk parametre productId
      productId = productIdOrEvent;
    }
    
    if (!user) {
      showToast('Favorilere eklemek için lütfen giriş yapın.', 'warning');
      navigate('/login');
      return;
    }
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  }, [user, favorites, showToast, navigate]);

  // Category change handler
  const handleCategoryChange = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
  }, []);

  // Compare handler
  const toggleCompare = useCallback((product) => {
    if (compareList.find(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
      showToast('Ürün karşılaştırma listesinden çıkarıldı.', 'info');
    } else {
      if (compareList.length >= 3) {
        showToast('En fazla 3 ürün karşılaştırabilirsiniz.', 'warning');
        return;
      }
      const newCompareList = [...compareList, product];
      setCompareList(newCompareList);
      showToast('Ürün karşılaştırma listesine eklendi.', 'success');
      
      // 2 veya daha fazla ürün varsa otomatik modal aç
      if (newCompareList.length >= 2) {
        setTimeout(() => {
          setIsCompareModalOpen(true);
        }, 500);
      }
    }
  }, [compareList, showToast]);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setPriceRange([0, 100000]);
    setMinRating(0);
  }, []);

  return {
    // State
    isMobile,
    showCookieBanner,
    favorites,
    quickViewProduct,
    compareList,
    isCompareModalOpen,
    selectedCategory,
    priceRange,
    minRating,
    sortOrder,
    
    // Data
    categories,
    filteredProducts,
    productsLoading,
    productsError,
    
    // Setters
    setShowCookieBanner,
    setQuickViewProduct,
    setIsCompareModalOpen,
    setPriceRange,
    setMinRating,
    setSortOrder,
    
    // Handlers
    addToCart: addToCartAction,
    toggleFavorite,
    toggleCompare,
    handleCategoryChange,
    clearFilters,
    navigate,
  };
};
