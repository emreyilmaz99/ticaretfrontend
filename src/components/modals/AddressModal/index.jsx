// src/components/modals/AddressModal/index.jsx
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaTimes, FaMapMarkerAlt, FaUser, FaPhone, FaIdCard, FaCity, FaHome, FaTag, FaChevronDown, FaSearch, FaCheck } from 'react-icons/fa';
import LocationMap from '../../common/LocationMap';
import { useAddressForm } from './hooks/useAddressForm';
import { useAddressValidation } from './hooks/useAddressValidation';
import { cities, getDistricts, getNeighborhoods } from '../../../data/turkeyDataUtils';

// Arama destekli dropdown bileşeni
const SearchableSelect = ({ 
  label, 
  value, 
  options, 
  onChange, 
  placeholder, 
  icon: Icon, 
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    const search = searchTerm.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(search));
  }, [options, searchTerm]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const styles = {
    wrapper: {
      position: 'relative',
      flex: 1,
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '6px',
    },
    selectBox: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      gap: '10px',
      transition: 'all 0.2s ease',
    },
    icon: {
      color: '#9ca3af',
      fontSize: '14px',
      flexShrink: 0,
    },
    value: {
      flex: 1,
      fontSize: '14px',
      fontWeight: '500',
      color: value ? '#111827' : '#9ca3af',
    },
    chevron: {
      color: '#9ca3af',
      fontSize: '12px',
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
      transition: 'transform 0.2s ease',
    },
    dropdown: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
      zIndex: 1000,
      overflow: 'hidden',
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 14px',
      borderBottom: '1px solid #f3f4f6',
      gap: '10px',
      backgroundColor: '#f9fafb',
    },
    searchInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      backgroundColor: 'transparent',
      color: '#111827',
    },
    optionsList: {
      maxHeight: '200px',
      overflowY: 'auto',
    },
    option: {
      padding: '12px 14px',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      transition: 'background-color 0.15s ease',
    },
    noResults: {
      padding: '16px',
      textAlign: 'center',
      color: '#9ca3af',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.wrapper} ref={wrapperRef}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div 
        style={styles.selectBox} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {Icon && <Icon style={styles.icon} />}
        <span style={styles.value}>{value || placeholder}</span>
        <FaChevronDown style={styles.chevron} />
      </div>
      
      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.searchBox}>
            <FaSearch style={styles.icon} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ara..."
              style={styles.searchInput}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div style={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  style={{
                    ...styles.option,
                    backgroundColor: option === value ? '#d1fae5' : 'transparent',
                    color: option === value ? '#059669' : '#374151',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(option);
                  }}
                  onMouseEnter={(e) => {
                    if (option !== value) e.target.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    if (option !== value) e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  {option}
                  {option === value && <FaCheck style={{ color: '#059669', fontSize: '12px' }} />}
                </div>
              ))
            ) : (
              <div style={styles.noResults}>Sonuç bulunamadı</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Input bileşeni
const FormInput = ({ label, value, onChange, placeholder, icon: Icon, type = 'text', required = false, maxLength }) => {
  const [isFocused, setIsFocused] = useState(false);

  const styles = {
    wrapper: {
      flex: 1,
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '6px',
    },
    inputWrapper: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      gap: '10px',
      transition: 'all 0.2s ease',
    },
    icon: {
      color: '#9ca3af',
      fontSize: '14px',
      flexShrink: 0,
    },
    input: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      backgroundColor: 'transparent',
    },
  };

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <div style={styles.inputWrapper}>
        {Icon && <Icon style={styles.icon} />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};

// Textarea bileşeni
const FormTextarea = ({ label, value, onChange, placeholder, required = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const styles = {
    wrapper: {
      width: '100%',
    },
    label: {
      display: 'block',
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '6px',
    },
    textarea: {
      width: '100%',
      padding: '12px 14px',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      fontSize: '14px',
      fontWeight: '500',
      color: '#111827',
      resize: 'vertical',
      minHeight: '80px',
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box',
    },
  };

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.textarea}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

const AddressModal = React.memo(({
  isOpen,
  onClose,
  onSave,
  onDelete,
  addresses = [],
  initialAddress = null,
  user,
  mode = 'new',
}) => {
  const {
    formData,
    updateField,
    handleCityChange,
    handleDistrictChange,
    loadAddress,
    resetForm,
  } = useAddressForm(initialAddress, user);

  const { validateForm, formatPhone, formatIdentityNumber } = useAddressValidation();
  const [validationErrors, setValidationErrors] = useState([]);

  const districts = useMemo(
    () => (formData.city ? getDistricts(formData.city) : []),
    [formData.city]
  );

  const neighborhoods = useMemo(
    () => (formData.district ? getNeighborhoods(formData.city, formData.district) : []),
    [formData.city, formData.district]
  );

  const handleSave = useCallback(() => {
    const { isValid, errors } = validateForm(formData);

    if (!isValid) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);

    const addressData = {
      full_name: formData.fullName,
      phone: formData.phone,
      identity_number: formData.identityNumber,
      city: formData.city,
      district: formData.district,
      neighborhood: formData.neighborhood,
      postal_code: formData.postalCode,
      address_line: formData.addressLine,
      label: formData.addressLabel,
    };

    if (formData.selectedId) {
      addressData.id = formData.selectedId;
    }

    onSave(addressData);
    onClose();
  }, [formData, validateForm, onSave, onClose]);

  const handleAddressSelect = useCallback(
    (address) => {
      // Kayıtlı bir adres seçildiğinde direkt olarak kaydet
      onSave(address);
      onClose();
    },
    [onSave, onClose]
  );

  const handleDelete = useCallback(
    (addressId) => {
      if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
        onDelete(addressId);
        if (formData.selectedId === addressId) {
          resetForm();
        }
      }
    },
    [onDelete, formData.selectedId, resetForm]
  );

  const handleLocationSelect = useCallback((location) => {
    // Haritadan konum seçildiğinde
    console.log('Selected location:', location);
  }, []);

  if (!isOpen) return null;

  const isMobile = window.innerWidth <= 768;

  const modalStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: isMobile ? 'flex-end' : 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: isMobile ? '0' : '20px',
    },
    modal: {
      backgroundColor: '#fff',
      borderRadius: isMobile ? '20px 20px 0 0' : '20px',
      width: '100%',
      maxWidth: isMobile ? '100%' : '1000px',
      maxHeight: isMobile ? '95vh' : '90vh',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '16px' : '20px 24px',
      borderBottom: '1px solid #e5e7eb',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '8px' : '12px',
      color: '#fff',
    },
    headerIcon: {
      width: isMobile ? '32px' : '40px',
      height: isMobile ? '32px' : '40px',
      borderRadius: isMobile ? '10px' : '12px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isMobile ? '16px' : '18px',
    },
    title: {
      fontSize: isMobile ? '16px' : '20px',
      fontWeight: '700',
      margin: 0,
    },
    subtitle: {
      fontSize: isMobile ? '11px' : '13px',
      opacity: 0.8,
      margin: 0,
      display: isMobile ? 'none' : 'block',
    },
    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    content: {
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      flex: 1,
      overflow: 'hidden',
    },
    leftPanel: {
      flex: 1,
      padding: isMobile ? '16px' : '24px',
      overflowY: 'auto',
      borderRight: isMobile ? 'none' : '1px solid #e5e7eb',
    },
    rightPanel: {
      width: isMobile ? '100%' : '400px',
      display: isMobile ? 'none' : 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb',
    },
    mapContainer: {
      flex: 1,
      padding: '16px',
    },
    mapWrapper: {
      height: '100%',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #e5e7eb',
    },
    mapPlaceholder: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      color: '#6b7280',
      gap: '12px',
    },
    tabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
    },
    tab: {
      flex: 1,
      padding: '12px 16px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? '12px' : '16px',
      marginBottom: isMobile ? '12px' : '16px',
    },
    singleColumn: {
      gridColumn: '1 / -1',
    },
    errorBox: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '10px',
      padding: '12px 16px',
      marginBottom: '16px',
    },
    errorList: {
      margin: 0,
      paddingLeft: '20px',
      color: '#dc2626',
      fontSize: '13px',
    },
    savedAddresses: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    savedAddressCard: {
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    savedAddressLabel: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '6px',
      backgroundColor: '#d1fae5',
      color: '#059669',
      fontSize: '12px',
      fontWeight: '600',
      marginBottom: '8px',
    },
    savedAddressName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '4px',
    },
    savedAddressDetails: {
      fontSize: '13px',
      color: '#6b7280',
      lineHeight: 1.5,
    },
    savedAddressPhone: {
      fontSize: '12px',
      color: '#9ca3af',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#9ca3af',
    },
    emptyStateIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      opacity: 0.3,
    },
    emptyStateText: {
      fontSize: '15px',
      fontWeight: '500',
      color: '#6b7280',
      marginBottom: '8px',
    },
    emptyStateSubtext: {
      fontSize: '13px',
      color: '#9ca3af',
    },
    // Yatay adres bar stilleri
    addressBarContainer: {
      marginBottom: '20px',
    },
    addressBarLabel: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    addressBarScroll: {
      display: 'flex',
      gap: '10px',
      overflowX: 'auto',
      paddingBottom: '8px',
      scrollbarWidth: 'thin',
      scrollbarColor: '#10b981 #f3f4f6',
    },
    addressChip: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 16px',
      borderRadius: '12px',
      border: '2px solid #e5e7eb',
      backgroundColor: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      minWidth: 'fit-content',
    },
    addressChipSelected: {
      borderColor: '#10b981',
      backgroundColor: '#d1fae5',
    },
    addressChipIcon: {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '14px',
    },
    addressChipIconSelected: {
      backgroundColor: '#10b981',
      color: '#fff',
    },
    addressChipContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
    },
    addressChipLabel: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#111827',
    },
    addressChipCity: {
      fontSize: '11px',
      color: '#6b7280',
    },
    dividerLine: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      margin: '0 0 20px 0',
    },
    footer: {
      display: 'flex',
      gap: '12px',
      padding: isMobile ? '12px 16px' : '16px',
      borderTop: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      position: isMobile ? 'sticky' : 'relative',
      bottom: 0,
    },
    cancelBtn: {
      flex: 1,
      padding: isMobile ? '12px 20px' : '14px 24px',
      borderRadius: '10px',
      border: '1px solid #e5e7eb',
      backgroundColor: '#fff',
      color: '#374151',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    saveBtn: {
      flex: 2,
      padding: isMobile ? '12px 20px' : '14px 24px',
      borderRadius: '10px',
      border: 'none',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
      fontSize: isMobile ? '14px' : '15px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
  };

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div style={modalStyles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={modalStyles.headerTitle}>
            <div style={modalStyles.headerIcon}>
              <FaMapMarkerAlt />
            </div>
            <div>
              <h2 style={modalStyles.title}>
                {mode === 'edit' ? 'Adresi Düzenle' : 'Teslimat Adresi'}
              </h2>
              <p style={modalStyles.subtitle}>
                Siparişleriniz için adres bilgilerinizi girin
              </p>
            </div>
          </div>
          <button 
            style={modalStyles.closeBtn} 
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div style={modalStyles.content}>
          {/* Left Panel - Form */}
          <div style={modalStyles.leftPanel}>
            {/* Kayıtlı Adresler Bar - Form Üstünde */}
            {addresses.length > 0 && (
              <div style={modalStyles.addressBarContainer}>
                <div style={modalStyles.addressBarLabel}>
                  <FaMapMarkerAlt style={{ color: '#10b981' }} />
                  Kayıtlı Adreslerim ({addresses.length})
                </div>
                <div style={modalStyles.addressBarScroll}>
                  {addresses.map((address) => {
                    const isSelected = formData.selectedId === address.id;
                    return (
                      <div
                        key={address.id}
                        style={{
                          ...modalStyles.addressChip,
                          ...(isSelected ? modalStyles.addressChipSelected : {}),
                        }}
                        onClick={() => handleAddressSelect(address)}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#10b981';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }
                        }}
                      >
                        <div style={{
                          ...modalStyles.addressChipIcon,
                          ...(isSelected ? modalStyles.addressChipIconSelected : {}),
                        }}>
                          <FaHome />
                        </div>
                        <div style={modalStyles.addressChipContent}>
                          <span style={modalStyles.addressChipLabel}>
                            {address.label || 'Adres'}
                          </span>
                          <span style={modalStyles.addressChipCity}>
                            {address.district}/{address.city}
                          </span>
                        </div>
                        {isSelected && (
                          <FaCheck style={{ color: '#10b981', fontSize: '14px', marginLeft: '4px' }} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div style={modalStyles.dividerLine} />
              </div>
            )}

            {/* Error Messages */}
            {validationErrors.length > 0 && (
              <div style={modalStyles.errorBox}>
                <ul style={modalStyles.errorList}>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Form Alanları */}
            <>
              {/* Kişisel Bilgiler */}
              <div style={modalStyles.formGrid}>
                <FormInput
                  label="Ad Soyad"
                  value={formData.fullName}
                  onChange={(val) => updateField('fullName', val)}
                  placeholder="Adınız ve Soyadınız"
                  icon={FaUser}
                  required
                />
                <FormInput
                  label="Telefon"
                  value={formData.phone}
                  onChange={(val) => updateField('phone', formatPhone(val))}
                  placeholder="5XX XXX XX XX"
                  icon={FaPhone}
                  type="tel"
                  maxLength={11}
                  required
                />
              </div>

              <div style={{ marginBottom: isMobile ? '12px' : '16px' }}>
                <FormInput
                  label="TC Kimlik No"
                  value={formData.identityNumber}
                  onChange={(val) => updateField('identityNumber', formatIdentityNumber(val))}
                  placeholder="11 Haneli TC Kimlik Numarası"
                  icon={FaIdCard}
                  maxLength={11}
                />
              </div>

              {/* Konum Bilgileri */}
              <div style={modalStyles.formGrid}>
                <SearchableSelect
                  label="İl"
                  value={formData.city}
                  options={cities}
                  onChange={handleCityChange}
                  placeholder="İl seçiniz"
                  icon={FaCity}
                  required
                />
                <SearchableSelect
                  label="İlçe"
                  value={formData.district}
                  options={districts}
                  onChange={handleDistrictChange}
                  placeholder={formData.city ? "İlçe seçiniz" : "Önce il seçin"}
                  icon={FaHome}
                  disabled={!formData.city}
                  required
                />
              </div>

              <div style={modalStyles.formGrid}>
                <SearchableSelect
                  label="Mahalle"
                  value={formData.neighborhood}
                  options={neighborhoods}
                  onChange={(val) => updateField('neighborhood', val)}
                  placeholder={formData.district ? "Mahalle seçiniz" : "Önce ilçe seçin"}
                  icon={FaHome}
                  disabled={!formData.district}
                  required
                />
                <FormInput
                  label="Posta Kodu"
                  value={formData.postalCode}
                  onChange={(val) => updateField('postalCode', val)}
                  placeholder="34000"
                  icon={FaTag}
                />
              </div>

              <div style={{ marginBottom: isMobile ? '12px' : '16px' }}>
                <FormInput
                  label="Adres Etiketi"
                  value={formData.addressLabel}
                  onChange={(val) => updateField('addressLabel', val)}
                  placeholder="Ev, İş, vb."
                  icon={FaTag}
                  required
                />
              </div>

              <FormTextarea
                label="Açık Adres"
                value={formData.addressLine}
                onChange={(val) => updateField('addressLine', val)}
                placeholder="Cadde, sokak, bina no, daire no vb."
                required
              />
            </>
          </div>

          {/* Right Panel - Map */}
          <div style={modalStyles.rightPanel}>
            <div style={modalStyles.mapContainer}>
              <div style={modalStyles.mapWrapper}>
                {formData.city ? (
                  <LocationMap
                    city={formData.city}
                    district={formData.district}
                    neighborhood={formData.neighborhood}
                    onLocationSelect={handleLocationSelect}
                  />
                ) : (
                  <div style={modalStyles.mapPlaceholder}>
                    <FaMapMarkerAlt style={{ fontSize: '48px', opacity: 0.3 }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>
                      İl seçtiğinizde harita görünecek
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Mobilde modal dışında */}
        <div style={modalStyles.footer}>
          <button
            style={modalStyles.cancelBtn}
            onClick={onClose}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
          >
            İptal
          </button>
          <button
            style={modalStyles.saveBtn}
            onClick={handleSave}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Adresi Kaydet
          </button>
        </div>
      </div>
    </div>
  );
});

AddressModal.displayName = 'AddressModal';

AddressModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  addresses: PropTypes.array,
  initialAddress: PropTypes.object,
  user: PropTypes.object,
  mode: PropTypes.oneOf(['new', 'edit']),
};

export default AddressModal;
