import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaUniversity, FaSave, FaEdit } from 'react-icons/fa';
import { ModalOverlay } from '../../../../components/modals/shared';

/**
 * AccountSettingsModal - Satıcı hesap ayarları modal
 * QuickView tarzında şık bir tasarım
 */
const AccountSettingsModal = ({ isOpen, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);
  const [editHovered, setEditHovered] = useState(false);
  const [saveHovered, setSaveHovered] = useState(false);

  // Form verileri - gerçek uygulamada API'den gelecek
  const [formData, setFormData] = useState({
    bankName: 'Ziraat Bankası',
    accountHolder: 'Mehmet Yılmaz',
    iban: 'TR33 0006 1005 1978 6457 8413 26',
    branch: 'Kadıköy Şubesi',
    accountType: 'Ticari Hesap',
    taxNumber: '1234567890',
    taxOffice: 'Kadıköy Vergi Dairesi',
    email: 'mehmet@example.com',
    phone: '+90 532 123 45 67',
  });

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(() => {
    onSave(formData);
    setIsEditing(false);
  }, [formData, onSave]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    // Gerçek uygulamada önceki verileri geri yükle
  }, []);

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconWrapper}>
              <FaUniversity size={24} color="#059669" />
            </div>
            <div>
              <h2 style={styles.title}>Hesap Ayarları</h2>
              <p style={styles.subtitle}>Banka ve ödeme bilgilerinizi yönetin</p>
            </div>
          </div>
          
          <button
            style={{
              ...styles.closeButton,
              ...(closeHovered ? styles.closeButtonHover : {}),
            }}
            onClick={onClose}
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Banka Bilgileri */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Banka Bilgileri</h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Banka Adı</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{formData.bankName}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Şube</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.branch}
                    onChange={(e) => handleInputChange('branch', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{formData.branch}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hesap Sahibi</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.accountHolder}
                    onChange={(e) => handleInputChange('accountHolder', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{formData.accountHolder}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Hesap Türü</label>
                {isEditing ? (
                  <select
                    style={styles.input}
                    value={formData.accountType}
                    onChange={(e) => handleInputChange('accountType', e.target.value)}
                  >
                    <option>Ticari Hesap</option>
                    <option>Bireysel Hesap</option>
                  </select>
                ) : (
                  <p style={styles.value}>{formData.accountType}</p>
                )}
              </div>

              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>IBAN</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.iban}
                    onChange={(e) => handleInputChange('iban', e.target.value)}
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                  />
                ) : (
                  <p style={styles.valueIban}>{formData.iban}</p>
                )}
              </div>
            </div>
          </div>

          {/* Vergi Bilgileri */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Vergi Bilgileri</h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vergi Numarası</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.taxNumber}
                    onChange={(e) => handleInputChange('taxNumber', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{formData.taxNumber}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Vergi Dairesi</label>
                {isEditing ? (
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.taxOffice}
                    onChange={(e) => handleInputChange('taxOffice', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{formData.taxOffice}</p>
                )}
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>İletişim Bilgileri</h3>
            
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>E-posta</label>
                {isEditing ? (
                  <input
                    type="email"
                    style={styles.input}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{formData.email}</p>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Telefon</label>
                {isEditing ? (
                  <input
                    type="tel"
                    style={styles.input}
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <p style={styles.value}>{formData.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          {isEditing ? (
            <>
              <button style={styles.cancelButton} onClick={handleCancel}>
                İptal
              </button>
              <button
                style={{
                  ...styles.saveButton,
                  ...(saveHovered ? styles.saveButtonHover : {}),
                }}
                onClick={handleSave}
                onMouseEnter={() => setSaveHovered(true)}
                onMouseLeave={() => setSaveHovered(false)}
              >
                <FaSave style={{ marginRight: '8px' }} />
                Kaydet
              </button>
            </>
          ) : (
            <button
              style={{
                ...styles.editButton,
                ...(editHovered ? styles.editButtonHover : {}),
              }}
              onClick={() => setIsEditing(true)}
              onMouseEnter={() => setEditHovered(true)}
              onMouseLeave={() => setEditHovered(false)}
            >
              <FaEdit style={{ marginRight: '8px' }} />
              Düzenle
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

AccountSettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

const styles = {
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    width: '95%',
    maxWidth: '900px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    animation: 'modalSlideUp 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px 32px 24px 32px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#f8fafc',
  },

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  iconWrapper: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: '#d1fae5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },

  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },

  closeButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: '18px',
    transition: 'all 0.2s ease',
  },

  closeButtonHover: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    transform: 'scale(1.05)',
  },

  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px',
  },

  section: {
    marginBottom: '32px',
  },

  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '2px solid #059669',
    display: 'inline-block',
  },

  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },

  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  value: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#1e293b',
    padding: '12px 0',
  },

  valueIban: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#059669',
    padding: '12px 0',
    letterSpacing: '1px',
    fontFamily: 'monospace',
  },

  input: {
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  },

  footer: {
    padding: '24px 32px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    backgroundColor: '#f8fafc',
  },

  editButton: {
    padding: '12px 32px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },

  editButtonHover: {
    backgroundColor: '#047857',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
  },

  cancelButton: {
    padding: '12px 32px',
    backgroundColor: '#fff',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  saveButton: {
    padding: '12px 32px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },

  saveButtonHover: {
    backgroundColor: '#047857',
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 15px -3px rgba(5, 150, 105, 0.3)',
  },
};

export default AccountSettingsModal;
