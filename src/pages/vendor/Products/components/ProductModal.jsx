// src/pages/vendor/Products/components/ProductModal.jsx
import React, { useState, useEffect } from 'react';
import ModalHeader from './modal/ModalHeader';
import ModalTabs from './modal/ModalTabs';
import GeneralTab from './modal/GeneralTab';
import PricingTab from './modal/PricingTab';
import MediaTab from './modal/MediaTab';
import VariantsTab from './modal/VariantsTab';
import SettingsTab from './modal/SettingsTab';
import ModalFooter from './modal/ModalFooter';
import { styles } from '../styles';

const ProductModal = ({
  isOpen,
  mode,
  activeTab,
  setActiveTab,
  formData,
  setFormData,
  groupedCategories,
  units,
  taxClasses,
  selectedProduct,
  tagInput,
  setTagInput,
  onClose,
  onSubmit,
  handleImageChange,
  removeImage,
  handleVariantChange,
  addVariant,
  removeVariant,
  addTag,
  removeTag,
  removeLastTag,
  deletePhotoMutation,
  toFullUrl,
  onImageClick,
  openConfirmModal,
  isSubmitting
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const readOnly = mode === 'view';

  // Mobile specific styles
  const modalStyles = isMobile ? {
    ...styles.modal,
    maxWidth: '100vw',
    width: '100vw',
    height: '100vh',
    maxHeight: '100vh',
    margin: 0,
    borderRadius: 0,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  } : styles.modal;

  const modalHeaderStyles = isMobile ? {
    ...styles.modalHeader,
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } : styles.modalHeader;

  const modalFooterStyles = isMobile ? {
    ...styles.modalFooter,
    position: 'sticky',
    bottom: 0,
    zIndex: 10,
    boxShadow: '0 -1px 3px rgba(0,0,0,0.1)',
  } : styles.modalFooter;

  const modalBodyStyles = isMobile ? {
    ...styles.modalBody,
    flex: 1,
    overflowY: 'auto',
  } : styles.modalBody;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralTab
            formData={formData}
            setFormData={setFormData}
            groupedCategories={groupedCategories}
            taxClasses={taxClasses}
            readOnly={readOnly}
            isMobile={isMobile}
          />
        );
      case 'pricing':
        return (
          <PricingTab
            formData={formData}
            setFormData={setFormData}
            units={units}
            readOnly={readOnly}
            isMobile={isMobile}
          />
        );
      case 'media':
        return (
          <MediaTab
            formData={formData}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
            selectedProduct={selectedProduct}
            deletePhotoMutation={deletePhotoMutation}
            toFullUrl={toFullUrl}
            onImageClick={onImageClick}
            openConfirmModal={openConfirmModal}
            readOnly={readOnly}
            isMobile={isMobile}
          />
        );
      case 'variants':
        return (
          <VariantsTab
            formData={formData}
            handleVariantChange={handleVariantChange}
            addVariant={addVariant}
            removeVariant={removeVariant}
            units={units}
            readOnly={readOnly}
            isMobile={isMobile}
          />
        );
      case 'settings':
        return (
          <SettingsTab
            formData={formData}
            setFormData={setFormData}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addTag={addTag}
            removeTag={removeTag}
            removeLastTag={removeLastTag}
            readOnly={readOnly}
            isMobile={isMobile}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={modalStyles} onClick={(e) => e.stopPropagation()}>
        <div style={modalHeaderStyles}>
          <ModalHeader mode={mode} onClose={onClose} isMobile={isMobile} />
        </div>
        
        <ModalTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          formType={formData.type}
          isMobile={isMobile}
        />
        
        <div style={modalBodyStyles}>
          {renderTabContent()}
        </div>
        
        <div style={modalFooterStyles}>
          <ModalFooter
            mode={mode}
            onClose={onClose}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
