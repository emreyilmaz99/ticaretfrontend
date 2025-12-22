// src/pages/admin/VendorPayments/styles.js

export const getStyles = (isMobile) => ({
  container: {
    padding: isMobile ? '16px' : '32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },

  headerActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  exportBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: isMobile ? '10px 16px' : '12px 20px',
    backgroundColor: 'white',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      borderColor: '#059669',
      color: '#059669',
      backgroundColor: '#f0fdf4',
    },
  },

  // Filters
  filtersCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: isMobile ? '16px' : '24px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },

  filtersHeader: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: isMobile ? '100%' : '300px',
  },

  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    fontSize: '16px',
  },

  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#059669',
      boxShadow: '0 0 0 3px rgba(5, 150, 105, 0.1)',
    },
  },

  filterToggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '10px',
    color: '#475569',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },

  advancedFilters: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },

  filterRow: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
    gap: '16px',
  },

  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
  },

  filterSelect: {
    padding: '10px 14px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
    backgroundColor: 'white',
  },

  // Table Card
  tableCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '16px',
  },

  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e2e8f0',
    borderTopColor: '#059669',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },

  loadingText: {
    color: '#64748b',
    fontSize: '14px',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    gap: '16px',
  },

  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '8px 0 0 0',
  },

  emptyText: {
    fontSize: '14px',
    color: '#64748b',
    textAlign: 'center',
    maxWidth: '400px',
    margin: 0,
  },

  // Mobile Cards
  mobileCardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
  },

  mobileCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
  },

  mobileCardHeader: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },

  vendorInfo: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flex: 1,
  },

  vendorName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 4px 0',
  },

  vendorEmail: {
    fontSize: '13px',
    color: '#64748b',
    margin: 0,
  },

  mobileCardBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  mobileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mobileLabel: {
    fontSize: '13px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  mobileValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },

  mobileDivider: {
    height: '1px',
    backgroundColor: '#e2e8f0',
    margin: '4px 0',
  },

  mobileCardFooter: {
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '8px',
  },

  viewDetailBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    backgroundColor: '#f1f5f9',
    border: 'none',
    borderRadius: '8px',
    color: '#475569',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  markPaidBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px',
    backgroundColor: '#d1fae5',
    border: 'none',
    borderRadius: '8px',
    color: '#059669',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Desktop Table
  tableWrapper: {
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '700',
    color: '#475569',
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  tr: {
    borderBottom: '1px solid #f1f5f9',
    transition: 'background-color 0.15s',
    ':hover': {
      backgroundColor: '#f8fafc',
    },
  },

  td: {
    padding: '20px',
    fontSize: '14px',
    color: '#1e293b',
  },

  // Table Cells
  vendorCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  vendorAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#d1fae5',
    color: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  vendorNameTable: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '4px',
  },

  vendorEmailTable: {
    fontSize: '12px',
    color: '#64748b',
  },

  dateCell: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },

  dateText: {
    fontSize: '13px',
    color: '#475569',
    lineHeight: '1.6',
  },

  amountCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  amountValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },

  amountLabel: {
    fontSize: '12px',
    color: '#64748b',
  },

  commissionCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  commissionValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#dc2626',
  },

  commissionLabel: {
    fontSize: '12px',
    color: '#64748b',
  },

  netAmountCell: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#059669',
  },

  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },

  actionButtons: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'flex-end',
  },

  actionBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0',
    },
  },
});
