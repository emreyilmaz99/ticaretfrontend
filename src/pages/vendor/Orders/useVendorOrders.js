import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import { useDebounce } from '../../../hooks/useDebounce';
import apiClient from '@lib/apiClient';

export const useVendorOrders = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState(''); // Fixed: Re-add setMaxAmount
  
  // PERFORMANCE: Debounce search to prevent API call on every keystroke
  const debouncedSearch = useDebounce(searchTerm, 500); // 500ms delay

  // Build query params
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append('search', debouncedSearch); // Use debounced value
    if (statusFilter !== 'all') params.append('status', statusFilter);
    if (minAmount) params.append('min_amount', minAmount);
    if (maxAmount) params.append('max_amount', maxAmount);
    return params.toString();
  };

  // Fetch orders
  const { 
    data: ordersData = { orders: [], total: 0 }, 
    isLoading: isLoadingOrders,
    error: ordersError,
    refetch: refetchOrders
  } = useQuery({
    queryKey: ['vendorOrders', debouncedSearch, statusFilter, minAmount, maxAmount], // Use debounced value
    queryFn: async () => {
      const queryString = buildQueryParams();
      const response = await apiClient.get(
        `/v1/orders${queryString ? '?' + queryString : ''}`
      );
      return response.data.data;
    }
  });

  // Fetch stats
  const { 
    data: statsData = { stats: [] },
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['vendorOrderStats'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/orders/stats');
      return response.data.data;
    }
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await apiClient.put(
        `/v1/orders/${orderId}/status`,
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      queryClient.invalidateQueries({ queryKey: ['vendorOrderStats'] });
      showSuccess('Sipariş durumu güncellendi');
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Durum güncellenemedi');
    }
  });

  // Cancel order mutation
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await apiClient.post(
        `/v1/orders/${orderId}/cancel`,
        {}
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendorOrders'] });
      queryClient.invalidateQueries({ queryKey: ['vendorOrderStats'] });
      showSuccess('Sipariş iptal edildi');
    },
    onError: (error) => {
      showError(error.response?.data?.message || 'Sipariş iptal edilemedi');
    }
  });

  // Helper functions
  const updateOrderStatus = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const cancelOrder = (orderId) => {
    if (window.confirm('Bu siparişi iptal etmek istediğinize emin misiniz?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  return {
    // Data
    orders: ordersData.orders || [],
    stats: statsData.stats || [],
    
    // Loading states
    isLoadingOrders,
    isLoadingStats,
    
    // Filters
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    
    // Actions
    updateOrderStatus,
    cancelOrder,
    refetchOrders,
    
    // Error
    error: ordersError
  };
};
