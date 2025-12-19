import apiClient from '@lib/apiClient';

export const vendorLogin = async (credentials) => {
  const response = await apiClient.post('/v1/vendor/login', credentials);
  if (response.data.success && response.data.data?.token) {
    localStorage.setItem('auth_token', response.data.data.token);
    localStorage.setItem('user_type', response.data.data.user_type || 'vendor');
  }
  return response.data;
};

export const vendorLogout = async () => {
  const response = await apiClient.post('/v1/vendor/logout');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_type');
  return response.data;
};

export const getVendorProfile = async () => {
  const response = await apiClient.get('/v1/me');
  return response.data;
};

export const vendorRegister = async (payload) => {
  // Pre-application submission
  const response = await apiClient.post('/v1/vendor-applications', payload);
  return response.data;
};

export const submitFullApplication = async (id, payload) => {
  // Full application submission
  const response = await apiClient.post(`/v1/vendor-applications/${id}/submit-full`, payload);
  return response.data;
};

// Update vendor profile. If `data` contains File objects (logo/cover), send as FormData.
export const updateVendorProfile = async (data) => {
  let body = data;

  // detect files - FormData için Content-Type manuel set edilMEMELİ (axios otomatik boundary ekler)
  if (data instanceof FormData) {
    body = data;
  } else if (data.logo || data.cover) {
    const fd = new FormData();
    Object.keys(data).forEach(key => {
      const val = data[key];
      if (val !== undefined && val !== null) {
        fd.append(key, val);
      }
    });
    body = fd;
  }

  const response = await apiClient.put('/v1/vendor/profile', body);
  return response.data;
};

export const createVendorAddress = async (payload) => {
  const response = await apiClient.post('/v1/addresses', payload);
  return response.data;
};

export const createVendorBankAccount = async (payload) => {
  const response = await apiClient.post('/v1/vendor/bank-accounts', payload);
  return response.data;
};

export const completeOnboarding = async () => {
  const response = await apiClient.post('/v1/vendor/onboarding/complete');
  return response.data;
};
