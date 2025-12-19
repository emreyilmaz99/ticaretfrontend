// src/features/vendor/components/VendorList/index.jsx
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getVendors } from '../../api/vendorApi';
import { useVendorFilters } from '../../hooks/useVendorFilters';
import { useVendorModal } from '../../hooks/useVendorModal';
import { useVendorMutations } from '../../hooks/useVendorMutations';
import VendorFilters from './VendorFilters';
import VendorTable from './VendorTable';
import VendorEditModal from './modals/VendorEditModal';
import VendorCategoryModal from '../../../admin/components/VendorCategoryModal';
import ConfirmModal from '../../../../components/modals/ConfirmModal';
import { VENDOR_STATUS, VENDOR_MODES } from '../../shared/constants';
import { styles } from '../../shared/styles';

const VendorList = React.memo(({ mode = VENDOR_MODES.ALL, isMobile = false }) => {
  const queryClient = useQueryClient();
  const isActiveMode = mode === VENDOR_MODES.ACTIVE_ONLY;
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, vendor: null, title: '', message: '' });
  const [activeFilters, setActiveFilters] = useState({ sortBy: 'all', minRevenue: '', maxRevenue: '' });

  // Custom hooks
  const {
    currentPage,
    itemsPerPage,
    searchTerm,
    activeTab,
    handlePageChange,
    handleSearchChange,
    handleTabChange,
  } = useVendorFilters();

  const {
    isEditModalOpen,
    isCategoryModalOpen,
    selectedVendor,
    openEditModal,
    closeEditModal,
    openCategoryModal,
    closeCategoryModal,
  } = useVendorModal();

  const { updateStatusMutation } = useVendorMutations();

  // React Query - fetch vendors
  const queryKey = isActiveMode ? ['active-vendors', currentPage] : ['vendors', currentPage];
  
  const { data: responseData, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params = {
        page: currentPage,
        per_page: itemsPerPage,
      };
      
      if (isActiveMode) {
        params.status = VENDOR_STATUS.ACTIVE;
      } else if (activeTab !== 'all') {
        params.status = activeTab;
      }

      const response = await getVendors(params);
      return response.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const vendors = responseData?.data || [];
  const meta = responseData?.meta || {};

  // Confirm Modal Handlers
  const openConfirmModal = (action, vendor, title, message) => {
    setConfirmModal({ isOpen: true, action, vendor, title, message });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, action: null, vendor: null, title: '', message: '' });
  };

  const handleConfirmAction = () => {
    const { action, vendor } = confirmModal;
    if (action === 'approve') {
      updateStatusMutation.mutate({ id: vendor.id, status: VENDOR_STATUS.ACTIVE });
    } else if (action === 'reject') {
      updateStatusMutation.mutate({ id: vendor.id, status: VENDOR_STATUS.REJECTED });
    } else if (action === 'ban') {
      updateStatusMutation.mutate({ id: vendor.id, status: VENDOR_STATUS.BANNED });
    }
    closeConfirmModal();
  };

  // Handlers
  const handleApprove = useCallback(
    (vendor) => {
      openConfirmModal('approve', vendor, 'Satıcıyı Onayla', `"${vendor.storeName}" mağazasını onaylamak istediğinize emin misiniz?`);
    },
    []
  );

  const handleReject = useCallback(
    (vendor) => {
      openConfirmModal('reject', vendor, 'Başvuruyu Reddet', `"${vendor.storeName}" mağazasının başvurusunu reddetmek istediğinize emin misiniz?`);
    },
    []
  );

  const handleBan = useCallback(
    (vendor) => {
      openConfirmModal('ban', vendor, 'Satıcıyı Yasakla', `"${vendor.storeName}" mağazasını yasaklamak istediğinize emin misiniz? Bu işlem geri alınamaz.`);
    },
    []
  );

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <VendorFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        showTabs={!isActiveMode}
        title={isActiveMode ? 'Aktif Satıcılar' : undefined}
        activeFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
        isMobile={isMobile}
      />

      <VendorTable
        vendors={vendors}
        isLoading={isLoading}
        searchTerm={searchTerm}
        activeFilters={activeFilters}
        meta={meta}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onEdit={openEditModal}
        onApprove={handleApprove}
        onReject={handleReject}
        onBan={handleBan}
        onCategory={openCategoryModal}
        showCategoryButton={isActiveMode}
        isMobile={isMobile}
      />

      {isEditModalOpen && selectedVendor && (
        <VendorEditModal
          vendor={selectedVendor}
          isOpen={isEditModalOpen}
          onClose={closeEditModal}
        />
      )}

      {isActiveMode && isCategoryModalOpen && selectedVendor && (
        <VendorCategoryModal
          isOpen={isCategoryModalOpen}
          onClose={closeCategoryModal}
          vendor={selectedVendor}
        />
      )}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Evet, Onayla"
        cancelText="İptal"
        type={confirmModal.action === 'ban' || confirmModal.action === 'reject' ? 'danger' : 'success'}
        onConfirm={handleConfirmAction}
        onClose={closeConfirmModal}
      />
    </div>
  );
});

VendorList.displayName = 'VendorList';

VendorList.propTypes = {
  mode: PropTypes.oneOf([VENDOR_MODES.ALL, VENDOR_MODES.ACTIVE_ONLY]),
  isMobile: PropTypes.bool,
};

export default VendorList;
