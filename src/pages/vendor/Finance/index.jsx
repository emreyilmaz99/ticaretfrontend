import React from 'react';
import { FinanceHeader, WalletCard, SecondaryStatsCards, TransactionTable, AccountSettingsModal, WithdrawalModal } from './components';
import useVendorFinance from './useVendorFinance';
import { getStyles } from './styles';

/**
 * VendorFinance Ana Sayfası
 * API entegrasyonu ile dinamik veri gösterimi
 */
const VendorFinance = () => {
  const styles = getStyles();
  const { 
    transactions, 
    walletData, 
    isLoading,
    handleWithdraw, 
    handleSettings,
    handleCloseWithdrawal,
    handleSubmitWithdrawal,
    isAccountSettingsOpen,
    isWithdrawalModalOpen,
    isSubmittingPayout,
    handleCloseSettings,
    handleSaveSettings,
  } = useVendorFinance();

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <FinanceHeader styles={styles} />

      {/* Cards Grid */}
      <div style={styles.cardsGrid}>
        <WalletCard
          walletData={walletData}
          onWithdraw={handleWithdraw}
          onSettings={handleSettings}
          styles={styles}
        />
        <SecondaryStatsCards walletData={walletData} styles={styles} />
      </div>

      {/* Transaction History */}
      <TransactionTable transactions={transactions} styles={styles} />

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={handleCloseWithdrawal}
        onSubmit={handleSubmitWithdrawal}
        availableBalance={walletData.availableBalance}
        isSubmitting={isSubmittingPayout}
      />

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isAccountSettingsOpen}
        onClose={handleCloseSettings}
        onSave={handleSaveSettings}
      />
    </div>
  );
};

export default VendorFinance;
