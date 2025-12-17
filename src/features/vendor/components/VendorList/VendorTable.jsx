// src/features/vendor/components/VendorList/VendorTable.jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import VendorRow from './VendorRow';
import Pagination from '../../../../components/ui/Pagination';
import { styles } from '../../shared/styles';

const VendorTable = React.memo(({
  vendors,
  isLoading,
  searchTerm,
  activeFilters,
  meta,
  currentPage,
  itemsPerPage,
  onPageChange,
  onEdit,
  onApprove,
  onReject,
  onBan,
  onCategory,
  showCategoryButton = false,
}) => {
  // Client-side filtering for search and advanced filters
  const filteredVendors = useMemo(() => {
    let filtered = vendors;

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(vendor =>
        (vendor.storeName || '').toLowerCase().includes(lowerSearch) ||
        (vendor.email || '').toLowerCase().includes(lowerSearch)
      );
    }

    // Advanced filters
    if (activeFilters) {
      // Revenue filter
      if (activeFilters.minRevenue || activeFilters.maxRevenue) {
        filtered = filtered.filter(vendor => {
          const revenueValue = parseFloat((vendor.revenue || '0').replace(/[^0-9.-]+/g, ''));
          if (activeFilters.minRevenue && revenueValue < parseFloat(activeFilters.minRevenue)) return false;
          if (activeFilters.maxRevenue && revenueValue > parseFloat(activeFilters.maxRevenue)) return false;
          return true;
        });
      }

      // Sort by filter
      if (activeFilters.sortBy && activeFilters.sortBy !== 'all') {
        filtered = [...filtered].sort((a, b) => {
          switch (activeFilters.sortBy) {
            case 'revenue-high':
              return parseFloat((b.revenue || '0').replace(/[^0-9.-]+/g, '')) - parseFloat((a.revenue || '0').replace(/[^0-9.-]+/g, ''));
            case 'revenue-low':
              return parseFloat((a.revenue || '0').replace(/[^0-9.-]+/g, '')) - parseFloat((b.revenue || '0').replace(/[^0-9.-]+/g, ''));
            case 'rating-high':
              return (b.rating || 0) - (a.rating || 0);
            case 'rating-low':
              return (a.rating || 0) - (b.rating || 0);
            default:
              return 0;
          }
        });
      }
    }

    return filtered;
  }, [vendors, searchTerm, activeFilters]);

  const totalPages = meta?.last_page || 1;

  if (isLoading) {
    return (
      <div style={styles.card}>
        <div style={styles.loadingContainer}>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Mağaza Bilgisi</th>
            <th style={styles.th}>Yetkili</th>
            <th style={styles.th}>Ciro</th>
            <th style={styles.th}>Puan</th>
            <th style={{ ...styles.th, textAlign: 'right' }}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.length === 0 ? (
            <tr>
              <td colSpan="5" style={styles.emptyCell}>
                {searchTerm ? 'Arama kriterine uygun satıcı bulunamadı.' : 'Satıcı bulunamadı.'}
              </td>
            </tr>
          ) : (
            filteredVendors.map((vendor) => (
              <VendorRow
                key={vendor.id}
                vendor={vendor}
                onEdit={onEdit}
                onApprove={onApprove}
                onReject={onReject}
                onBan={onBan}
                onCategory={onCategory}
                showCategoryButton={showCategoryButton}
              />
            ))
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div style={styles.paginationContainer}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={meta?.total || 0}
            perPage={itemsPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
});

VendorTable.displayName = 'VendorTable';

VendorTable.propTypes = {
  vendors: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  searchTerm: PropTypes.string,
  activeFilters: PropTypes.object,
  meta: PropTypes.object,
  currentPage: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
  onBan: PropTypes.func.isRequired,
  onCategory: PropTypes.func,
  showCategoryButton: PropTypes.bool,
};

export default VendorTable;
