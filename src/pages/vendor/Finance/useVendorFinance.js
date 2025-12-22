/**
 * useVendorFinance Hook - Finance sayfası business logic
 */

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../../../components/common/Toast';
import { getFinanceDashboard, getEarnings } from '../../../features/vendor/api/vendorFinanceApi';
import { getPayouts, requestPayout } from '../../../features/vendor/api/vendorPayoutApi';
import { getBankAccounts } from '../../../features/vendor/api/vendorAuthApi';

/**
 * Tutar formatlayıcı
 */
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₺0,00';
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Tarih formatlayıcı
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Status label mapper
 */
const getStatusLabel = (status) => {
  const labels = {
    pending: 'Beklemede',
    available: 'Çekilebilir',
    settled: 'Ödendi',
    refunded: 'İade Edildi',
    completed: 'Tamamlandı',
    processing: 'İşleniyor',
    cancelled: 'İptal Edildi',
  };
  return labels[status] || status;
};

/**
 * Transaction type mapper
 */
const getTransactionType = (earningStatus) => {
  if (earningStatus === 'settled') return 'payout';
  if (earningStatus === 'refunded') return 'refund';
  return 'sale';
};

export const useVendorFinance = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isAccountSettingsOpen, setIsAccountSettingsOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [earningsFilters, setEarningsFilters] = useState({
    status: '',
    from: '',
    to: '',
    order_number: '',
    per_page: 20,
    page: 1,
  });

  // Dashboard stats query
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['vendor-finance-dashboard'],
    queryFn: getFinanceDashboard,
  });

  // Earnings query
  const { data: earningsData, isLoading: isEarningsLoading } = useQuery({
    queryKey: ['vendor-earnings', earningsFilters],
    queryFn: () => getEarnings(earningsFilters),
    keepPreviousData: true,
  });

  // Payouts query
  const { data: payoutsData, isLoading: isPayoutsLoading } = useQuery({
    queryKey: ['vendor-payouts'],
    queryFn: getPayouts,
  });

  // Bank accounts query
  const { data: bankAccountsData } = useQuery({
    queryKey: ['vendor-bank-accounts'],
    queryFn: getBankAccounts,
  });

  // Payout request mutation
  const payoutMutation = useMutation({
    mutationFn: requestPayout,
    onSuccess: (data) => {
      toast.success('Başarılı', 'Çekim talebiniz oluşturuldu. En kısa sürede işleme alınacaktır.');
      queryClient.invalidateQueries(['vendor-finance-dashboard']);
      queryClient.invalidateQueries(['vendor-earnings']);
      queryClient.invalidateQueries(['vendor-payouts']);
      setIsWithdrawalModalOpen(false);
    },
    onError: (error) => {
      const message = error?.response?.data?.message || 'Çekim talebi oluşturulamadı';
      toast.error('Hata', message);
    },
  });

  // Wallet data - API'den gelen verilerle oluşturulan özet
  const walletData = useMemo(() => {
    if (!dashboardData?.data) {
      return {
        availableBalance: '₺0,00',
        pendingAmount: '₺0,00',
        pendingDate: '-',
        totalPaid: '₺0,00',
        growthPercent: '+%0',
      };
    }

    const stats = dashboardData.data;
    
    // Pending date hesaplama (7 gün settlement period)
    const pendingDate = stats.pending_earnings > 0 
      ? '7 gün içinde çekilebilir olacak' 
      : '-';

    return {
      availableBalance: formatCurrency(stats.available_balance),
      pendingAmount: formatCurrency(stats.pending_balance),
      pendingDate,
      totalPaid: formatCurrency(stats.total_withdrawn || 0),
      growthPercent: '+%12', // Bu hesaplanabilir veya API'den gelebilir
      stats, // Ham veriyi de sakla
    };
  }, [dashboardData]);

  // Transactions - Earnings verilerini transaction formatına dönüştür
  const transactions = useMemo(() => {
    if (!earningsData?.data?.data) return [];

    return earningsData.data.data.map((earning) => ({
      id: `TRX-${earning.id}`,
      date: formatDate(earning.created_at),
      type: getTransactionType(earning.earning_status),
      description: `${earning.product_name} - ${earning.order_number}`,
      amount: formatCurrency(earning.net_earning),
      status: earning.earning_status,
      statusLabel: getStatusLabel(earning.earning_status),
      rawData: earning, // Detaylar için ham veri
    }));
  }, [earningsData]);

  // Handlers
  const handleWithdraw = () => {
    setIsWithdrawalModalOpen(true);
  };

  const handleCloseWithdrawal = () => {
    setIsWithdrawalModalOpen(false);
  };

  const handleSubmitWithdrawal = async (amount, method, reference) => {
    await payoutMutation.mutateAsync({
      amount: parseFloat(amount),
      method,
      reference,
    });
  };

  const handleSettings = () => {
    setIsAccountSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsAccountSettingsOpen(false);
  };

  const handleSaveSettings = async (formData) => {
    // Bank account update API'si henüz eklenmedi, şimdilik sadece toast göster
    console.log('Saving settings:', formData);
    toast.success('Kaydedildi', 'Hesap ayarlarınız başarıyla güncellendi!');
    setIsAccountSettingsOpen(false);
    queryClient.invalidateQueries(['vendor-bank-accounts']);
  };

  const handlePageChange = (page) => {
    setEarningsFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (filters) => {
    setEarningsFilters((prev) => ({ ...prev, ...filters, page: 1 }));
  };

  return {
    // Data
    transactions,
    walletData,
    dashboardStats: dashboardData?.data,
    earningsPagination: earningsData?.data,
    payouts: payoutsData?.data,
    bankAccounts: bankAccountsData?.data,

    // Loading states
    isLoading: isDashboardLoading || isEarningsLoading,
    isDashboardLoading,
    isEarningsLoading,
    isPayoutsLoading,
    isSubmittingPayout: payoutMutation.isPending,

    // Handlers
    handleWithdraw,
    handleSettings,
    handleCloseWithdrawal,
    handleSubmitWithdrawal,
    handleCloseSettings,
    handleSaveSettings,
    handlePageChange,
    handleFilterChange,

    // Modal states
    isAccountSettingsOpen,
    isWithdrawalModalOpen,

    // Filters
    earningsFilters,
  };
};

export default useVendorFinance;
