import apiClient from '@lib/apiClient';

export const loginAdmin = async (credentials) => {
  const response = await apiClient.post('/v1/admin/login', credentials);
  if (response.data.success && response.data.data?.token) {
    localStorage.setItem('auth_token', response.data.data.token);
    localStorage.setItem('user_type', response.data.data.user_type || 'admin');
  }
  return response;
};

export const getAdminProfile = () => {
  return apiClient.get('/v1/me');
};
