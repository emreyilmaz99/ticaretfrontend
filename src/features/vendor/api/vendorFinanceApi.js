/**
 * Vendor Finance API
 * Satıcı finansal işlemler endpoint'leri
 * API Docs: /api/v1/vendor/finance
 */

import apiClient from '@/lib/apiClient';

/**
 * Dashboard Stats - Finansal özet
 * GET /api/v1/vendor/finance/dashboard
 */
export const getFinanceDashboard = async () => {
  const response = await apiClient.get('/v1/vendor/finance/dashboard');
  return response.data;
};

/**
 * Earnings List - Kazançlar listesi (paginated)
 * GET /api/v1/vendor/finance/earnings
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status: pending, available, settled, refunded
 * @param {string} params.from - Start date (Y-m-d)
 * @param {string} params.to - End date (Y-m-d)
 * @param {string} params.order_number - Filter by order number
 * @param {number} params.per_page - Items per page (default: 20)
 * @param {number} params.page - Page number
 */
export const getEarnings = async (params = {}) => {
  const response = await apiClient.get('/v1/vendor/finance/earnings', { params });
  return response.data;
};

/**
 * Earnings Chart - Grafik verisi
 * GET /api/v1/vendor/finance/chart
 * @param {Object} params - Query parameters
 * @param {string} params.period - Grouping: daily, weekly, monthly, yearly (default: daily)
 * @param {string} params.from - Start date (default: 30 days ago)
 * @param {string} params.to - End date (default: today)
 */
export const getEarningsChart = async (params = {}) => {
  const response = await apiClient.get('/v1/vendor/finance/chart', { params });
  return response.data;
};

/**
 * Withholding Tax Report - Stopaj raporu
 * GET /api/v1/vendor/finance/tax-report
 * @param {Object} params - Query parameters
 * @param {number} params.year - Year (required, e.g., 2025)
 * @param {number} params.quarter - Quarter: 1, 2, 3, 4 (optional)
 */
export const getTaxReport = async (params) => {
  const response = await apiClient.get('/v1/vendor/finance/tax-report', { params });
  return response.data;
};
