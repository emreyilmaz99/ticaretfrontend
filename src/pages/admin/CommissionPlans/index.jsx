// src/pages/admin/CommissionPlans/index.jsx
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

// Alt Bileşenler
import PlanTable from './PlanTable';
import PlanFormModal from './PlanFormModal';
import Toast from './Toast';
import ConfirmModal from '../../../components/modals/ConfirmModal';

// Custom Hook
import useCommissionPlans from './useCommissionPlans';

// Stiller
import { getStyles } from './styles';

/**
 * Komisyon Planları Ana Sayfası
 */
const CommissionPlans = () => {
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, planId: null, planName: '', title: '', message: '' });
  
  const {
    // Data
    plans,
    isLoading,
    error,
    
    // Modal
    isModalOpen,
    editingPlan,
    openCreateModal,
    openEditModal,
    closeModal,
    
    // Form
    formData,
    handleFormChange,
    handleSubmit,
    
    // Actions
    handleDelete,
    handleToggleActive,
    handleSetDefault,
    
    // Toast
    toast,
    clearToast
  } = useCommissionPlans();

  const styles = getStyles();

  // Confirm Modal Handlers
  const openConfirmModal = (action, planId, planName, title, message) => {
    setConfirmModal({ isOpen: true, action, planId, planName, title, message });
  };

  const closeConfirmModal = () => {
    setConfirmModal({ isOpen: false, action: null, planId: null, planName: '', title: '', message: '' });
  };

  const handleConfirmAction = () => {
    const { action, planId } = confirmModal;
    if (action === 'delete') {
      handleDelete(planId);
    } else if (action === 'toggleActive') {
      handleToggleActive(planId);
    } else if (action === 'setDefault') {
      handleSetDefault(planId);
    }
    closeConfirmModal();
  };

  // Wrapped handlers
  const handleDeleteWithConfirm = (plan) => {
    openConfirmModal('delete', plan.id, plan.name, 'Planı Sil', `"${plan.name}" adlı komisyon planını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`);
  };

  const handleToggleActiveWithConfirm = (plan) => {
    const action = plan.is_active ? 'pasife al' : 'aktife al';
    openConfirmModal('toggleActive', plan.id, plan.name, `Planı ${action.charAt(0).toUpperCase() + action.slice(1)}`, `"${plan.name}" adlı planı ${action}mak istediğinize emin misiniz?`);
  };

  const handleSetDefaultWithConfirm = (plan) => {
    openConfirmModal('setDefault', plan.id, plan.name, 'Varsayılan Plan Yap', `"${plan.name}" adlı planı varsayılan plan olarak ayarlamak istediğinize emin misiniz?`);
  };

  // Loading State
  if (isLoading) {
    return <div style={styles.loadingState}>Yükleniyor...</div>;
  }

  // Error State
  if (error) {
    return <div style={styles.errorState}>Hata: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Komisyon Planları</h1>
          <p style={styles.subtitle}>Satıcılar için komisyon oranlarını yönetin.</p>
        </div>
        <button style={styles.createBtn} onClick={openCreateModal}>
          <FaPlus /> Yeni Plan Ekle
        </button>
      </div>

      {/* Table */}
      <PlanTable
        plans={plans}
        onEdit={openEditModal}
        onDelete={handleDeleteWithConfirm}
        onToggleActive={handleToggleActiveWithConfirm}
        onSetDefault={handleSetDefaultWithConfirm}
        styles={styles}
      />

      {/* Modal */}
      <PlanFormModal
        isOpen={isModalOpen}
        isEditing={!!editingPlan}
        formData={formData}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
        styles={styles}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Evet, Onayla"
        cancelText="İptal"
        type={confirmModal.action === 'delete' ? 'danger' : 'warning'}
        onConfirm={handleConfirmAction}
        onClose={closeConfirmModal}
      />

      {/* Toast */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={clearToast} 
        />
      )}
    </div>
  );
};

export default CommissionPlans;
