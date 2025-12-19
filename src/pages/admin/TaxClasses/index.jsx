// src/pages/admin/TaxClasses/index.jsx
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaStar, FaRegStar } from 'react-icons/fa';
import { useTaxClasses } from './useTaxClasses';
import TaxClassModal from './TaxClassModal';
import ConfirmModal from '../../../components/modals/ConfirmModal';

const TaxClasses = () => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    taxClasses,
    isLoading,
    error,
    createTaxClass,
    updateTaxClass,
    deleteTaxClass
  } = useTaxClasses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaxClass, setEditingTaxClass] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, taxClassId: null, taxClassName: '' });

  const handleCreate = () => {
    setEditingTaxClass(null);
    setIsModalOpen(true);
  };

  const handleEdit = (taxClass) => {
    setEditingTaxClass(taxClass);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTaxClass(null);
  };

  const handleSubmit = (data) => {
    if (editingTaxClass) {
      updateTaxClass(editingTaxClass.id, data);
    } else {
      createTaxClass(data);
    }
    handleCloseModal();
  };

  const handleToggleActive = (taxClass) => {
    updateTaxClass(taxClass.id, { is_active: !taxClass.is_active });
  };

  const handleSetDefault = (taxClass) => {
    updateTaxClass(taxClass.id, { is_default: true });
  };

  const openDeleteConfirm = (taxClass) => {
    setConfirmModal({ isOpen: true, taxClassId: taxClass.id, taxClassName: taxClass.name });
  };

  const closeDeleteConfirm = () => {
    setConfirmModal({ isOpen: false, taxClassId: null, taxClassName: '' });
  };

  const handleDeleteConfirm = () => {
    deleteTaxClass(confirmModal.taxClassId);
    closeDeleteConfirm();
  };

  if (isLoading) {
    return (
      <div style={{ ...styles.container, padding: isMobile ? '16px' : '32px' }}>
        <div style={styles.loadingState}>Yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, padding: isMobile ? '16px' : '32px' }}>
        <div style={styles.errorState}>Hata: {error.message}</div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.container, padding: isMobile ? '16px' : '32px' }}>
      {/* Header */}
      <div style={{ 
        ...styles.header,
        padding: isMobile ? '20px 16px' : '28px 32px',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '16px' : '0'
      }}>
        <div style={{ width: isMobile ? '100%' : 'auto' }}>
          <h1 style={{ ...styles.title, fontSize: isMobile ? '20px' : '26px' }}>Vergi Sınıfları (KDV)</h1>
          <p style={{ ...styles.subtitle, fontSize: isMobile ? '13px' : '15px' }}>Ürünler için KDV oranlarını yönetin.</p>
        </div>
        <button style={{ ...styles.createBtn, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start', minHeight: isMobile ? '44px' : 'auto' }} onClick={handleCreate}>
          <FaPlus /> Yeni Vergi Sınıfı Ekle
        </button>
      </div>

      {/* Table / Mobile Cards */}
      {isMobile ? (
        // Mobile Card View
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {taxClasses.length > 0 ? (
            taxClasses.map((taxClass) => (
              <div
                key={taxClass.id}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Header with name and default badge */}
                <div style={{
                  paddingBottom: '12px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '16px' }}>
                    {taxClass.name}
                  </div>
                  {taxClass.is_default && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      whiteSpace: 'nowrap'
                    }}>
                      <FaStar size={10} /> Varsayılan
                    </span>
                  )}
                </div>

                {/* Rate */}
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                    KDV Oranı
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>
                    %{taxClass.rate}
                  </div>
                </div>

                {/* Description & Order */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                      Açıklama
                    </div>
                    <div style={{ color: '#475569', fontSize: '13px' }}>
                      {taxClass.description || '-'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                      Sıra
                    </div>
                    <div style={{ color: '#475569', fontSize: '13px', fontWeight: '600' }}>
                      {taxClass.sort_order || '-'}
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>
                    Durum
                  </div>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: taxClass.is_active ? '#d1fae5' : '#fee2e2',
                    color: taxClass.is_active ? '#065f46' : '#991b1b'
                  }}>
                    {taxClass.is_active ? <FaToggleOn /> : <FaToggleOff />}
                    {taxClass.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9'
                }}>
                  <button
                    onClick={() => handleToggleActive(taxClass)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: taxClass.is_active ? '1px solid #e2e8f0' : '1px solid #d1fae5',
                      backgroundColor: taxClass.is_active ? '#f8fafc' : '#ecfdf5',
                      color: taxClass.is_active ? '#64748b' : '#059669',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                      minHeight: '44px'
                    }}
                  >
                    {taxClass.is_active ? <FaToggleOff size={16} /> : <FaToggleOn size={16} />}
                    {taxClass.is_active ? 'Pasife Al' : 'Aktife Al'}
                  </button>

                  <button
                    onClick={() => !taxClass.is_default && handleSetDefault(taxClass)}
                    disabled={taxClass.is_default}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: taxClass.is_default ? '1px solid #e2e8f0' : '1px solid #fef3c7',
                      backgroundColor: taxClass.is_default ? '#f8fafc' : '#fefce8',
                      color: taxClass.is_default ? '#cbd5e1' : '#854d0e',
                      cursor: taxClass.is_default ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                      minHeight: '44px',
                      opacity: taxClass.is_default ? 0.6 : 1
                    }}
                  >
                    {taxClass.is_default ? <FaStar size={16} /> : <FaRegStar size={16} />}
                    {taxClass.is_default ? 'Varsayılan' : 'Varsayılan Yap'}
                  </button>

                  <button
                    onClick={() => handleEdit(taxClass)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #dbeafe',
                      backgroundColor: '#eff6ff',
                      color: '#1e40af',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                      minHeight: '44px'
                    }}
                  >
                    <FaEdit size={16} />
                    Düzenle
                  </button>

                  <button
                    onClick={() => openDeleteConfirm(taxClass)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      backgroundColor: '#fef2f2',
                      color: '#dc2626',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '13px',
                      minHeight: '44px'
                    }}
                  >
                    <FaTrash size={16} />
                    Sil
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              Henüz vergi sınıfı eklenmemiş.
            </div>
          )}
        </div>
      ) : (
        // Desktop Table View
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Sıra</th>
                <th style={styles.th}>Ad</th>
                <th style={styles.th}>Oran (%)</th>
                <th style={styles.th}>Açıklama</th>
                <th style={styles.th}>Varsayılan</th>
                <th style={styles.th}>Durum</th>
                <th style={styles.th}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {taxClasses.length > 0 ? (
                taxClasses.map((taxClass) => (
                  <tr key={taxClass.id} style={styles.tr}>
                    <td style={styles.td}>{taxClass.sort_order || '-'}</td>
                    <td style={styles.td}>
                      <span style={styles.taxName}>{taxClass.name}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.rate}>%{taxClass.rate}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.description}>
                        {taxClass.description || '-'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.defaultBtn(taxClass.is_default)}
                        onClick={() => !taxClass.is_default && handleSetDefault(taxClass)}
                        disabled={taxClass.is_default}
                      >
                        {taxClass.is_default ? <FaStar /> : <FaRegStar />}
                        {taxClass.is_default ? ' Varsayılan' : ' Varsayılan Yap'}
                      </button>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.toggleBtn(taxClass.is_active)}
                        onClick={() => handleToggleActive(taxClass)}
                      >
                        {taxClass.is_active ? <FaToggleOn /> : <FaToggleOff />}
                        {taxClass.is_active ? ' Aktif' : ' Pasif'}
                      </button>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleEdit(taxClass)}
                          title="Düzenle"
                        >
                          <FaEdit />
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => openDeleteConfirm(taxClass)}
                          title="Sil"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={styles.emptyState}>
                    Henüz vergi sınıfı eklenmemiş.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <TaxClassModal
        isOpen={isModalOpen}
        taxClass={editingTaxClass}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Vergi Sınıfını Sil"
        message={`"${confirmModal.taxClassName}" adlı vergi sınıfını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Evet, Sil"
        cancelText="İptal"
        type="danger"
        onConfirm={handleDeleteConfirm}
        onClose={closeDeleteConfirm}
      />
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '32px',
    backgroundColor: '#F3F4F6',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    background: 'linear-gradient(135deg, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 100%)',
    padding: '28px 32px',
    borderRadius: '16px',
    border: '1px solid rgb(226, 232, 240)'
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: 'rgb(15, 23, 42)',
    margin: 0,
    letterSpacing: '-0.02em'
  },
  subtitle: {
    fontSize: '15px',
    color: 'rgb(100, 116, 139)',
    margin: '6px 0 0 0',
  },
  createBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#059669',
    color: '#FFF',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
  },
  tableContainer: {
    backgroundColor: '#FFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '16px',
    textAlign: 'left',
    backgroundColor: '#F9FAFB',
    color: '#374151',
    fontSize: '13px',
    fontWeight: '600',
    borderBottom: '1px solid #E5E7EB'
  },
  tr: {
    borderBottom: '1px solid #E5E7EB',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#111827'
  },
  taxName: {
    fontWeight: '600',
    color: '#111827'
  },
  rate: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#10B981'
  },
  description: {
    fontSize: '13px',
    color: '#6B7280'
  },
  defaultBtn: (isDefault) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: isDefault ? '#FEF3C7' : '#F3F4F6',
    color: isDefault ? '#92400E' : '#6B7280',
    border: isDefault ? '1px solid #FCD34D' : '1px solid #E5E7EB',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: isDefault ? 'default' : 'pointer',
    transition: 'all 0.2s'
  }),
  toggleBtn: (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    backgroundColor: isActive ? '#D1FAE5' : '#FEE2E2',
    color: isActive ? '#065F46' : '#991B1B',
    border: isActive ? '1px solid #10B981' : '1px solid #EF4444',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  }),
  actionBtns: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '8px 12px',
    backgroundColor: '#DBEAFE',
    color: '#1E40AF',
    border: '1px solid #3B82F6',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  deleteBtn: {
    padding: '8px 12px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    border: '1px solid #EF4444',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '16px',
    color: '#6B7280'
  },
  errorState: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '16px',
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    borderRadius: '8px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#9CA3AF',
    fontSize: '14px'
  }
};

export default TaxClasses;
