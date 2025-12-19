import apiClient from '@lib/apiClient';

/**
 * Get all user addresses
 */
export const getUserAddresses = async () => {
  const response = await apiClient.get('/v1/addresses');
  return response.data;
};

/**
 * Get a specific address
 */
export const getUserAddress = async (id) => {
  const response = await apiClient.get(`/v1/addresses/${id}`);
  return response.data;
};

/**
 * Create a new address
 */
export const createUserAddress = async (data) => {
  const response = await apiClient.post('/v1/addresses', data);
  return response.data;
};

/**
 * Update an address
 */
export const updateUserAddress = async (id, data) => {
  const response = await apiClient.put(`/v1/addresses/${id}`, data);
  return response.data;
};

/**
 * Delete an address
 */
export const deleteUserAddress = async (id) => {
  const response = await apiClient.delete(`/v1/addresses/${id}`);
  return response.data;
};

/**
 * Set address as default
 */
export const setDefaultUserAddress = async (id) => {
  const response = await apiClient.put(`/v1/addresses/${id}/default`);
  return response.data;
};

/**
 * Restore a soft-deleted address
 */
export const restoreUserAddress = async (id) => {
  const response = await apiClient.post(`/v1/addresses/${id}/restore`);
  return response.data;
};
