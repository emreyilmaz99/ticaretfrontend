// src/api/services/vendorReviewService.js

import apiClient from '@lib/apiClient';

export const vendorReviewService = {
  // Get all reviews with filters (vendor's reviews only)
  getAllReviews: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/v1/reviews?${queryString}`);
    return response.data;
  },

  // Get reviews for a specific product
  getProductReviews: async (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiClient.get(`/v1/products/${productId}/reviews?${queryString}`);
    return response.data;
  },

  // Get review stats
  getStats: async () => {
    const response = await apiClient.get('/v1/reviews/stats');
    return response.data;
  },

  // Store a response to a review
  storeResponse: async (reviewId, data) => {
    console.log('🚀 Sending POST request to:', `/v1/reviews/${reviewId}/response`);
    console.log('📦 Request data:', data);
    try {
      const response = await apiClient.post(`/v1/reviews/${reviewId}/response`, data);
      console.log('✅ Response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error details:', error.response?.data);
      throw error;
    }
  },

  // Delete a response
  deleteResponse: async (responseId) => {
    const response = await apiClient.delete(`/v1/vendor/review-responses/${responseId}`);
    return response;
  },
};

export default vendorReviewService;
