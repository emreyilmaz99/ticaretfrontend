/**
 * Vendor Payout API
 * Satıcı çekim talepleri endpoint'leri
 * API Docs: /api/v1/vendor/payouts
 */

import apiClient from '@/lib/apiClient';

/**
 * Request Payout - Çekim talebi oluştur
 * POST /api/v1/vendor/payouts/request
 * @param {Object} data - Payout request data
 * @param {number} data.amount - Amount (min: 100, max: 50000)
 * @param {string} data.method - Payment method (optional)
 * @param {string} data.reference - Reference note (optional)
 */
export const requestPayout = async (data) => {
  const response = await apiClient.post('/v1/vendor/payouts/request', data);
  return response.data;
};

/**
 * List Payouts - Çekim talepleri listesi
 * GET /api/v1/vendor/payouts
 * @param {Object} params - Query parameters
 * @param {number} params.per_page - Items per page (default: 15)
 * @param {number} params.page - Page number
 */
export const getPayouts = async (params = {}) => {
  const response = await apiClient.get('/v1/vendor/payouts', { params });
  return response.data;
};
