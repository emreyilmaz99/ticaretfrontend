// src/features/admin/api/vendorPayoutsApi.js
import apiClient from '../../../lib/apiClient';

/**
 * Vendor Payouts API Service
 * Admin paneli için satıcı hakediş yönetimi
 */

/**
 * Hakediş listesini getir (paginated)
 * @param {Object} params - Query parameters
 * @param {number} params.page - Sayfa numarası (default: 1)
 * @param {number} params.per_page - Sayfa başına kayıt (default: 15)
 * @returns {Promise} API response
 */
export const getPayouts = async ({ page = 1, per_page = 15 } = {}) => {
  try {
    const response = await apiClient.get('/v1/admin/vendors/payouts', {
      params: { page, per_page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching payouts:', error);
    throw error;
  }
};

/**
 * Belirli bir hakedişin detayını getir
 * @param {number} payoutId - Hakediş ID
 * @returns {Promise} API response
 */
export const getPayoutDetail = async (payoutId) => {
  try {
    const response = await apiClient.get(`/v1/admin/vendors/payouts/${payoutId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching payout detail:', error);
    throw error;
  }
};

/**
 * Hakediş durumunu güncelle
 * @param {number} payoutId - Hakediş ID
 * @param {string} status - Yeni durum: pending, approved, rejected, processed
 * @returns {Promise} API response
 */
export const updatePayoutStatus = async (payoutId, status) => {
  try {
    const response = await apiClient.put(
      `/v1/admin/vendors/payouts/${payoutId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating payout status:', error);
    throw error;
  }
};

/**
 * Hakedişi onayla (approve)
 * @param {number} payoutId - Hakediş ID
 * @returns {Promise} API response
 */
export const approvePayout = async (payoutId) => {
  return updatePayoutStatus(payoutId, 'approved');
};

/**
 * Hakedişi reddet (reject)
 * @param {number} payoutId - Hakediş ID
 * @returns {Promise} API response
 */
export const rejectPayout = async (payoutId) => {
  return updatePayoutStatus(payoutId, 'rejected');
};

/**
 * Hakedişi işlendi olarak işaretle (processed)
 * @param {number} payoutId - Hakediş ID
 * @returns {Promise} API response
 */
export const markPayoutAsProcessed = async (payoutId) => {
  return updatePayoutStatus(payoutId, 'processed');
};

export default {
  getPayouts,
  getPayoutDetail,
  updatePayoutStatus,
  approvePayout,
  rejectPayout,
  markPayoutAsProcessed,
};
