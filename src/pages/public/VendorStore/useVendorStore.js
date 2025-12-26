// src/pages/public/VendorStore/useVendorStore.js
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import useCartStore from '../../../stores/useCartStore';
import apiClient from '@lib/apiClient';
import { getMainCategories } from '../../../api/publicApi';

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for VendorStore page
 */
export const useVendorStore = () => {
  const { slug } = useParams();
  
  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Tab state - varsayılan olarak ana sayfa
  const [activeTab, setActiveTab] = useState('home');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Debounced values for API calls
  const debouncedPriceRange = useDebounce(priceRange, 500);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Reviews filter states
  const [reviewsSortBy, setReviewsSortBy] = useState('newest');
  const [selectedRating, setSelectedRating] = useState(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const toast = useToast();
  const loadMoreRef = useRef();

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch vendor profile
  const { data: vendorData, isLoading, error } = useQuery({
    queryKey: ['vendor', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/vendors/${slug}`);
      console.log('🏪 Vendor Data:', response.data.data);
      return response.data.data;
    },
    enabled: !!slug,
  });

  const vendor = vendorData?.vendor;
  const stats = vendorData?.stats;

  // Fetch vendor categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['vendorCategories', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/vendors/${slug}/categories`);
      return response.data.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const categories = categoriesData || [];

  // Fetch main categories from API (global categories like in CategoryProducts page)
  const { data: mainCategoriesData, isLoading: mainCategoriesLoading } = useQuery({
    queryKey: ['mainCategories'],
    queryFn: getMainCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const availableCategories = mainCategoriesData?.data?.categories || [];

  // Fetch vendor products with infinite scroll
  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: productsLoading,
  } = useInfiniteQuery({
    queryKey: ['vendorProducts', slug, activeTab, selectedCategory, sortBy, debouncedPriceRange, debouncedSearchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam,
        per_page: 20,
        sort_by: sortBy,
      });
      
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (debouncedPriceRange.min) params.append('min_price', debouncedPriceRange.min);
      if (debouncedPriceRange.max) params.append('max_price', debouncedPriceRange.max);
      
      // For deals tab, only show discounted products
      if (activeTab === 'deals') params.append('has_discount', '1');
      
      const response = await apiClient.get(`/v1/vendors/${slug}/products?${params}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.data?.meta || {};
      return current_page < last_page ? current_page + 1 : undefined;
    },
    enabled: !!slug && (activeTab === 'home' || activeTab === 'products' || activeTab === 'deals'),
  });

  // Get products and filter deals if needed
  let products = productsData?.pages.flatMap(page => page.data?.data || []) || [];
  
  // Frontend filter for deals tab (backend may not filter correctly)
  if (activeTab === 'deals') {
    products = products.filter(product => 
      product.original_price && parseFloat(product.original_price) > parseFloat(product.price)
    );
  }

  // Fetch vendor reviews
  const { data: reviewsData, isLoading: reviewsLoading } = useQuery({
    queryKey: ['vendorReviews', slug, reviewsSortBy, selectedRating],
    queryFn: async () => {
      const params = new URLSearchParams({
        sort_by: reviewsSortBy,
        per_page: 20,
      });
      if (selectedRating) params.append('rating', selectedRating);
      
      const response = await apiClient.get(`/v1/vendors/${slug}/reviews?${params}`);
      return response.data;
    },
    enabled: !!slug && activeTab === 'reviews',
  });

  const reviews = reviewsData?.data?.data || [];
  
  // Calculate summary from reviews if backend doesn't provide it
  const calculateSummary = (reviewsList) => {
    if (!reviewsList || reviewsList.length === 0) {
      return {
        average_rating: 0,
        total_reviews: 0,
        rating_distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let totalRating = 0;

    reviewsList.forEach(review => {
      const rating = review.rating || 0;
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
        totalRating += rating;
      }
    });

    return {
      average_rating: reviewsList.length > 0 ? totalRating / reviewsList.length : 0,
      total_reviews: reviewsList.length,
      rating_distribution: distribution
    };
  };

  const backendSummary = reviewsData?.data?.summary;
  const calculatedSummary = calculateSummary(reviews);
  
  // Use backend summary if it has data, otherwise use calculated
  const reviewSummary = (backendSummary && backendSummary.total_reviews > 0) 
    ? backendSummary 
    : calculatedSummary;

  // Map rating_distribution to distribution for component compatibility
  const formattedReviewSummary = {
    ...reviewSummary,
    distribution: reviewSummary.rating_distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handlers
  const handleAddToCart = useCallback(async (product) => {
    await addToCart(product, 1, null, toast);
  }, [addToCart, toast]);

  return {
    // Vendor data
    vendor,
    stats,
    isLoading,
    error: error?.message || null,
    
    // Tab state
    activeTab,
    setActiveTab,
    
    // Products
    products,
    productsLoading: productsLoading || isFetchingNextPage,
    hasMoreProducts: hasNextPage,
    loadMoreRef,
    
    // Filters
    categories,
    categoriesLoading,
    availableCategories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    
    // Reviews
    reviews,
    reviewsLoading,
    reviewSummary: formattedReviewSummary,
    reviewsSortBy,
    setReviewsSortBy,
    selectedRating,
    setSelectedRating,
    
    // Actions
    handleAddToCart,
    
    // Responsive
    isMobile,
    showMobileFilters,
    setShowMobileFilters,
  };
};
