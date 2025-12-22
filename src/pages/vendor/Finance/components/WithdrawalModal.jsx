import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaMoneyBillWave, FaExclamationTriangle } from 'react-icons/fa';
import { ModalOverlay } from '../../../../components/modals/shared';

/**
 * WithdrawalModal - Para çekme talebi modalı
 * API: POST /api/v1/vendor/payouts/request
 */
const WithdrawalModal = ({ isOpen, onClose, onSubmit, availableBalance, isSubmitting }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [errors, setErrors] = useState({});

  const MIN_AMOUNT = 100;
  const MAX_AMOUNT = 50000;

  const validateForm = () => {
    const newErrors = {};
    const numAmount = parseFloat(amount);

    if (!amount || isNaN(numAmount)) {
      newErrors.amount = 'Lütfen geçerli bir tutar girin';
    } else if (numAmount < MIN_AMOUNT) {
      newErrors.amount = `Minimum çekim tutarı ${MIN_AMOUNT} TL'dir`;
    } else if (numAmount > MAX_AMOUNT) {
      newErrors.amount = `Maximum çekim tutarı ${MAX_AMOUNT} TL'dir`;
    } else if (numAmount > parseFloat(availableBalance?.replace(/[^\d,]/g, '').replace(',', '.'))) {
      newErrors.amount = 'Yetersiz bakiye';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(amount, method, reference);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAmount('');
      setMethod('bank_transfer');
      setReference('');
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleClose}>
      <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.iconWrapper}>
              <FaMoneyBillWave size={24} color="#059669" />
            </div>
            <div>
              <h2 style={styles.title}>Para Çekme Talebi</h2>
              <p style={styles.subtitle}>Çekilebilir bakiyenizden ödeme talep edin</p>
            </div>
          </div>
          
          <button
            style={styles.closeButton}
            onClick={handleClose}
            disabled={isSubmitting}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Balance Info */}
          <div style={styles.balanceCard}>
            <div style={styles.balanceLabel}>Çekilebilir Bakiye</div>
            <div style={styles.balanceAmount}>{availableBalance || '₺0,00'}</div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Amount */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Çekilecek Tutar <span style={styles.required}>*</span>
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.currencySymbol}>₺</span>
                <input
                  type="number"
                  step="0.01"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  style={{
                    ...styles.input,
                    ...(errors.amount ? styles.inputError : {}),
                  }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  disabled={isSubmitting}
                />
              </div>
              {errors.amount && (
                <div style={styles.errorMessage}>
                  <FaExclamationTriangle size={12} />
                  <span>{errors.amount}</span>
                </div>
              )}
              <div style={styles.hint}>
                Minimum: {MIN_AMOUNT} TL • Maximum: {MAX_AMOUNT.toLocaleString('tr-TR')} TL
              </div>
            </div>

            {/* Method */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Ödeme Yöntemi</label>
              <select
                style={styles.select}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="bank_transfer">Banka Havalesi</option>
                <option value="eft">EFT</option>
              </select>
            </div>

            {/* Reference */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Açıklama (Opsiyonel)</label>
              <textarea
                style={styles.textarea}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="İsteğe bağlı not ekleyebilirsiniz..."
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Warning */}
            <div style={styles.warningBox}>
              <FaExclamationTriangle size={16} color="#d97706" />
              <div style={styles.warningText}>
                <strong>Önemli:</strong> Çekim talebi oluşturulduktan sonra işlem admin onayına gönderilecektir. 
                Onay sonrası 1-3 iş günü içinde hesabınıza aktarılacaktır.
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                type="button"
                style={styles.cancelButton}
                onClick={handleClose}
                disabled={isSubmitting}
              >
                İptal
              </button>
              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(isSubmitting ? styles.submitButtonDisabled : {}),
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Gönderiliyor...' : 'Talep Oluştur'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalOverlay>
  );
};

WithdrawalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  availableBalance: PropTypes.string,
  isSubmitting: PropTypes.bool,
};

WithdrawalModal.defaultProps = {
  availableBalance: '₺0,00',
  isSubmitting: false,
};

// Styles
const styles = {
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  iconWrapper: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#d1fae5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#6b7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  content: {
    padding: '24px',
    overflowY: 'auto',
  },
  balanceCard: {
    backgroundColor: '#ecfdf5',
    border: '2px solid #059669',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    marginBottom: '24px',
  },
  balanceLabel: {
    fontSize: '14px',
    color: '#047857',
    fontWeight: '500',
    marginBottom: '8px',
  },
  balanceAmount: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#059669',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#ef4444',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  currencySymbol: {
    position: 'absolute',
    left: '16px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#6b7280',
  },
  input: {
    width: '100%',
    padding: '12px 16px 12px 40px',
    fontSize: '16px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'all 0.2s',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#ef4444',
    fontSize: '12px',
    fontWeight: '500',
  },
  warningBox: {
    display: 'flex',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#fef3c7',
    border: '1px solid #fbbf24',
    borderRadius: '8px',
    marginTop: '8px',
  },
  warningText: {
    fontSize: '13px',
    color: '#78350f',
    lineHeight: '1.5',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#fff',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    flex: 1,
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#059669',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default WithdrawalModal;
