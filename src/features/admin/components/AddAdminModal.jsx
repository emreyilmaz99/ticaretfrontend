import React, { useState } from 'react';
import { FaTimes, FaUserShield, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAdmin } from '../api/adminApi';
import { useToast } from '../../../components/common/Toast';

const AddAdminModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'admin',
    is_active: true,
  });

  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: createAdmin,
    onSuccess: () => {
      toast.success('Başarılı', 'Yönetici başarıyla oluşturuldu.');
      queryClient.invalidateQueries(['admins']);
      onClose();
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin',
        is_active: true,
      });
    },
    onError: (error) => {
      const errorMsg = error.response?.data?.message || 'Yönetici oluşturulamadı.';
      toast.error('Hata', errorMsg);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Ad Soyad gereklidir';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'E-posta gereklidir';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }
    
    if (!formData.password?.trim()) {
      newErrors.password = 'Şifre gereklidir';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır';
    }
    
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Şifreler eşleşmiyor';
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

    createMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.iconContainer}>
            <FaUserShield size={28} color="white" />
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <FaTimes size={18} />
          </button>
          <h2 style={styles.title}>Yeni Yönetici Ekle</h2>
          <p style={styles.subtitle}>
            Sisteme yeni bir yönetici ekleyin
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            {/* Name */}
            <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
              <label style={styles.label}>
                <FaUser style={styles.labelIcon} />
                Ad Soyad <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
                placeholder="Örn: Ahmet Yılmaz"
              />
              {errors.name && <span style={styles.errorText}>{errors.name}</span>}
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

            {/* Role */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaUserShield style={styles.labelIcon} />
                Rol <span style={styles.required}>*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="admin">Yönetici</option>
                <option value="super-admin">Süper Yönetici</option>
                <option value="editor">Editör</option>
                <option value="moderator">Moderatör</option>
              </select>
            </div>

            {/* Password */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaLock style={styles.labelIcon} />
                Şifre <span style={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{...styles.input, ...(errors.password ? styles.inputError : {})}}
                placeholder="En az 8 karakter"
              />
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>

            {/* Password Confirmation */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FaLock style={styles.labelIcon} />
                Şifre Tekrar <span style={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                style={{...styles.input, ...(errors.password_confirmation ? styles.inputError : {})}}
                placeholder="Şifrenizi tekrar girin"
              />
              {errors.password_confirmation && <span style={styles.errorText}>{errors.password_confirmation}</span>}
            </div>
          </div>

          {/* Active Status */}
          <div style={{marginTop: '16px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{width: '18px', height: '18px', cursor: 'pointer'}}
              />
              <span style={{fontSize: '14px', fontWeight: '600', color: '#374151'}}>
                Yöneticiyi aktif olarak oluştur
              </span>
            </label>
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
              disabled={createMutation.isLoading}
            >
              {createMutation.isLoading ? '✓ Oluşturuluyor...' : '✓ Yönetici Ekle'}
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
    maxWidth: '700px',
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

export default AddAdminModal;
