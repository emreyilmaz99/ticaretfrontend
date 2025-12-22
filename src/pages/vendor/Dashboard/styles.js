// Mock data - will be replaced with API data when backend is connected
export const MOCK_STATS = [
  { title: 'Toplam Kazanç', value: '₺124,500', change: '+12.5%', isPositive: true, color: '#10b981', iconType: 'wallet' },
  { title: 'Toplam Sipariş', value: '1,240', change: '+8.2%', isPositive: true, color: '#3b82f6', iconType: 'shopping' },
  { title: 'Aktif Ürünler', value: '48', change: '-2.4%', isPositive: false, color: '#f59e0b', iconType: 'box' },
  { title: 'Mağaza Puanı', value: '4.8', change: '+0.1', isPositive: true, color: '#8b5cf6', iconType: 'star' },
];

export const MOCK_TOP_PRODUCTS = [
  { name: 'Kablosuz Kulaklık Pro', sales: 124, revenue: '₺161,076', image: 'https://placehold.co/40' },
  { name: 'Akıllı Saat Series 5', sales: 89, revenue: '₺311,411', image: 'https://placehold.co/40' },
  { name: 'Mekanik Klavye RGB', sales: 56, revenue: '₺120,400', image: 'https://placehold.co/40' },
];

export const MOCK_REVENUE_DATA = [
  { name: 'Pzt', value: 4000 },
  { name: 'Sal', value: 3000 },
  { name: 'Çar', value: 2000 },
  { name: 'Per', value: 2780 },
  { name: 'Cum', value: 1890 },
  { name: 'Cmt', value: 2390 },
  { name: 'Paz', value: 3490 },
];

export const MOCK_RECENT_ORDERS = [
  { id: '#SIP-1024', customer: 'Ahmet Yılmaz', product: 'Kablosuz Kulaklık', date: '10 Dakika önce', amount: '₺1,299', status: 'Bekliyor' },
  { id: '#SIP-1023', customer: 'Ayşe Demir', product: 'Akıllı Saat', date: '2 Saat önce', amount: '₺3,499', status: 'Hazırlanıyor' },
  { id: '#SIP-1022', customer: 'Mehmet Kaya', product: 'Laptop Çantası', date: '5 Saat önce', amount: '₺450', status: 'Kargolandı' },
  { id: '#SIP-1021', customer: 'Zeynep Çelik', product: 'USB Hub', date: '1 Gün önce', amount: '₺299', status: 'Teslim Edildi' },
];

// Status color mappings
export const STATUS_STYLES = {
  'Bekliyor': { backgroundColor: '#fef3c7', color: '#d97706' },
  'Hazırlanıyor': { backgroundColor: '#dbeafe', color: '#2563eb' },
  'Kargolandı': { backgroundColor: '#e0e7ff', color: '#4f46e5' },
  'Teslim Edildi': { backgroundColor: '#dcfce7', color: '#16a34a' },
  'default': { backgroundColor: '#f3f4f6', color: '#4b5563' }
};

/**
 * Get status style for order status badge
 */
export const getStatusStyle = (status) => {
  return STATUS_STYLES[status] || STATUS_STYLES['default'];
};

/**
 * Generates all styles for the dashboard page
 */
export const getStyles = (isMobile = false) => ({
  container: {
    fontFamily: "'Inter', sans-serif",
    color: '#1e293b',
    padding: isMobile ? '16px' : '24px',
    paddingBottom: isMobile ? '96px' : '24px' // Extra padding for bottom nav
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isMobile ? '16px' : '24px',
    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
    padding: isMobile ? '20px 16px' : '28px 32px',
    borderRadius: isMobile ? '12px' : '16px',
    border: '1px solid #e2e8f0',
    flexWrap: 'wrap',
    gap: isMobile ? '12px' : '16px'
  },
  title: {
    fontSize: isMobile ? '20px' : '26px',
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: '-0.02em',
    margin: 0
  },
  subtitle: {
    color: '#ffffff',
    fontSize: isMobile ? '13px' : '15px',
    margin: '6px 0 0 0',
    opacity: 0.9
  },
  headerActions: {
    display: 'flex',
    gap: isMobile ? '8px' : '12px',
    alignItems: 'center',
    width: isMobile ? '100%' : 'auto',
    justifyContent: isMobile ? 'flex-start' : 'flex-end'
  },
  dateFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'white',
    padding: isMobile ? '8px 12px' : '10px 16px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: isMobile ? '1' : 'initial'
  },
  notificationButton: {
    width: isMobile ? '36px' : '42px',
    height: isMobile ? '36px' : '42px',
    backgroundColor: 'white',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    cursor: 'pointer',
    position: 'relative',
    flexShrink: 0
  },
  notificationDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    backgroundColor: '#ef4444',
    borderRadius: '50%'
  },
  addButton: {
    padding: isMobile ? '8px 16px' : '10px 20px',
    backgroundColor: '#14532d',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '600',
    fontSize: isMobile ? '12px' : '14px',
    color: 'white',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(20, 83, 45, 0.2)',
    transition: 'all 0.2s',
    display: isMobile ? 'none' : 'block' // Hide on mobile to save space
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: isMobile ? '12px' : '24px',
    marginBottom: isMobile ? '20px' : '32px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: isMobile ? '16px' : '24px',
    borderRadius: isMobile ? '12px' : '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9'
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isMobile ? '12px' : '16px'
  },
  statIcon: {
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    borderRadius: isMobile ? '10px' : '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '18px' : '20px'
  },
  statChange: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: isMobile ? '11px' : '12px',
    fontWeight: '600',
    padding: '4px 8px',
    borderRadius: '20px'
  },
  statValue: {
    fontSize: isMobile ? '24px' : '28px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '4px'
  },
  statTitle: {
    color: '#64748b',
    fontSize: isMobile ? '12px' : '13px',
    fontWeight: '500'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile ? '16px' : '24px',
    marginBottom: isMobile ? '20px' : '32px'
  },
  card: {
    backgroundColor: 'white',
    padding: isMobile ? '16px' : '24px',
    borderRadius: isMobile ? '12px' : '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9'
  },
  cardTitle: {
    fontSize: isMobile ? '16px' : '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: isMobile ? '16px' : '24px'
  },
  chartContainer: {
    height: isMobile ? '250px' : '300px',
    width: '100%'
  },
  productItem: {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? '10px' : '12px',
    paddingBottom: isMobile ? '12px' : '16px'
  },
  productImage: {
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    borderRadius: '8px',
    backgroundColor: '#f1f5f9',
    flexShrink: 0
  },
  productInfo: {
    flex: 1,
    minWidth: 0 // Allow text truncation
  },
  productName: {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  productSales: {
    fontSize: isMobile ? '11px' : '12px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  productRevenue: {
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '700',
    color: '#10b981',
    flexShrink: 0
  },
  viewAllButton: {
    marginTop: 'auto',
    width: '100%',
    padding: isMobile ? '10px' : '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#475569',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableCard: {
    backgroundColor: 'white',
    padding: isMobile ? '16px' : '24px',
    borderRadius: isMobile ? '12px' : '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)',
    border: '1px solid #f1f5f9'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isMobile ? '16px' : '24px'
  },
  tableViewAll: {
    color: '#3b82f6',
    background: 'none',
    border: 'none',
    fontSize: isMobile ? '13px' : '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    display: isMobile ? 'none' : 'table' // Hide table on mobile
  },
  tableHeaderCell: {
    textAlign: 'left',
    padding: '12px',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  tableCell: {
    padding: '16px 12px'
  },
  statusBadge: {
    padding: isMobile ? '4px 10px' : '6px 12px',
    borderRadius: '20px',
    fontSize: isMobile ? '11px' : '12px',
    fontWeight: '600'
  },
  // Mobile order cards
  mobileOrderCard: {
    display: isMobile ? 'block' : 'none',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '12px',
    border: '1px solid #e2e8f0'
  },
  mobileOrderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  mobileOrderId: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a'
  },
  mobileOrderAmount: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#10b981'
  },
  mobileOrderInfo: {
    display: 'grid',
    gap: '8px'
  },
  mobileOrderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px'
  },
  mobileOrderLabel: {
    color: '#64748b',
    fontWeight: '500'
  },
  mobileOrderValue: {
    color: '#0f172a',
    fontWeight: '600'
  },
  // Status screens
  pendingContainer: {
    padding: isMobile ? '16px' : '24px',
    paddingBottom: isMobile ? '96px' : '24px'
  },
  pendingCard: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: isMobile ? '12px' : '16px',
    padding: isMobile ? '24px' : '32px',
    marginBottom: isMobile ? '16px' : '24px',
    textAlign: 'center'
  },
  pendingIcon: {
    fontSize: isMobile ? '40px' : '48px',
    marginBottom: isMobile ? '12px' : '16px'
  },
  pendingTitle: {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 700,
    color: '#92400e',
    marginBottom: '8px'
  },
  pendingText: {
    color: '#a16207',
    fontSize: isMobile ? '14px' : '16px'
  },
  bannedCard: {
    backgroundColor: '#fef2f2',
    border: '1px solid #ef4444',
    borderRadius: isMobile ? '12px' : '16px',
    padding: isMobile ? '24px' : '32px',
    textAlign: 'center'
  },
  bannedTitle: {
    fontSize: isMobile ? '20px' : '24px',
    fontWeight: 700,
    color: '#991b1b',
    marginBottom: '8px'
  },
  bannedText: {
    color: '#b91c1c',
    fontSize: isMobile ? '14px' : '16px'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: isMobile ? '16px' : '24px'
  },
  infoCard: {
    background: 'white',
    padding: isMobile ? '16px' : '24px',
    borderRadius: isMobile ? '12px' : '16px',
    border: '1px solid #e2e8f0'
  },
  infoTitle: {
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: 600,
    marginBottom: isMobile ? '12px' : '16px',
    color: '#0f172a'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  infoLabel: {
    color: '#64748b',
    fontSize: isMobile ? '13px' : '14px'
  },
  infoValue: {
    fontWeight: 500,
    fontSize: isMobile ? '13px' : '14px'
  }
});

export const styles = getStyles();
