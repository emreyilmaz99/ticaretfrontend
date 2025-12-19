// src/features/vendor/components/AddVendorModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaStore, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@lib/apiClient';
import { useToast } from '../../../components/common/Toast';

const AddVendorModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    store_name: '',
    full_name: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    district: '',
    address: '',
  });

  const [errors, setErrors] = useState({});

  const createVendorMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiClient.post('/v1/vendors', data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Başarılı', 'Satıcı başarıyla oluşturuldu.');
      queryClient.invalidateQueries(['active-vendors']);
      queryClient.invalidateQueries(['vendors']);
      onClose();
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'Satıcı oluşturulamadı.';
      toast.error('Hata', errorMsg);
      
      // Validation hatalarını göster
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.store_name?.trim()) {
      newErrors.store_name = 'Mağaza adı gereklidir';
    }
    
    if (!formData.full_name?.trim()) {
      newErrors.full_name = 'Yetkili adı gereklidir';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefon gereklidir';
    }
    
    if (!formData.password?.trim()) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Şifre en az 6 karakter olmalıdır';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.warning('Eksik Bilgi', 'Lütfen tüm gerekli alanları doldurun.');
      return;
    }

    createVendorMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <FaStore size={28} color="white" />
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <FaTimes size={18} />
          </button>
          <h2 style={styles.title}>Yeni Satıcı Ekle</h2>
          <p style={styles.subtitle}>
            Platformunuza yeni bir satıcı ekleyin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            {/* Store Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaStore style={styles.labelIcon} />
                Mağaza Adı <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="store_name"
                value={formData.store_name}
                onChange={handleChange}
                style={{...styles.input, ...(errors.store_name ? styles.inputError : {})}}
                placeholder="Örn: ABC Market"
              />
              {errors.store_name && <span style={styles.errorText}>{errors.store_name}</span>}
            </div>

            {/* Full Name */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaUser style={styles.labelIcon} />
                Yetkili Adı Soyadı <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                style={{...styles.input, ...(errors.full_name ? styles.inputError : {})}}
                placeholder="Örn: Ahmet Yılmaz"
              />
              {errors.full_name && <span style={styles.errorText}>{errors.full_name}</span>}
            </div>

            {/* Email */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaEnvelope style={styles.labelIcon} />
                E-posta <span style={styles.required}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{...styles.input, ...(errors.email ? styles.inputError : {})}}
                placeholder="ornek@email.com"
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>

            {/* Phone */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaPhone style={styles.labelIcon} />
                Telefon <span style={styles.required}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{...styles.input, ...(errors.phone ? styles.inputError : {})}}
                placeholder="0555 555 5555"
              />
              {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
            </div>

            {/* Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Şifre <span style={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{...styles.input, ...(errors.password ? styles.inputError : {})}}
                placeholder="En az 6 karakter"
              />
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            {/* City */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaMapMarkerAlt style={styles.labelIcon} />
                Şehir
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={styles.input}
                placeholder="Örn: İstanbul"
              />
            </div>

            {/* District */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                İlçe
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                style={styles.input}
                placeholder="Örn: Kadıköy"
              />
            </div>
          </div>

          {/* Address - Full Width */}
          <div style={{...styles.formGroup, marginTop: '16px'}}>
            <label style={styles.label}>
              Adres
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
              placeholder="Tam adres bilgisi..."
            />
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
            >
              İptal
            </button>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={createVendorMutation.isLoading}
            >
              {createVendorMutation.isLoading ? '✓ Oluşturuluyor...' : '✓ Satıcı Ekle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    padding: '32px',
    position: 'relative',
  },
  iconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    transition: 'all 0.2s',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '800',
    color: 'white',
    marginBottom: '8px',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  form: {
    padding: '32px',
    overflowY: 'auto',
    flex: 1,
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
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  labelIcon: {
    color: '#059669',
    fontSize: '14px',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: '#fafafa',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '4px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    padding: '12px 28px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    background: 'white',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    color: '#6b7280',
    transition: 'all 0.2s',
  },
  submitButton: {
    padding: '12px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '14px',
    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
    transition: 'all 0.2s',
  },
};

export default AddVendorModal;
