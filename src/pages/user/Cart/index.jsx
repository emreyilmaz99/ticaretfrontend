// src/pages/user/Cart/index.jsx
import React from 'react';

// --- Alt Bileşenler ---
import {
  CartHeader,
  CartProductList,
  OrderSummary,
  EmptyCart,
  DeliveryAddressSection,
  VendorGroup,
  CheckoutModal
} from './components';
import AddressModal from '../../../components/modals/AddressModal';
import ConfirmModal from '../../../components/modals/ConfirmModal';

// --- Custom Hook ---
import useCartPage from './useCartPage';

// --- Stiller ---
import { getStyles } from './styles';

const Cart = () => {
  // Custom hook'tan tüm state ve fonksiyonları al
  const {
    cartItems,
    itemCount,
    totals,
    loading,
    couponInput,
    isMobile,
    // Address
    selectedAddress,
    savedAddresses,
    addressLoading,
    isAddressModalOpen,
    // Delete Confirm
    deleteConfirm,
    confirmDeleteAddress,
    cancelDeleteAddress,
    // Clear Cart Confirm
    clearCartConfirm,
    confirmClearCart,
    cancelClearCart,
    // Coupon
    coupon,
    couponLoading,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    // Checkout
    showCheckoutModal,
    checkoutStep,
    paymentHtml,
    isCheckoutLoading,
    // Handlers
    handleRemoveItem,
    handleUpdateQuantity,
    handleClearCart,
    // Address Handlers
    handleSelectAddress,
    handleOpenAddressModal,
    handleCloseAddressModal,
    handleSaveNewAddress,
    handleDeleteAddress,
    isDeleting,
    // Checkout Handlers
    handleCheckoutClick,
    handleStartPayment,
    handleCloseCheckoutModal,
  } = useCartPage();

  // Responsive stiller
  const styles = getStyles(isMobile);

  // Yükleniyor durumu
  if (loading && cartItems.length === 0) {
    return (
      <EmptyCart 
        isLoading={true} 
        styles={styles} 
      />
    );
  }

  // Boş sepet durumu
  if (cartItems.length === 0) {
    return (
      <EmptyCart 
        isLoading={false} 
        styles={styles} 
      />
    );
  }

  // Normal sepet görünümü
  return (
    <div style={styles.container}>
      {/* Başlık */}
      <CartHeader 
        itemCount={cartItems.length} 
        styles={styles} 
      />

      {/* Ana Layout */}
      <div style={styles.layout}>
        {/* Sol Taraf: Adres + Ürün Listesi */}
        <div style={styles.productList}>
          {/* Teslimat Adresi */}
          <DeliveryAddressSection
            selectedAddress={selectedAddress}
            savedAddresses={savedAddresses}
            onSelectAddress={handleSelectAddress}
            onAddNewAddress={handleOpenAddressModal}
            onDeleteAddress={handleDeleteAddress}
            isLoading={addressLoading}
            isDeleting={isDeleting}
            isMobile={isMobile}
          />

          {/* Ürün Listesi */}
          <CartProductList
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            loading={loading}
            isMobile={isMobile}
            styles={styles}
          />
        </div>

        {/* Sağ Taraf: Sipariş Özeti */}
        <OrderSummary
          totals={totals}
          coupon={coupon}
          couponInput={couponInput}
          couponLoading={couponLoading}
          onCouponInputChange={setCouponInput}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          onCheckout={handleCheckoutClick}
          isCheckoutLoading={isCheckoutLoading}
          styles={styles}
        />
      </div>

      {/* Adres Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
        onSave={handleSaveNewAddress}
      />

      {/* Silme Onay Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={cancelDeleteAddress}
        onConfirm={confirmDeleteAddress}
        title="Adresi Sil"
        message="Bu adresi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        type="danger"
        isLoading={isDeleting}
      />

      {/* Sepeti Temizle Onay Modal */}
      <ConfirmModal
        isOpen={clearCartConfirm}
        onClose={cancelClearCart}
        onConfirm={confirmClearCart}
        title="Sepeti Temizle"
        message="Sepeti tamamen boşaltmak istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Evet, Temizle"
        cancelText="Vazgeç"
        type="warning"
      />

      {/* Checkout Modal - iyzico ödeme */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={handleCloseCheckoutModal}
        step={checkoutStep}
        paymentHtml={paymentHtml}
        selectedAddress={selectedAddress}
        totals={totals}
        onStartPayment={handleStartPayment}
        isLoading={isCheckoutLoading}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Cart;
