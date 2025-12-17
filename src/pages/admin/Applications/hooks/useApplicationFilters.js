// src/pages/admin/Applications/hooks/useApplicationFilters.js
import { useState, useMemo } from 'react';

/**
 * Application filtering and search logic
 * Handles search term, status filter, and hover state for application tables
 */
const useApplicationFilters = (applications = [], vendors = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  // Filter applications (pre-applications)
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = !searchTerm || 
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone?.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  // Filter vendors (pending activation)
  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = !searchTerm || 
        vendor.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.phone?.includes(searchTerm);
      
      return matchesSearch;
    });
  }, [vendors, searchTerm]);

  // Calculate stats for pre-applications
  const preStats = useMemo(() => {
    const apps = applications || [];
    return [
      {
        title: 'Toplam Başvuru',
        value: apps.length,
        color: '#3b82f6',
        filter: 'all'
      },
      {
        title: 'Bekleyen',
        value: apps.filter(a => a.status === 'pending').length,
        color: '#f59e0b',
        filter: 'pending'
      },
      {
        title: 'Onaylanan',
        value: apps.filter(a => a.status === 'approved').length,
        color: '#10b981',
        filter: 'approved'
      },
      {
        title: 'Reddedilen',
        value: apps.filter(a => a.status === 'rejected').length,
        color: '#ef4444',
        filter: 'rejected'
      }
    ];
  }, [applications]);

  // Calculate stats for vendors
  const vendorStats = useMemo(() => {
    const vnds = vendors || [];
    return {
      total: vnds.length,
    };
  }, [vendors]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return {
    // Search & Filter State
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    hoveredRow,
    setHoveredRow,
    
    // Filtered Data
    filteredApplications,
    filteredVendors,
    
    // Stats
    preStats,
    vendorStats,
    
    // Utils
    resetFilters,
  };
};

export default useApplicationFilters;
