// src/pages/admin/Orders/index.jsx
import React, { useState } from 'react';
import { 
  FaSearch, FaFilter, FaDownload, FaPrint, 
  FaShoppingBag, FaClock, FaUndo, FaWallet, 
  FaEye, FaCheck, FaTruck, FaTimes, FaBoxOpen, FaFileExcel,
  FaStore, FaUsers, FaUser
} from 'react-icons/fa';

import { getStyles } from './styles';
import { useAdminOrders } from './useAdminOrders';
import OrderDetailModal from './OrderDetailModal';

const AdminOrders = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const styles = getStyles(isMobile);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Custom hook'tan veri ve fonksiyonlar
  const {
    orders,
    stats,
    isLoadingOrders,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    updateOrderStatus,
    cancelOrder,
    handleExportExcel,
    handlePrint
  } = useAdminOrders();

  // Gelişmiş Filtreler
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const getStatusText = (status) => {
    const map = {
      pending: 'Onay Bekliyor',
      processing: 'Hazırlanıyor',
      shipped: 'Kargoya Verildi',
      delivered: 'Teslim Edildi',
      cancelled: 'İptal Edildi'
    };
    return map[status] || status;
  };

  return (
    <div style={styles.container}>
      
      {/* Header */}
      <div style={{
        ...styles.header,
        flexDirection: isMobile ? 'column' : styles.header.flexDirection,
        gap: isMobile ? '16px' : '0'
      }}>
        <div style={styles.titleGroup}>
          <h1 style={{
            ...styles.title,
            fontSize: isMobile ? '24px' : styles.title.fontSize
          }}>Siparişler</h1>
          <p style={{
            ...styles.subtitle,
            fontSize: isMobile ? '13px' : styles.subtitle.fontSize
          }}>Mağazanıza gelen siparişleri buradan yönetebilirsiniz.</p>
        </div>
        <div style={{
          ...styles.headerActions,
          width: isMobile ? '100%' : 'auto',
          gap: isMobile ? '8px' : styles.headerActions.gap
        }}>
          <button style={{
            ...styles.exportBtn,
            flex: isMobile ? '1' : 'none',
            minHeight: isMobile ? '44px' : 'auto',
            fontSize: isMobile ? '14px' : styles.exportBtn.fontSize
          }} onClick={handlePrint}>
            <FaPrint /> Yazdır
          </button>
          <button style={{
            ...styles.exportBtn,
            flex: isMobile ? '1' : 'none',
            minHeight: isMobile ? '44px' : 'auto',
            fontSize: isMobile ? '14px' : styles.exportBtn.fontSize
          }} onClick={handleExportExcel}>
            <FaFileExcel /> {isMobile ? 'Excel' : 'Excel İndir'}
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{
        ...styles.statsGrid,
        gridTemplateColumns: isMobile ? '1fr 1fr' : styles.statsGrid.gridTemplateColumns,
        gap: isMobile ? '12px' : styles.statsGrid.gap
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            ...styles.statCard,
            padding: isMobile ? '14px' : styles.statCard.padding
          }}>
            <div style={styles.statInfo}>
              <span style={{
                ...styles.statLabel,
                fontSize: isMobile ? '11px' : styles.statLabel.fontSize
              }}>{stat.label}</span>
              <span style={{
                ...styles.statValue,
                fontSize: isMobile ? '20px' : styles.statValue.fontSize
              }}>{stat.value}</span>
            </div>
            <div style={{
              ...styles.statIconBox(stat.color),
              width: isMobile ? '40px' : styles.statIconBox(stat.color).width,
              height: isMobile ? '40px' : styles.statIconBox(stat.color).height
            }}>
              {stat.icon === 'FaShoppingBag' && <FaShoppingBag size={20} />}
              {stat.icon === 'FaClock' && <FaClock size={20} />}
              {stat.icon === 'FaWallet' && <FaWallet size={20} />}
              {stat.icon === 'FaUndo' && <FaUndo size={20} />}
              {stat.icon === 'FaStore' && <FaStore size={20} />}
              {stat.icon === 'FaUsers' && <FaUsers size={20} />}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={{ ...styles.toolbarTop, flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '16px' }}>
          <div style={{ ...styles.searchWrapper, width: isMobile ? '100%' : 'auto' }}>
            <FaSearch style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Sipariş no veya müşteri ara..." 
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ ...styles.controlsRight, width: isMobile ? '100%' : 'auto', flexDirection: isMobile ? 'column' : 'row' }}>
            <select style={{ ...styles.statusSelect, width: isMobile ? '100%' : 'auto' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tüm Siparişler</option>
              <option value="pending">Onay Bekleyenler</option>
              <option value="processing">Hazırlananlar</option>
              <option value="shipped">Kargodakiler</option>
              <option value="delivered">Tamamlananlar</option>
              <option value="cancelled">İptaller</option>
            </select>
            <button 
              style={{ ...styles.filterBtn(showAdvancedFilters), width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start', minHeight: isMobile ? '44px' : 'auto' }}
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <FaFilter /> {showAdvancedFilters ? 'Kapat' : 'Filtrele'}
            </button>
          </div>
        </div>

        {/* Gelişmiş Filtreler */}
        {showAdvancedFilters && (
          <div style={{
            ...styles.advancedFilterPanel,
            padding: isMobile ? '16px' : styles.advancedFilterPanel.padding
          }}>
            <div style={styles.advFilterGroup}>
              <label style={{
                ...styles.advLabel,
                fontSize: isMobile ? '13px' : styles.advLabel.fontSize
              }}>Tutar Aralığı (TL)</label>
              <div style={{
                ...styles.advInputRow,
                flexDirection: isMobile ? 'column' : styles.advInputRow.flexDirection,
                gap: isMobile ? '8px' : '12px'
              }}>
                <input 
                  type="number" 
                  placeholder="Min" 
                  style={{
                    ...styles.advInput,
                    minHeight: isMobile ? '44px' : 'auto',
                    fontSize: isMobile ? '16px' : styles.advInput.fontSize
                  }} 
                  value={minAmount} 
                  onChange={(e) => setMinAmount(e.target.value)} 
                />
                {!isMobile && <span style={{color: '#9CA3AF'}}>-</span>}
                <input 
                  type="number" 
                  placeholder="Max" 
                  style={{
                    ...styles.advInput,
                    minHeight: isMobile ? '44px' : 'auto',
                    fontSize: isMobile ? '16px' : styles.advInput.fontSize
                  }} 
                  value={maxAmount} 
                  onChange={(e) => setMaxAmount(e.target.value)} 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TABLE OR CARDS */}
      {isMobile ? (
        // Mobile Card View
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {isLoadingOrders ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', backgroundColor: 'white', borderRadius: '12px' }}>
              Yükleniyor...
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div 
                key={order.id} 
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer'
                }}
                onClick={() => handleViewDetail(order)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: '#059669', marginBottom: '4px' }}>
                      {order.id}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{order.items} Ürün</div>
                  </div>
                  <span style={styles.statusBadge(order.status)}>{getStatusText(order.status)}</span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaUser size={12} style={{ color: '#6B7280' }} />
                    <span style={{ fontWeight: '600', color: '#111827' }}>{order.customer.name}</span>
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '12px', paddingLeft: '20px' }}>{order.customer.email}</div>
                  {order.vendors && order.vendors.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaStore size={12} style={{ color: '#6B7280' }} />
                      <span style={{ color: '#111827' }}>{order.vendors[0].name}</span>
                      {order.vendors.length > 1 && (
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>+{order.vendors.length - 1}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>Tutar</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#059669' }}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6B7280', textAlign: 'right' }}>Tarih</div>
                    <div style={{ fontSize: '12px', color: '#111827' }}>{order.date}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280', backgroundColor: 'white', borderRadius: '12px' }}>
              Sipariş bulunamadı.
            </div>
          )}
        </div>
      ) : (
        // Desktop Table View
        <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sipariş No</th>
              <th style={styles.th}>Müşteri</th>
              <th style={styles.th}>Satıcı</th>
              <th style={styles.th}>Tarih</th>
              <th style={styles.th}>Tutar</th>
              <th style={styles.th}>Durum</th>
              <th style={styles.th}>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingOrders ? (
              <tr>
                <td colSpan="7" style={{padding:'60px', textAlign:'center', color:'#6B7280'}}>
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'10px'}}>
                    <span>Yükleniyor...</span>
                  </div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <tr 
                  key={order.id} style={styles.tr}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => handleViewDetail(order)}
                >
                  <td style={styles.td}>
                    <span style={styles.orderId}>{order.id}</span>
                    <div style={{fontSize:'12px', color:'#6B7280', marginTop:'4px'}}>{order.items} Ürün</div>
                  </td>
                  <td style={styles.td}>
                    <div 
                      style={styles.customerInfo}
                      title={`Email: ${order.customer.email}\nTelefon: ${order.customer.phone || 'Belirtilmemiş'}`}
                    >
                      <span style={styles.customerName}>{order.customer.name}</span>
                      <span style={styles.customerEmail}>{order.customer.email}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    {order.vendors && order.vendors.length > 0 ? (
                      <div 
                        style={{...styles.customerInfo, cursor: 'pointer'}}
                        title={order.vendors.map(v => 
                          `${v.name}\nEmail: ${v.email}\nTelefon: ${v.phone || 'Belirtilmemiş'}\nVergi No: ${v.tax_id || 'Belirtilmemiş'}`
                        ).join('\n\n')}
                      >
                        <span style={styles.customerName}>{order.vendors[0].name}</span>
                        {order.vendors.length > 1 && (
                          <span style={{fontSize:'12px', color:'#6B7280'}}>+{order.vendors.length - 1} satıcı</span>
                        )}
                      </div>
                    ) : (
                      <span style={{fontSize:'13px', color:'#9CA3AF'}}>-</span>
                    )}
                  </td>
                  <td style={styles.td}><span style={styles.date}>{order.date}</span></td>
                  <td style={styles.td}>
                    <span style={styles.price}>
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(order.amount)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(order.status)}>{getStatusText(order.status)}</span>
                  </td>
                  
                  {/* --- SADECE GÖZAT BUTONU KALDI --- */}
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      <button 
                        style={{...styles.btnDetail, border: 'none', backgroundColor: 'transparent'}} 
                        onClick={(e) => {e.stopPropagation(); handleViewDetail(order);}}
                        title="Detay"
                      >
                        <FaEye size={16} color="#64748B" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" style={{padding:'60px', textAlign:'center', color:'#6B7280'}}>Sipariş bulunamadı.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      <OrderDetailModal 
        order={selectedOrder} isOpen={isModalOpen} onClose={handleCloseModal}
        onStatusUpdate={updateOrderStatus} onCancel={cancelOrder} styles={styles}
      />
    </div>
  );
};

export default AdminOrders;